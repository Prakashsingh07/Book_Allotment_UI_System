using BookAllotment.API.DTOs;
using BookAllotment.API.Models;
using BookAllotment.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace BookAllotment.API.Controllers
{
    [ApiController]
    [Route("api/allotments")]
    [Authorize]
    public class AllotmentController : ControllerBase
    {
        private readonly AllotmentService _service;
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AllotmentController(AllotmentService service, AppDbContext context, IConfiguration config)
        {
            _service = service;
            _context = context;
            _config  = config;
        }

        // ✅ USER → VIEW MY ISSUED BOOKS
        [HttpGet("my")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> MyBooks()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim);
            var result = await _service.GetByUser(userId);
            return Ok(result);
        }

        // ✅ USER → VIEW MY ACTIVITY
        [HttpGet("my-activity")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> MyActivity()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim);
            var result = await _service.GetUserActivity(userId);
            return Ok(result);
        }

        // ✅ USER → RETURN BOOK
        [HttpPost("return/{id}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> Return(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim);
            await _service.ReturnBook(id, userId);
            return Ok(new { message = "Book returned successfully" });
        }

        // ✅ USER → PAY FINE for an overdue allotment
        [HttpPost("pay-fine/{id}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> PayFine(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null) return Unauthorized();
                int userId = int.Parse(userIdClaim);

                var allotment = await _context.Allotments.FindAsync(id);
                if (allotment == null) return NotFound(new { message = "Allotment not found." });
                if (allotment.UserId != userId) return Unauthorized(new { message = "Not your allotment." });
                if (allotment.FinePaid) return BadRequest(new { message = "Fine already paid." });

                // Calculate the fine at payment time
                var finePerDay = _config.GetValue<decimal>("LibrarySettings:FinePerDay", 5);
                var now        = DateTime.UtcNow;
                decimal fine   = 0;

                bool validDue = allotment.DueDate.Year >= 2000;
                if (validDue && allotment.DueDate < now)
                {
                    int daysLate = (int)(now - allotment.DueDate).TotalDays;
                    fine = daysLate * finePerDay;
                }

                if (fine <= 0) return BadRequest(new { message = "No overdue fine to pay." });

                // Record the payment
                var payment = new FinePayment
                {
                    AllotmentId = id,
                    UserId      = userId,
                    AmountPaid  = fine,
                    PaidAt      = now,
                    Status      = "Paid"
                };

                allotment.FinePaid = true;

                _context.FinePayments.Add(payment);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message    = "Fine paid successfully.",
                    amountPaid = fine,
                    paidAt     = now
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Payment failed.", detail = ex.Message });
            }
        }

        // ✅ ADMIN → ALLOT BOOK MANUALLY
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Allot([FromBody] AllotBookDto dto)
        {
            var adminEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (adminEmail == null) return Unauthorized();
            await _service.AllotBook(dto.UserId, dto.BookId, adminEmail);
            return Ok(new { message = "Book allotted successfully" });
        }

        // ✅ ADMIN → VIEW ALL ALLOTMENTS
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAll();
            return Ok(result);
        }

        // ✅ ADMIN → REVOKE BOOK
        [HttpPost("revoke/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Revoke(int id)
        {
            await _service.Revoke(id);
            return Ok(new { message = "Book revoked successfully" });
        }
    }
}
