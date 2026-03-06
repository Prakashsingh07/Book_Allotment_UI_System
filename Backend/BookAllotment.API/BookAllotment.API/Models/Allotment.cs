using System;
using System.Collections.Generic;

namespace BookAllotment.API.Models;

public partial class Allotment
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int BookId { get; set; }

    public DateTime? AllotDate { get; set; }

    public DateTime? ReturnDate { get; set; }

    public DateTime DueDate { get; set; }

    public string? Status { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
