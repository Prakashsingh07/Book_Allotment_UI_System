using BookAllotment.API.Models;
using BookAllotment.API.Repositories.Interfaces;
using BookAllotment.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace BookAllotment.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IAllotmentRepository _allotRepo;
        private readonly IBookLogRepository _logRepo;
        private readonly IConfiguration _config;

        public AdminController(
            IUserRepository userRepo,
            IAllotmentRepository allotRepo,
            IBookLogRepository logRepo,
            IConfiguration config)
        {
            _userRepo = userRepo;
            _allotRepo = allotRepo;
            _logRepo = logRepo;
            _config = config;
        }

        // ================= USERS =================

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userRepo.GetAll();
            return Ok(users);
        }

        [HttpPost("users")]
        public async Task<IActionResult> AddUser(User user)
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Default@123");
            user.IsActive = true;
            await _userRepo.Add(user);
            return Ok();
        }

        [HttpPut("user-status/{id}")]
        public async Task<IActionResult> UpdateUserStatus(int id, bool status)
        {
            var user = await _userRepo.GetById(id);
            if (user == null) return NotFound("User not found");
            user.IsActive = status;
            await _userRepo.Update(user);
            return Ok("User status updated");
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updated)
        {
            var user = await _userRepo.GetById(id);
            if (user == null) return NotFound();
            user.Name = updated.Name;
            user.Email = updated.Email;
            user.Role = updated.Role;
            await _userRepo.Update(user);
            return Ok(new { message = "User updated" });
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var currentUserId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0"
            );
            if (currentUserId == id)
                return BadRequest("You cannot delete your own account.");
            var user = await _userRepo.GetById(id);
            if (user == null) return NotFound("User not found");
            await _userRepo.Delete(user);
            return Ok(new { message = "User deleted successfully" });
        }

        // ================= ALLOTMENTS =================

        [HttpGet("allotments")]
        public async Task<IActionResult> GetAllAllotments()
        {
            var data = await _allotRepo.GetAll();
            return Ok(data);
        }

        // ================= BOOK LOGS =================

        [HttpGet("logs")]
        public async Task<IActionResult> GetLogs()
        {
            var logs = await _logRepo.GetAll();
            return Ok(logs);
        }

        // ================= LIBRARY SETTINGS =================

        /// <summary>
        /// GET current issue period (days) and fine rate (₹/day)
        /// </summary>
        [HttpGet("settings")]
        public IActionResult GetSettings()
        {
            var issueDays  = _config.GetValue<int>("LibrarySettings:IssueDays", 2);
            var finePerDay = _config.GetValue<decimal>("LibrarySettings:FinePerDay", 5);
            return Ok(new { issueDays, finePerDay });
        }

        /// <summary>
        /// PUT update issue period and/or fine rate in appsettings.json at runtime
        /// </summary>
        [HttpPut("settings")]
        public IActionResult UpdateSettings([FromBody] LibrarySettingsRequest dto)
        {
            if (dto.IssueDays < 1)
                return BadRequest(new { message = "Issue days must be at least 1." });

            if (dto.FinePerDay < 0)
                return BadRequest(new { message = "Fine per day cannot be negative." });

            // Locate appsettings.json relative to the app's content root
            var appSettingsPath = Path.Combine(
                Directory.GetCurrentDirectory(), "appsettings.json"
            );

            if (!System.IO.File.Exists(appSettingsPath))
                return StatusCode(500, new { message = "appsettings.json not found." });

            try
            {
                var json = System.IO.File.ReadAllText(appSettingsPath);
                var doc  = System.Text.Json.JsonDocument.Parse(json);

                // Rebuild JSON with updated LibrarySettings section
                using var ms     = new System.IO.MemoryStream();
                using var writer = new System.Text.Json.Utf8JsonWriter(
                    ms, new System.Text.Json.JsonWriterOptions { Indented = true }
                );

                writer.WriteStartObject();
                foreach (var prop in doc.RootElement.EnumerateObject())
                {
                    if (prop.Name == "LibrarySettings")
                    {
                        writer.WritePropertyName("LibrarySettings");
                        writer.WriteStartObject();
                        writer.WriteNumber("IssueDays",  dto.IssueDays);
                        writer.WriteNumber("FinePerDay", dto.FinePerDay);
                        writer.WriteEndObject();
                    }
                    else
                    {
                        prop.WriteTo(writer);
                    }
                }
                writer.WriteEndObject();
                writer.Flush();

                System.IO.File.WriteAllBytes(appSettingsPath, ms.ToArray());

                return Ok(new
                {
                    message   = "Settings updated successfully.",
                    issueDays  = dto.IssueDays,
                    finePerDay = dto.FinePerDay
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to update settings.", detail = ex.Message });
            }
        }
    }

    public class LibrarySettingsRequest
    {
        public int IssueDays { get; set; }
        public decimal FinePerDay { get; set; }
    }
}
