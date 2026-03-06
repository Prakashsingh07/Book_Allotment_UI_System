using BookAllotment.API.Models;

namespace BookAllotment.API.Repositories.Interfaces
{
    public interface IBookLogRepository
    {
        Task Add(BookLog log);
        Task<IEnumerable<BookLog>> GetAll();
    }
}
