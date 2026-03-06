namespace BookAllotment.API.Models
{
    public class BookRequest
    {
         public int Id { get; set; }
    public int UserId { get; set; }
    public int BookId { get; set; }
    public string Status { get; set; } = "Pending";

    public DateTime RequestDate { get; set; } = DateTime.UtcNow;
    public DateTime? ApprovedDate { get; set; }

        public virtual Book Book { get; set; } = null!;
    public virtual User User { get; set; } = null!;
    }
}


