using UserRegister.DTOs;

namespace UserRegister.Services
{
    public interface IUserService
    {
        Task RegisterAsync(RegisterUserDto dto);
    }
}
