using BookAllotment.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookAllotment.API.Controllers
{
    [ApiController]
    [Route("api/ratings")]
    [Authorize]
    public class RatingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RatingController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> RateBook(BookRating rating)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            rating.UserId = userId;

            _context.BookRatings.Add(rating);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Rating added" });
        }

        [HttpGet("book/{bookId}")]
        public IActionResult GetBookRatings(int bookId)
        {
            var ratings = _context.BookRatings
                .Where(r => r.BookId == bookId)
                .ToList();

            if (!ratings.Any())
                return Ok(new
                {
                    averageRating = 0,
                    totalReviews = 0,
                    distribution = new int[5]
                });

            var avg = ratings.Average(r => r.Rating);

            var distribution = new int[5];

            foreach (var r in ratings)
                distribution[r.Rating - 1]++;

            return Ok(new
            {
                averageRating = Math.Round(avg, 1),
                totalReviews = ratings.Count,
                distribution
            });
        }
    }
}