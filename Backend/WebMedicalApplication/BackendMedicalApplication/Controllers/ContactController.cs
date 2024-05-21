using Microsoft.AspNetCore.Mvc;
using ContactApi.Models;
using BackendMedicalApplication.Interfaces;

namespace ContactApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public ContactController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ContactForm contactForm)
        {
            var body = $@"
                <html>
                <body>
                    <h2>New Contact Form Submission</h2>
                    <p><strong>First Name:</strong> {contactForm.FirstName}</p>
                    <p><strong>Last Name:</strong> {contactForm.LastName}</p>
                    <p><strong>Phone:</strong> {contactForm.Phone}</p>
                    <p><strong>Email:</strong> {contactForm.Email}</p>
                    <p><strong>Date of Birth:</strong> {contactForm.Dob}</p>
                    <p><strong>Comments:</strong> {contactForm.Comments}</p>
                    <p><strong>Agreed to Terms:</strong> {(contactForm.AgreeTerms ? "Yes" : "No")}</p>
                    <p><strong>Agreed to Privacy Policy:</strong> {(contactForm.AgreePrivacy ? "Yes" : "No")}</p>
                    <p><strong>Agreed to Marketing:</strong> {(contactForm.AgreeMarketing ? "Yes" : "No")}</p>
                </body>
                </html>";

            try
            {
                await _emailService.SendEmailAsync(contactForm.Email, "New Contact Form Submission", body, true);
                return Ok("Email sent successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
