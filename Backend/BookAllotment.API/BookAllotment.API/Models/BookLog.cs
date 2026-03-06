using System;
using System.Collections.Generic;

namespace BookAllotment.API.Models;

public partial class BookLog
{
    public int Id { get; set; }

    public int? BookId { get; set; }

    public int? UserId { get; set; }

    public string? Action { get; set; }

    public DateTime? ActionDate { get; set; }

    public string? PerformedBy { get; set; }
}
