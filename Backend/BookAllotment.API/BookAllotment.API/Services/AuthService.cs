using BookAllotment.API.Repositories.Interfaces;
using BookAllotment.API.Models;
using BookAllotment.API.DTOs;
using BCrypt.Net;
using System.Security.Claims;


namespace BookAllotment.API.Services
{

    public class AuthService
    {
        private readonly IUserRepository _repo;
        private readonly TokenService _token;

        public AuthService(IUserRepository repo, TokenService token)
        {
            _repo = repo;
            _token = token;
        }

        public async Task<string> Register(RegisterDto dto)
        {
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "User",
                IsActive = true
            };

            await _repo.Add(user);
            return _token.GenerateToken(user);
        }

        public async Task<string> Login(LoginDto dto)
        {
            var user = await _repo.GetByEmail(dto.Email);

            if (user == null || user.IsActive == false ||
             !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Invalid Credentials");

            return _token.GenerateToken(user);
        }
    }

}
