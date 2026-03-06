    using BookAllotment.API.Models;
    using BookAllotment.API.Services;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

    [ApiController]
    [Route("api/books")]
    [Authorize]
    public class BooksController : ControllerBase
    {
        private readonly BookService _service;
        private readonly AppDbContext _context;

        //public BooksController(AppDbContext context)
        //{
        //    _context = context;
        //}

        public BooksController(BookService service,AppDbContext context)
        {
            _service = service;
        _context = context;
        }

        //Total count
        [HttpGet("count")]
        public async Task<IActionResult> GetBookCount()
        {
            var count = await _context.Books.CountAsync();
            return Ok(count);
        }

         //✅ Get all books
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _service.GetAll());
        }

    //get count
    [HttpGet("available-count")]
    public async Task<IActionResult> GetAvailableCount()
    {
        var count = await _context.Books
            .Where(b => b.AvailableQuantity > 0)
            .CountAsync();

        return Ok(count);
    }

    // ✅ Add book (Admin)
    [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Book book)
        {
            await _service.Add(book);
            return Ok();
        }

        // ✅ Update book (Admin)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Book book)
        {
            await _service.Update(id, book);
            return Ok();
        }

        // ✅ Delete book (Admin)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.Delete(id);
            return Ok();
        }
    }