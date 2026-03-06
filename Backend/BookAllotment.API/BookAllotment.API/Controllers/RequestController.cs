using BookAllotment.API.Models;
using BookAllotment.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookAllotment.API.Controllers
{
    [Route("api/requests")]
    [ApiController]
    [Authorize]
    public class RequestController : ControllerBase
    {

        private readonly RequestService _service;
        private readonly AppDbContext _context;
       

        public RequestController(RequestService service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }

        // USER → REQUEST BOOK


        [HttpPost("{bookId}")]
        public async Task<IActionResult> RequestBook(int bookId)
        {
            try
            {
                var claim = User.FindFirst(ClaimTypes.NameIdentifier);

                if (claim == null)
                    return BadRequest("User ID claim missing");

                var userId = int.Parse(claim.Value);

                // ✅ PASTE HERE
                await _service.RequestBook(userId, bookId);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }


        // ADMIN → VIEW PENDING
        [Authorize(Roles = "Admin")]
        [HttpGet("pending")]
        public async Task<IActionResult> GetPending()
        {
            return Ok(await _service.GetPending());
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("pending/count")]
        public async Task<IActionResult> GetPendingCount()
        {
            var count = await _context.BookRequests
                .Where(r => r.Status == "Pending")
                .CountAsync();

            return Ok(count);
        }

        // ADMIN → APPROVE
        [Authorize(Roles = "Admin")]
        [HttpPost("approve/{requestId}")]
        public async Task<IActionResult> Approve(int requestId)
        {
            var adminEmail = User.FindFirst(ClaimTypes.Email).Value;

            await _service.Approve(requestId, adminEmail);

            return Ok();
        }

        //Return Books
        [Authorize(Roles = "User")]
        [HttpPost("return/{allotmentId}")]
        public async Task<IActionResult> Return(int allotmentId)
        {
            await _service.ReturnBook(allotmentId);
            return Ok();
        }

        //Reject
        [HttpPost("reject/{requestId}")]
        public async Task<IActionResult> Reject(int requestId)
        {
            try
            {
                await _service.Reject(requestId);
                return NoContent(); // 🔥 clean
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}

