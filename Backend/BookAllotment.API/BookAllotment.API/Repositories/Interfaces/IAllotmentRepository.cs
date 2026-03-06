using BookAllotment.API.Models;

namespace BookAllotment.API.Repositories.Interfaces
{
    public interface IAllotmentRepository
    {
        Task Add(Allotment allotment);
        Task<IEnumerable<Allotment>> GetAll();
        Task<IEnumerable<Allotment>> GetByUser(int userId);
        Task<Allotment?> GetById(int id);
        Task Update(Allotment allotment);
    }
}
