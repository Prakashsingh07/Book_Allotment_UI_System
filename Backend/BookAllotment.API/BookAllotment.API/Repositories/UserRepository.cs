using BookAllotment.API.Models;
using BookAllotment.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookAllotment.API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET ALL USERS
        public async Task<IEnumerable<User>> GetAll()
        {
            return await _context.Users
                .AsNoTracking()      // prevents EF cache issue
                .ToListAsync();
        }

        // ✅ GET USER BY ID
        public async Task<User> GetById(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        // ✅ GET USER BY EMAIL
        public async Task<User> GetByEmail(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x => x.Email == email);
        }

        // ✅ ADD USER
        public async Task Add(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        // ✅ UPDATE USER
        public async Task Update(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        // ✅ DELETE USER
        public async Task Delete(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}
