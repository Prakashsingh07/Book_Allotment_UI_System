using BookAllotment.API.Models;
using BookAllotment.API.Repositories.Interfaces;
using BookAllotment.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookAllotment.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]   // 🔥 Only Admin can access
    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IAllotmentRepository _allotRepo;
        private readonly IBookLogRepository _logRepo;

        public AdminController(
            IUserRepository userRepo,
            IAllotmentRepository allotRepo,
            IBookLogRepository logRepo)
        {
            _userRepo = userRepo;
            _allotRepo = allotRepo;
            _logRepo = logRepo;
        }

        // ================= USERS =================

        // ✅ Get All Users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userRepo.GetAll();
            return Ok(users);
        }

        //add user
        [HttpPost("users")]
        public async Task<IActionResult> AddUser(User user)
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Default@123");
            user.IsActive = true;

            await _userRepo.Add(user);
            return Ok();
        }

        // ✅ Activate / Deactivate User
        [HttpPut("user-status/{id}")]
        public async Task<IActionResult> UpdateUserStatus(int id, bool status)
        {
            var user = await _userRepo.GetById(id);

            if (user == null)
                return NotFound("User not found");

            user.IsActive = status;

            await _userRepo.Update(user);

            return Ok("User status updated");
        }

        //update user
        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updated)
        {
            var user = await _userRepo.GetById(id);
            if (user == null)
                return NotFound();

            user.Name = updated.Name;
            user.Email = updated.Email;
            user.Role = updated.Role;

            await _userRepo.Update(user);

            return Ok(new { message = "User updated" });
        }
        // ✅ Delete User
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var currentUserId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0"
            );

            if (currentUserId == id)
                return BadRequest("You cannot delete your own account.");

            var user = await _userRepo.GetById(id);
            if (user == null)
                return NotFound("User not found");

            await _userRepo.Delete(user);

            return Ok(new { message = "User deleted successfully" });
        }
        // ================= ALLOTMENTS =================

        // ✅ View All Allotments
        [HttpGet("allotments")]
        public async Task<IActionResult> GetAllAllotments()
        {
            var data = await _allotRepo.GetAll();
            return Ok(data);
        }

        // ================= BOOK LOGS =================

        // ✅ View Logs
        [HttpGet("logs")]
        public async Task<IActionResult> GetLogs()
        {
            var logs = await _logRepo.GetAll();
            return Ok(logs);
        }
    }
}
