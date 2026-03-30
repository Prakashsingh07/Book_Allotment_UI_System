using BookAllotment.API.DTOs;
using BookAllotment.API.Models;
using BookAllotment.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookAllotment.API.Controllers
{
    // Plain class instead of record — System.Text.Json requires a parameterless constructor
    public class UpdateProfileRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
    }

    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _service;
        private readonly AppDbContext _context;

        public AuthController(AuthService service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }

        // ✅ REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var token = await _service.Register(dto);
            return Ok(new { token });
        }

        // ✅ LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var token = await _service.Login(dto);
            return Ok(new { token });
        }

        // ============================================
        // ✅ USER — GET & UPDATE PROFILE
        // ============================================

        [Authorize(Roles = "User")]
        [HttpGet("me")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            int userId = int.Parse(userIdClaim);
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("User not found");

            return Ok(new { id = user.Id, name = user.Name, email = user.Email, role = user.Role });
        }

        [Authorize(Roles = "User")]
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null) return Unauthorized();

                int userId = int.Parse(userIdClaim);
                var user = await _context.Users.FindAsync(userId);
                if (user == null) return NotFound("User not found");

                if (!string.IsNullOrWhiteSpace(dto.NewPassword))
                {
                    if (string.IsNullOrWhiteSpace(dto.CurrentPassword))
                        return BadRequest(new { message = "Current password is required to set a new password." });

                    if (string.IsNullOrWhiteSpace(user.PasswordHash))
                        return BadRequest(new { message = "Account has no password set. Please contact support." });

                    bool valid = false;
                    try { valid = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash); }
                    catch { return BadRequest(new { message = "Current password verification failed." }); }

                    if (!valid)
                        return BadRequest(new { message = "Current password is incorrect." });

                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
                }

                user.Name = dto.Name;
                user.Email = dto.Email;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Profile updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }

        // ============================================
        // ✅ ADMIN — GET & UPDATE PROFILE
        // ============================================

        [Authorize(Roles = "Admin")]
        [HttpGet("admin/me")]
        public async Task<IActionResult> GetAdminProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            int userId = int.Parse(userIdClaim);
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("Admin not found");  

            return Ok(new { id = user.Id, name = user.Name, email = user.Email, role = user.Role });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("admin/update-profile")]
        public async Task<IActionResult> UpdateAdminProfile([FromBody] UpdateProfileRequest dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null) return Unauthorized();

                int userId = int.Parse(userIdClaim);
                var user = await _context.Users.FindAsync(userId);
                if (user == null) return NotFound("Admin not found");

                if (!string.IsNullOrWhiteSpace(dto.NewPassword))
                {
                    if (string.IsNullOrWhiteSpace(dto.CurrentPassword))
                        return BadRequest(new { message = "Current password is required to set a new password." });

                    if (string.IsNullOrWhiteSpace(user.PasswordHash))
                        return BadRequest(new { message = "Account has no password set. Please contact support." });

                    bool valid = false;
                    try { valid = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash); }
                    catch { return BadRequest(new { message = "Current password verification failed." }); }

                    if (!valid)
                        return BadRequest(new { message = "Current password is incorrect." });

                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
                }

                user.Name = dto.Name;
                user.Email = dto.Email;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Profile updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }
    }
}
