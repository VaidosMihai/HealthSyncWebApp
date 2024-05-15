using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using ContactApi.Models;

namespace ContactApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ContactController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public IActionResult Post([FromBody] ContactForm contactForm)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            var smtpServer = emailSettings["SmtpServer"];
            var smtpPort = int.Parse(emailSettings["SmtpPort"]);
            var senderName = emailSettings["SenderName"];
            var senderEmail = emailSettings["SenderEmail"];
            var senderPassword = emailSettings["SenderPassword"];

            try
            {
                var smtpClient = new SmtpClient(smtpServer)
                {
                    Port = smtpPort,
                    Credentials = new NetworkCredential(senderEmail, senderPassword),
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, senderName),
                    Subject = "New Contact Form Submission",
                    Body = $@"
                        First Name: {contactForm.FirstName}
                        Last Name: {contactForm.LastName}
                        Phone: {contactForm.Phone}
                        Email: {contactForm.Email}
                        Date of Birth: {contactForm.Dob}
                        Comments: {contactForm.Comments}
                        Agreed to Terms: {(contactForm.AgreeTerms ? "Yes" : "No")}
                        Agreed to Privacy Policy: {(contactForm.AgreePrivacy ? "Yes" : "No")}
                        Agreed to Marketing: {(contactForm.AgreeMarketing ? "Yes" : "No")}
                    ",
                    IsBodyHtml = false,
                };

                mailMessage.To.Add(senderEmail);

                smtpClient.Send(mailMessage);

                return Ok("Email sent successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
