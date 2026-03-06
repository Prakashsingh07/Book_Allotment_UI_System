using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BookAllotment.API.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Allotment> Allotments { get; set; }

    public virtual DbSet<Book> Books { get; set; }

    public virtual DbSet<BookLog> BookLogs { get; set; }

    public virtual DbSet<User> Users { get; set; }
    public DbSet<BookRequest> BookRequests { get; set; }  

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=BookAllotmentDB;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Allotment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Allotmen__3214EC07879B745D");

            entity.Property(e => e.AllotDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ReturnDate).HasColumnType("datetime");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Allotted");

            entity.HasOne(d => d.Book).WithMany(p => p.Allotments)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Allotment__BookI__656C112C");

            entity.HasOne(d => d.User).WithMany(p => p.Allotments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Allotment__UserI__6477ECF3");
        });

        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Books__3214EC075ADF4337");

            entity.Property(e => e.Author).HasMaxLength(150);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.Category).HasMaxLength(100);

            entity.Property(e => e.Tags).HasMaxLength(500);
        });

        modelBuilder.Entity<BookLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__BookLogs__3214EC0713C62963");

            entity.Property(e => e.Action).HasMaxLength(50);
            entity.Property(e => e.ActionDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PerformedBy).HasMaxLength(100);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC076866A5DA");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D1053451C8AA27").IsUnique();

            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .HasDefaultValue("User");
        });

        modelBuilder.Entity<BookRequest>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Pending");

            entity.Property(e => e.RequestDate)
                .HasColumnType("datetime")
                .HasDefaultValueSql("(getdate())");

            entity.HasOne(e => e.User)
                .WithMany(u => u.BookRequests)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.Book)
                .WithMany(b => b.BookRequests)
                .HasForeignKey(e => e.BookId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
