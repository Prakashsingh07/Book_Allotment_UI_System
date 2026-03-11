using System;
using System.Collections.Generic;

namespace BookAllotment.API.Models;

public partial class Book
{
    public int Id { get; set; }

    public string? Title { get; set; }

    public string? Author { get; set; }

    public int? Quantity { get; set; }

    public int? AvailableQuantity { get; set; }

    public string? Category { get; set; }

    public string? Tags { get; set; }

    public string? ImageUrl { get; set; }

    public virtual ICollection<Allotment> Allotments { get; set; } = new List<Allotment>();

    public virtual ICollection<BookRequest> BookRequests { get; set; } = new List<BookRequest>();
}