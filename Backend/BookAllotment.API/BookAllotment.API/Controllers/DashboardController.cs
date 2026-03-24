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
            var now = DateTime.UtcNow;

            var allotmentQuery = _context.Allotments
                .Include(a => a.Book)
                .AsQueryable();

            // Apply optional filters
            if (fromDate.HasValue) allotmentQuery = allotmentQuery.Where(a => a.AllotDate >= fromDate.Value);
            if (toDate.HasValue)   allotmentQuery = allotmentQuery.Where(a => a.AllotDate <= toDate.Value);
            if (userId.HasValue)   allotmentQuery = allotmentQuery.Where(a => a.UserId == userId.Value);
            if (bookId.HasValue)   allotmentQuery = allotmentQuery.Where(a => a.BookId == bookId.Value);

            var allotments = await allotmentQuery.ToListAsync();

            // Books currently out with users (Status = "Allotted", not returned/revoked)
            int issuedCount = allotments.Count(a => a.Status == "Allotted");

            // Overdue = issued AND past a valid due date
            int overdueCount = allotments.Count(a =>
                a.Status == "Allotted" &&
                a.DueDate.Year >= 2000 &&
                a.DueDate < now
            );

            // Total users and books (unfiltered — always show full counts)
            int totalBooks = await _context.Books.CountAsync();
            int totalUsers = await _context.Users.CountAsync();

            // Available = books with stock > 0
            int availableCount = await _context.Books.CountAsync(b => (b.AvailableQuantity ?? 0) > 0);

            // Pending book requests (unfiltered)
            int pendingCount = await _context.BookRequests.CountAsync(r => r.Status == "Pending");

            // Most borrowed book
            var mostBorrowedBook = allotments
                .GroupBy(a => a.BookId)
                .OrderByDescending(g => g.Count())
                .Select(g => g.First().Book?.Title)
                .FirstOrDefault() ?? "N/A";

            var result = new DashboardDto
            {
                TotalBooks       = totalBooks,
                TotalUsers       = totalUsers,
                ActiveAllotments = issuedCount,    // backward compat
                OverdueBooks     = overdueCount,   // backward compat
                MostBorrowedBook = mostBorrowedBook,
                IssuedCount      = issuedCount,
                OverdueCount     = overdueCount,
                PendingCount     = pendingCount,
                AvailableCount   = availableCount
            };

            return Ok(result);
        }
    }
}
