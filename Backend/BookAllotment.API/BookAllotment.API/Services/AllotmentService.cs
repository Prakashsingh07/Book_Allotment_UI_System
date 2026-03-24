using BookAllotment.API.Models;
using BookAllotment.API.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;

namespace BookAllotment.API.Services
{
    public class AllotmentService
    {
        private readonly IAllotmentRepository _allotRepo;
        private readonly IBookRepository _bookRepo;
        private readonly IConfiguration _config;

        public AllotmentService(
            IAllotmentRepository allotRepo,
            IBookRepository bookRepo,
            IConfiguration config)
        {
            _allotRepo = allotRepo;
            _bookRepo  = bookRepo;
            _config    = config;
        }

        private int     IssueDays  => _config.GetValue<int>("LibrarySettings:IssueDays", 2);
        private decimal FinePerDay => _config.GetValue<decimal>("LibrarySettings:FinePerDay", 5);

        private static bool IsValidDueDate(DateTime d) => d.Year >= 2000;

        // 🔹 ADMIN → ALLOT BOOK
        public async Task AllotBook(int userId, int bookId, string adminEmail)
        {
            var book = await _bookRepo.GetById(bookId);
            if (book == null) throw new Exception("Book not found");
            if (book.AvailableQuantity <= 0) throw new Exception("Book Not Available");

            book.AvailableQuantity--;
            var now = DateTime.UtcNow;

            var allot = new Allotment
            {
                UserId    = userId,
                BookId    = bookId,
                Status    = "Allotted",
                AllotDate = now,
                DueDate   = now.AddDays(IssueDays)
            };

            await _allotRepo.Add(allot);
            await _bookRepo.Update(book);
        }

        // 🔹 ADMIN → REVOKE
        public async Task Revoke(int allotmentId)
        {
            var allotment = await _allotRepo.GetById(allotmentId);
            if (allotment == null) throw new Exception("Allotment not found");
            if (allotment.Status != "Allotted") throw new Exception("Cannot revoke");

            var book = await _bookRepo.GetById(allotment.BookId);
            if (book == null) throw new Exception("Book not found");

            book.AvailableQuantity++;
            allotment.Status = "Revoked";

            await _bookRepo.Update(book);
            await _allotRepo.Update(allotment);
        }

        // 🔹 ADMIN → VIEW ALL ALLOTMENTS (logs)
        public async Task<IEnumerable<object>> GetAll()
        {
            var allotments = await _allotRepo.GetAll();
            var now = DateTime.UtcNow;
            var fpd = FinePerDay;

            return allotments.Select(a =>
            {
                decimal fine  = 0;
                string  status = a.Status ?? "Unknown";
                bool    valid  = IsValidDueDate(a.DueDate);

                if (a.Status == "Allotted" && valid && a.DueDate < now)
                {
                    int daysLate = (int)(now - a.DueDate).TotalDays;
                    fine   = daysLate * fpd;
                    status = "Overdue";
                }
                else if (a.Status == "Returned")
                {
                    if (valid && a.ReturnDate.HasValue && a.ReturnDate > a.DueDate)
                    {
                        int daysLate = (int)(a.ReturnDate.Value - a.DueDate).TotalDays;
                        fine = daysLate * fpd;
                    }
                    // Show "Returned & Paid" when the book was overdue and fine is paid
                    if (fine > 0 && a.FinePaid)
                        status = "Returned & Paid";
                    else
                        status = "Returned";
                }

                return (object)new
                {
                    id        = a.Id,
                    bookTitle = a.Book?.Title,
                    imageUrl  = a.Book?.ImageUrl,
                    userName  = a.User?.Name,
                    userEmail = a.User?.Email,
                    status,
                    allotDate  = a.AllotDate,
                    dueDate    = valid ? (DateTime?)a.DueDate : null,
                    returnDate = a.ReturnDate,
                    fine,
                    finePaid   = a.FinePaid,
                    finePerDay = fpd
                };
            });
        }

        // 🔹 USER → VIEW MY BOOKS
        public async Task<IEnumerable<object>> GetByUser(int userId)
        {
            var allotments = await _allotRepo.GetByUser(userId);
            var now        = DateTime.UtcNow;
            var fpd        = FinePerDay;

            return allotments.Select(a =>
            {
                bool    valid    = IsValidDueDate(a.DueDate);
                bool    overdue  = a.Status == "Allotted" && valid && a.DueDate < now;
                decimal fine     = 0;

                if (overdue)
                {
                    int daysLate = (int)(now - a.DueDate).TotalDays;
                    fine = daysLate * fpd;
                }

                return (object)new
                {
                    id         = a.Id,
                    bookTitle  = a.Book?.Title,
                    imageUrl   = a.Book?.ImageUrl,
                    status     = a.Status,
                    allotDate  = a.AllotDate,
                    dueDate    = valid ? (DateTime?)a.DueDate : null,
                    returnDate = a.ReturnDate,
                    finePaid   = a.FinePaid,
                    fine,
                    finePerDay = fpd,
                    isOverdue  = overdue
                };
            });
        }

        // 🔹 USER → VIEW MY ACTIVITY
        public async Task<IEnumerable<object>> GetUserActivity(int userId)
        {
            var activities = await _allotRepo.GetByUser(userId);
            var fpd        = FinePerDay;
            var now        = DateTime.UtcNow;

            return activities
                .OrderByDescending(a => a.AllotDate)
                .Select(a =>
                {
                    decimal fine  = 0;
                    string  status;
                    bool    valid = IsValidDueDate(a.DueDate);

                    if (a.ReturnDate == null)
                    {
                        if (valid && a.DueDate < now)
                        {
                            int daysLate = (int)(now - a.DueDate).TotalDays;
                            fine   = daysLate * fpd;
                            status = "Overdue";
                        }
                        else
                        {
                            status = "Active";
                        }
                    }
                    else
                    {
                        if (valid && a.ReturnDate > a.DueDate)
                        {
                            int daysLate = (int)(a.ReturnDate.Value - a.DueDate).TotalDays;
                            fine = daysLate * fpd;
                        }
                        status = "Returned";
                    }

                    return new
                    {
                        id         = a.Id,
                        bookTitle  = a.Book?.Title,
                        imageUrl   = a.Book?.ImageUrl,
                        allotDate  = a.AllotDate,
                        dueDate    = valid ? (DateTime?)a.DueDate : null,
                        returnDate = a.ReturnDate,
                        status,
                        fine,
                        finePaid   = a.FinePaid,
                        finePerDay = fpd
                    };
                });
        }

        // 🔹 USER → RETURN BOOK
        // Blocks return if book is overdue and fine has not been paid
        public async Task ReturnBook(int allotmentId, int userId)
        {
            var allotment = await _allotRepo.GetById(allotmentId);
            if (allotment == null) throw new Exception("Allotment not found");
            if (allotment.UserId != userId) throw new Exception("Unauthorized return");
            if (allotment.Status != "Allotted") throw new Exception("Book already returned");

            // Block return if overdue and fine not paid
            var now   = DateTime.UtcNow;
            bool valid = IsValidDueDate(allotment.DueDate);
            if (valid && allotment.DueDate < now && !allotment.FinePaid)
                throw new Exception("Please pay the overdue fine before returning this book.");

            var book = await _bookRepo.GetById(allotment.BookId);
            if (book == null) throw new Exception("Book not found");

            book.AvailableQuantity++;
            allotment.Status     = "Returned";
            allotment.ReturnDate = DateTime.UtcNow;

            await _bookRepo.Update(book);
            await _allotRepo.Update(allotment);
        }
    }
}
