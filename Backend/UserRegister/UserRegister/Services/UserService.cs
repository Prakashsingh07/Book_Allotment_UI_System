using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using UserRegister.Data;
using UserRegister.DTOs;
using UserRegister.Models;
using UserRegister.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _db;
    private readonly IHttpClientFactory _factory;
    private readonly IConfiguration _config;

    public UserService(
        AppDbContext db,
        IHttpClientFactory factory,
        IConfiguration config)
    {
        _db = db;
        _factory = factory;
        _config = config;
    }

    public async Task RegisterAsync(RegisterUserDto dto)
    {
        // 1️⃣ Duplicate check
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            throw new Exception("Email already exists");

        // 2️⃣ Save user
        var user = new Users
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        // 3️⃣ Prepare Boomi call
        var client = _factory.CreateClient();

        var username = _config["Boomi:Username"];
        var token = _config["Boomi:ApiToken"];
        var endpoint = _config["Boomi:Endpoint"];

        var authHeader = Convert.ToBase64String(
            Encoding.UTF8.GetBytes($"{username}:{token}")
        );

        var request = new HttpRequestMessage(HttpMethod.Post, endpoint)
        {
            Content = JsonContent.Create(new
            {
                name = user.Name,
                email = user.Email
            })
        };

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Basic", authHeader);

        // 4️⃣ Call Boomi
        var response = await client.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception("Boomi email failed: " + error);
        }
    }
}
