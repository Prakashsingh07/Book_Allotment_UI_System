using BookAllotment.API.Models;
using BookAllotment.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookAllotment.API.Repositories
{
    public class BookLogRepository : IBookLogRepository
    {
        private readonly AppDbContext _context;

        public BookLogRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task Add(BookLog log)
        {
            await _context.BookLogs.AddAsync(log);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<BookLog>> GetAll()
        {
            return await _context.BookLogs.ToListAsync();
        }
    }

}
