using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Xunit;

public class EmailServiceTests
{
    private readonly Mock<IOptions<EmailSettings>> _mockEmailSettings;
    private readonly EmailService _emailService;

    public EmailServiceTests()
    {
        _mockEmailSettings = new Mock<IOptions<EmailSettings>>();
        _mockEmailSettings.Setup(es => es.Value).Returns(new EmailSettings
        {
            SenderEmail = "test@example.com",
            SenderName = "Test Sender",
            SmtpServer = "smtp.example.com",
            SmtpPort = 587,
            SenderPassword = "password"
        });
        _emailService = new EmailService(_mockEmailSettings.Object);
    }

    [Fact]
    public async Task SendEmailAsync_SendsEmail()
    {
        // Arrange
        var to = "recipient@example.com";
        var subject = "Test Subject";
        var body = "Test Body";
        var isHtml = false;

        var smtpClientMock = new Mock<SmtpClient>();
        smtpClientMock.Setup(c => c.SendMailAsync(It.IsAny<MailMessage>())).Returns(Task.CompletedTask);

        // Act
        await _emailService.SendEmailAsync(to, subject, body, isHtml);

        // Assert
        smtpClientMock.Verify(c => c.SendMailAsync(It.Is<MailMessage>(m =>
            m.To.Contains(new MailAddress(to)) &&
            m.Subject == subject &&
            m.Body == body &&
            m.IsBodyHtml == isHtml
        )), Times.Once);
    }

    [Fact]
    public async Task SendEmailAsync_ThrowsException_WhenSmtpFails()
    {
        // Arrange
        var to = "recipient@example.com";
        var subject = "Test Subject";
        var body = "Test Body";
        var isHtml = false;

        var smtpClientMock = new Mock<SmtpClient>();
        smtpClientMock.Setup(c => c.SendMailAsync(It.IsAny<MailMessage>())).Throws(new InvalidOperationException("SMTP Error"));

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _emailService.SendEmailAsync(to, subject, body, isHtml));
    }
}
