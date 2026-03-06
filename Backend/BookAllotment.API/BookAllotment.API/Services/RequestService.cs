using BookAllotment.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BookAllotment.API.Services
{
    public class RequestService
    {
        private readonly AppDbContext _context;

        public RequestService(AppDbContext context)
        {
            _context = context;
        }

        //public async Task RequestBook(int userId, int bookId)
        //{
        //    var request = new BookRequest
        //    {
        //        UserId = userId,
        //        BookId = bookId,
        //        Status = "Pending",
        //        RequestDate = DateTime.UtcNow
        //    };

        //    _context.BookRequests.Add(request);
        //    await _context.SaveChangesAsync();
        //}
        public async Task RequestBook(int userId, int bookId)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
                throw new Exception("User does not exist");

            var bookExists = await _context.Books.AnyAsync(b => b.Id == bookId);
            if (!bookExists)
                throw new Exception("Book does not exist");

            var alreadyRequested = await _context.BookRequests
                .AnyAsync(r => r.UserId == userId
                            && r.BookId == bookId
                            && r.Status == "Pending");

            if (alreadyRequested)
                throw new Exception("You already requested this book.");

            var request = new BookRequest
            {
                UserId = userId,
                BookId = bookId,
                Status = "Pending",
                RequestDate = DateTime.UtcNow
            };

            _context.BookRequests.Add(request);
            await _context.SaveChangesAsync();
        }

        public async Task<List<object>> GetPending()
        {
            return await _context.BookRequests
                .Where(r => r.Status == "Pending")
                .Include(r => r.User)
                .Include(r => r.Book)
                .Select(r => new
                {
                    r.Id,
                    UserName = r.User.Name,
                    BookTitle = r.Book.Title,
                    r.Status,
                    r.RequestDate
                })
                .ToListAsync<object>();
        }

        public async Task<int> GetPendingCount()
        {
            return await _context.BookRequests
                .Where(r => r.Status == "Pending")
                .CountAsync();
        }

        public async Task Approve(int requestId, string adminEmail)
        {
            var request = await _context.BookRequests.FindAsync(requestId);
            if (request == null)
                throw new Exception("Request not found");

            if (request.Status != "Pending")
                throw new Exception("Request already processed");

            var book = await _context.Books.FindAsync(request.BookId);
            if (book == null || book.AvailableQuantity <= 0)
                throw new Exception("No copies available");

            // 🔥 Reduce available quantity
            book.AvailableQuantity -= 1;

            // 🔥 Update request
            request.Status = "Approved";
            request.ApprovedDate = DateTime.UtcNow; // add if not present

            // 🔥 Create allotment
            var allotment = new Allotment
            {
                UserId = request.UserId,
                BookId = request.BookId,
                AllotDate = DateTime.UtcNow,
                Status = "Allotted"
            };

            _context.Allotments.Add(allotment);

            await _context.SaveChangesAsync();
        }

        public async Task Reject(int requestId)
        {
            var request = await _context.BookRequests.FindAsync(requestId);

            if (request == null)
                throw new Exception("Request not found");

            if (request.Status != "Pending")
                throw new Exception("Already processed");

            request.Status = "Rejected";

            await _context.SaveChangesAsync();
        }

        //Return the Book
        public async Task ReturnBook(int allotmentId)
        {
            var allotment = await _context.Allotments
                .FirstOrDefaultAsync(a => a.Id == allotmentId);

            if (allotment == null)
                throw new Exception("Allotment not found");

            if (allotment.Status != "Allotted")
                throw new Exception("Book already returned");

            var book = await _context.Books.FindAsync(allotment.BookId);
            if (book == null)
                throw new Exception("Book not found");

            // 🔥 Increase quantity
            book.AvailableQuantity += 1;

            // 🔥 Update allotment
            allotment.Status = "Returned";
            allotment.ReturnDate = DateTime.UtcNow; // add if not present

            await _context.SaveChangesAsync();
        }

    }
}

