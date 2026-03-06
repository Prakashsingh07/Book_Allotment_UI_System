using Microsoft.AspNetCore.Mvc;
using UserRegister.DTOs;
using UserRegister.Services;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserService _service;

    public AuthController(IUserService service)
    {
        _service = service;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserDto dto)
    {
        await _service.RegisterAsync(dto);
        return Ok(new { message = "User registered successfully" });
    }
}
