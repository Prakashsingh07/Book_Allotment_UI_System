using BookAllotment.API.Models;
using BookAllotment.API.Repositories.Interfaces;

namespace BookAllotment.API.Services
{
    public class AllotmentService
    {
        private readonly IAllotmentRepository _allotRepo;
        private readonly IBookRepository _bookRepo;

        public AllotmentService(
            IAllotmentRepository allotRepo,
            IBookRepository bookRepo)
        {
            _allotRepo = allotRepo;
            _bookRepo = bookRepo;
        }

        // 🔹 ADMIN → ALLOT BOOK
        public async Task AllotBook(int userId, int bookId, string adminEmail)
        {
            var book = await _bookRepo.GetById(bookId);

            if (book == null)
                throw new Exception("Book not found");

            if (book.AvailableQuantity <= 0)
                throw new Exception("Book Not Available");

            book.AvailableQuantity--;

            var allot = new Allotment
            {
                UserId = userId,
                BookId = bookId,
                Status = "Allotted",
                AllotDate = DateTime.UtcNow
            };

            await _allotRepo.Add(allot);
            await _bookRepo.Update(book);
        }

        // 🔹 ADMIN → REVOKE
        public async Task Revoke(int allotmentId)
        {
            var allotment = await _allotRepo.GetById(allotmentId);
            if (allotment == null)
                throw new Exception("Allotment not found");

            if (allotment.Status != "Allotted")
                throw new Exception("Cannot revoke");

            var book = await _bookRepo.GetById(allotment.BookId);
            if (book == null)
                throw new Exception("Book not found");

            book.AvailableQuantity++;

            allotment.Status = "Revoked";

            await _bookRepo.Update(book);
            await _allotRepo.Update(allotment);
        }

        // 🔹 ADMIN → VIEW ALL ALLOTMENTS
        public async Task<IEnumerable<object>> GetAll()
        {
            var allotments = await _allotRepo.GetAll();

            return allotments.Select(a => new
            {
                id = a.Id,
                bookTitle = a.Book?.Title,
                userName = a.User?.Name,
                userEmail = a.User?.Email,
                status = a.Status,
                allotDate = a.AllotDate,
                returnDate = a.ReturnDate
            });
        }

        // 🔹 USER → VIEW MY BOOKS
        public async Task<IEnumerable<object>> GetByUser(int userId)
        {
            var allotments = await _allotRepo.GetByUser(userId);

            return allotments.Select(a => new
            {
                id = a.Id, // 🔥 VERY IMPORTANT FIX
                bookTitle = a.Book?.Title,
                status = a.Status,
                allotDate = a.AllotDate,
                returnDate = a.ReturnDate
            });
        }

        
        // 🔹 USER → VIEW MY ACTIVITY
        public async Task<IEnumerable<object>> GetUserActivity(int userId)
        {
            var activities = await _allotRepo.GetByUser(userId);

            return activities
                .OrderByDescending(a => a.AllotDate)
                .Select(a =>
                {
                    decimal fine = 0;
                    string status;

                    if (a.ReturnDate == null)
                    {
                        if (a.DueDate < DateTime.UtcNow)
                        {
                            int daysLate = (DateTime.UtcNow - a.DueDate).Days;
                            fine = daysLate * 5;
                            status = "Overdue";
                        }
                        else
                        {
                            status = "Active";
                        }
                    }
                    else
                    {
                        if (a.ReturnDate > a.DueDate)
                        {
                            int daysLate = (a.ReturnDate.Value - a.DueDate).Days;
                            fine = daysLate * 5;
                        }

                        status = "Returned";
                    }

                    return new
                    {
                        id = a.Id,
                        bookTitle = a.Book?.Title,
                        allotDate = a.AllotDate,
                        dueDate = a.DueDate,
                        returnDate = a.ReturnDate,
                        status,
                        fine
                    };
                });
        }

        // 🔹 USER → RETURN BOOK
        public async Task ReturnBook(int allotmentId, int userId)
        {
            var allotment = await _allotRepo.GetById(allotmentId);

            if (allotment == null)
                throw new Exception("Allotment not found");

            if (allotment.UserId != userId)
                throw new Exception("Unauthorized return");

            if (allotment.Status != "Allotted")
                throw new Exception("Book already returned");

            var book = await _bookRepo.GetById(allotment.BookId);
            if (book == null)
                throw new Exception("Book not found");

            book.AvailableQuantity++;

            allotment.Status = "Returned";
            allotment.ReturnDate = DateTime.UtcNow;

            await _bookRepo.Update(book);
            await _allotRepo.Update(allotment);
        }
    }
}
