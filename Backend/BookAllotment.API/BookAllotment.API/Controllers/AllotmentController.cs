using BookAllotment.API.DTOs;
using BookAllotment.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookAllotment.API.Controllers
{
    [ApiController]
    [Route("api/allotments")]
    [Authorize]
    public class AllotmentController : ControllerBase
    {
        private readonly AllotmentService _service;

        public AllotmentController(AllotmentService service)
        {
            _service = service;
        }

        // ✅ USER → VIEW MY ISSUED BOOKS
        [HttpGet("my")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> MyBooks()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
                return Unauthorized();

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

            if (userIdClaim == null)
                return Unauthorized();

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

            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim);

            await _service.ReturnBook(id, userId);

            return Ok(new { message = "Book returned successfully" });
        }

        // ✅ ADMIN → ALLOT BOOK MANUALLY
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Allot([FromBody] AllotBookDto dto)
        {
            var adminEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (adminEmail == null)
                return Unauthorized();

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