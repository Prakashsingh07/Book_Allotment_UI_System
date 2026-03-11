using Microsoft.AspNetCore.Mvc;

namespace BookAllotment.API.Controllers
{
    public class RatingController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
