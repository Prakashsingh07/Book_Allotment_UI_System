using BookAllotment.API.Models;

namespace BookAllotment.API.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAll();

        Task<User> GetById(int id);

        Task<User> GetByEmail(string email);

        Task Add(User user);

        Task Update(User user);

        Task Delete(User user);
    }
}
