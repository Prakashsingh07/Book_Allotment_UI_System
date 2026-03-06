using BookAllotment.API.Models;
using BookAllotment.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookAllotment.API.Services
{
    public class BookService
    {
        private readonly IBookRepository _repo;

        public BookService(IBookRepository repo)
        {
            _repo = repo;
        }

        // ✅ GET ALL BOOKS
        public async Task<IEnumerable<Book>> GetAll()
        {
            return await _repo.GetAll();
        }

        // ✅ GET BOOK COUNT
        public async Task<int> GetCount()
        {
            var books = await _repo.GetAll();
            return books.Count();
        }

        // ✅ ADD BOOK
        public async Task Add(Book book)
        {
            if (book.Quantity < 1)
                throw new Exception("Quantity must be at least 1");

            // Set available quantity initially equal to total quantity
            book.AvailableQuantity = book.Quantity;

            await _repo.Add(book);
        }

        // ✅ UPDATE BOOK
        public async Task Update(int id, Book book)
        {
            var existing = await _repo.GetById(id);
            if (existing == null)
                throw new Exception("Book not found");

            // Preserve already allotted copies
            int totalQuantity = existing.Quantity ?? 0;
            int available = existing.AvailableQuantity ?? 0;

            int allottedCopies = totalQuantity - available;

            if (book.Quantity < allottedCopies)
                throw new Exception("Cannot reduce quantity below allotted books count");

            existing.Title = book.Title;
            existing.Author = book.Author;
            existing.Category = book.Category;
            existing.Tags = book.Tags;
            existing.Quantity = book.Quantity;

            // Recalculate available quantity safely
            existing.AvailableQuantity = book.Quantity - allottedCopies;

            await _repo.Update(existing);
        }

        // ✅ DELETE BOOK
        public async Task Delete(int id)
        {
            var book = await _repo.GetById(id);
            if (book == null)
                throw new Exception("Book not found");

            if (book.AvailableQuantity != book.Quantity)
                throw new Exception("Cannot delete book that is currently allotted");

            await _repo.Delete(book);
        }
    }
}