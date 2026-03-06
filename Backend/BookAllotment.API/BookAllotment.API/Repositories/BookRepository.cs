using BookAllotment.API.Models;
using BookAllotment.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookAllotment.API.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly AppDbContext _context;

        public BookRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Book>> GetAll()
         => await _context.Books.ToListAsync();

        public async Task<Book> GetById(int id)
         => await _context.Books.FindAsync(id);

        public async Task Add(Book book)
        {
            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Book book)
        {
            _context.Books.Update(book);
            await _context.SaveChangesAsync();
        }
        public async Task Delete(Book book)
        {
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
        }
    }

}
