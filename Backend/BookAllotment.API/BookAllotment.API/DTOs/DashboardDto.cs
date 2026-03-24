namespace BookAllotment.API.DTOs
{
    public class DashboardDto
    {
        public int TotalBooks        { get; set; }
        public int TotalUsers        { get; set; }
        public int ActiveAllotments  { get; set; }  // kept for backward compat
        public int OverdueBooks      { get; set; }  // kept for backward compat
        public string MostBorrowedBook { get; set; } = "N/A";

        // ── New fields ──────────────────────────────────────────────
        public int IssuedCount    { get; set; }   // books currently out (Status = Allotted)
        public int OverdueCount   { get; set; }   // alias for OverdueBooks — used by frontend
        public int PendingCount   { get; set; }   // pending book requests
        public int AvailableCount { get; set; }   // books with stock > 0
    }
}
