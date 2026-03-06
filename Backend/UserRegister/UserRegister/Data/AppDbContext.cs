using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using UserRegister.Models;
namespace UserRegister.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Users> Users => Set<Users>();
    }
}
