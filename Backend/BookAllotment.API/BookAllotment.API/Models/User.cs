using System;
using System.Collections.Generic;

namespace BookAllotment.API.Models;

public partial class User
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Email { get; set; }

    public string? PasswordHash { get; set; }

    public string? Role { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<Allotment> Allotments { get; set; } = new List<Allotment>();
    public virtual ICollection<BookRequest> BookRequests { get; set; } = new List<BookRequest>();
}
