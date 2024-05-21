using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using BackendMedicalApplication.Interfaces;

public class MailerSendEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public MailerSendEmailService(IConfiguration configuration)
    {
        _configuration = configuration;
        _httpClient = new HttpClient();
    }

    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
    {
        var apiKey = _configuration["MailerSendSettings:ApiKey"];
        var senderEmail = _configuration["MailerSendSettings:SenderEmail"];
        var senderName = _configuration["MailerSendSettings:SenderName"];

        var requestContent = new
        {
            from = new { email = senderEmail, name = senderName },
            to = new[] { new { email = to } },
            subject = subject,
            html = isHtml ? body : null,
            text = isHtml ? null : body
        };

        var jsonContent = JsonConvert.SerializeObject(requestContent);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);

        var response = await _httpClient.PostAsync("https://api.mailersend.com/v1/email", content);
        response.EnsureSuccessStatusCode();
    }
}
