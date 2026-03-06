namespace BookAllotment.API.DTOs
{
    public class DashboardDto
    {
        public int TotalBooks { get; set; }
        public int TotalUsers { get; set; }
        public int ActiveAllotments { get; set; }
        public int OverdueBooks { get; set; }
        public string MostBorrowedBook { get; set; } = "N/A";
    }
}