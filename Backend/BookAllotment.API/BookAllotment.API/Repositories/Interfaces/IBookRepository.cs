using BookAllotment.API.Models;

namespace BookAllotment.API.Repositories.Interfaces
{
    public interface IBookRepository
    {
        Task<IEnumerable<Book>> GetAll();
        Task<Book> GetById(int id);
        Task Add(Book book);
        Task Update(Book book);
        Task Delete(Book book);
    }
}
