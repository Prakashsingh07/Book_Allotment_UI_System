using BookAllotment.API.Models;
using BookAllotment.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookAllotment.API.Repositories
{
    public class AllotmentRepository : IAllotmentRepository
    {
        private readonly AppDbContext _context;

        public AllotmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task Add(Allotment allotment)
        {
            await _context.Allotments.AddAsync(allotment);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Allotment>> GetAll()
        {
            return await _context.Allotments
            .Include(x => x.Book)
            .Include(x => x.User)
            .ToListAsync();
        }

        public async Task<IEnumerable<Allotment>> GetByUser(int userId)
        {
            return await _context.Allotments
                .Where(a => a.UserId == userId)
                .Include(a => a.Book)
                .ToListAsync();
        }
        public async Task<Allotment?> GetById(int id)
        {
            return await _context.Allotments
                .Include(a => a.Book)
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task Update(Allotment allotment)
        {
            _context.Allotments.Update(allotment);
            await _context.SaveChangesAsync();
        }
    }

}
