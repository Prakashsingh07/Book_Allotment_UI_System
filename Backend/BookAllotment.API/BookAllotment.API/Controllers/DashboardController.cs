using BookAllotment.API.DTOs;
using BookAllotment.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookAllotment.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<DashboardDto>> GetDashboard(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] int? userId,
            [FromQuery] int? bookId)
        {
            var allotmentQuery = _context.Allotments
                .Include(a => a.Book)
                .AsQueryable();

            // 🔎 Apply Filters
            if (fromDate.HasValue)
                allotmentQuery = allotmentQuery
                    .Where(a => a.AllotDate >= fromDate.Value);

            if (toDate.HasValue)
                allotmentQuery = allotmentQuery
                    .Where(a => a.AllotDate <= toDate.Value);

            if (userId.HasValue)
                allotmentQuery = allotmentQuery
                    .Where(a => a.UserId == userId.Value);

            if (bookId.HasValue)
                allotmentQuery = allotmentQuery
                    .Where(a => a.BookId == bookId.Value);

            // 📊 Aggregations
            var totalBooks = await _context.Books.CountAsync();
            var totalUsers = await _context.Users.CountAsync();

            var activeAllotments = await allotmentQuery
                .Where(a => a.ReturnDate == null)
                .CountAsync();

            var overdueBooks = await allotmentQuery
                .Where(a => a.ReturnDate == null &&
                            a.DueDate < DateTime.UtcNow)
                .CountAsync();

            var mostBorrowedBook = await allotmentQuery
                .GroupBy(a => a.BookId)
                .OrderByDescending(g => g.Count())
                .Select(g => g.First().Book.Title)
                .FirstOrDefaultAsync();

            var result = new DashboardDto
            {
                TotalBooks = totalBooks,
                TotalUsers = totalUsers,
                ActiveAllotments = activeAllotments,
                OverdueBooks = overdueBooks,
                MostBorrowedBook = mostBorrowedBook ?? "N/A"
            };

            return Ok(result);
        }
    }
}