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

        // ✅ USER → VIEW MY ACTIVITY (NEW)
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
            return Ok("Book returned successfully");
        }

        // ✅ ADMIN → ALLOT BOOK MANUALLY
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Allot([FromBody] AllotBookDto dto)
        {
            var adminEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (adminEmail == null)
                return Unauthorized();

            await _service.AllotBook(dto.UserId, dto.BookId, adminEmail);
            return Ok("Book allotted successfully");
        }

        // ✅ ADMIN → VIEW ALL ALLOTMENTS
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAll());
        }

        // ✅ ADMIN → REVOKE BOOK
        [Authorize(Roles = "Admin")]
        [HttpPost("revoke/{id}")]
        public async Task<IActionResult> Revoke(int id)
        {
            await _service.Revoke(id);
            return Ok("Book revoked successfully");
        }
    }
}