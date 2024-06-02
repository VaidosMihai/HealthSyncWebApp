using Microsoft.Extensions.Configuration;
using Moq;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

public class MailerSendEmailServiceTests
{
    private readonly Mock<IConfiguration> _mockConfig;
    private readonly MailerSendEmailService _service;

    public MailerSendEmailServiceTests()
    {
        _mockConfig = new Mock<IConfiguration>();
        _mockConfig.Setup(c => c["MailerSendSettings:ApiKey"]).Returns("fake-api-key");
        _mockConfig.Setup(c => c["MailerSendSettings:SenderEmail"]).Returns("sender@example.com");
        _mockConfig.Setup(c => c["MailerSendSettings:SenderName"]).Returns("Sender");

        _service = new MailerSendEmailService(_mockConfig.Object);
    }

    [Fact]
    public async Task SendEmailAsync_SendsEmail()
    {
        await _service.SendEmailAsync("receiver@example.com", "Test Subject", "Test Body", true);
    }
}
