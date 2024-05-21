using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using Microsoft.Extensions.Options;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = false)
    {
        var mailMessage = new MailMessage
        {
            From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
            Subject = subject,
            Body = body,
            IsBodyHtml = isHtml
        };
        mailMessage.To.Add(to);

        var smtpClient = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.SmtpPort)
        {
            Credentials = new NetworkCredential(_emailSettings.SenderEmail, _emailSettings.SenderPassword),
            EnableSsl = true
        };

        try
        {
            await smtpClient.SendMailAsync(mailMessage);
        }
        catch (Exception ex)
        {
            // Handle the exception
            throw new InvalidOperationException(ex.Message);
        }
    }
}
