using BookAllotment.API.Models;
using BookAllotment.API.Repositories.Interfaces;

namespace BookAllotment.API.Services
{
    public class BookLogService
    {
        private readonly IBookLogRepository _repo;

        public BookLogService(IBookLogRepository repo)
        {
            _repo = repo;
        }

        public async Task AddLog(
         int bookId,
         int userId,
         string action,
         string performedBy)
        {
            var log = new BookLog
            {
                BookId = bookId,
                UserId = userId,
                Action = action,
                PerformedBy = performedBy
            };

            await _repo.Add(log);
        }
    }

}
