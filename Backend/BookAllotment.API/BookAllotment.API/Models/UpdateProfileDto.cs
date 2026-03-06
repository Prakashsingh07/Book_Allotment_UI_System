namespace BookAllotment.API.Models
{
    public class UpdateProfileDto
    {
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string? NewPassword { get; set; }
    }
}
