namespace BookAllotment.API.Models
{
    public class FinePayment
    {
        public int Id { get; set; }
        public int AllotmentId { get; set; }
        public int UserId { get; set; }
        public decimal AmountPaid { get; set; }
        public DateTime PaidAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Paid"; // Paid / Waived

        public virtual Allotment Allotment { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
