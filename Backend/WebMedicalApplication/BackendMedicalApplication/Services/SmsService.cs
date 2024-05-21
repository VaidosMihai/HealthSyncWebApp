using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;

namespace BackendMedicalApplication.Services
{
    public class SmsService : ISmsService
    {
        private readonly SMSApiSettings _smsApiSettings;
        private readonly HttpClient _httpClient;
        private readonly ILogger<SmsService> _logger;

        public SmsService(IOptions<SMSApiSettings> smsApiSettings, ILogger<SmsService> logger)
        {
            _smsApiSettings = smsApiSettings.Value;
            _httpClient = new HttpClient();
            _logger = logger;
        }

        public async Task SendSmsAsync(string to, string message)
        {
            var requestUri = "https://api.smsapi.com/sms.do";
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _smsApiSettings.AccessToken);

            var content = new FormUrlEncodedContent(new[]
            {
            new KeyValuePair<string, string>("to", to),
            new KeyValuePair<string, string>("message", message),
            new KeyValuePair<string, string>("format", "json")
        });

            _logger.LogInformation($"Sending SMS to {to} with message: {message}");

            try
            {
                var response = await _httpClient.PostAsync(requestUri, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"SMS sending failed with status code {response.StatusCode} and response: {responseContent}");
                    throw new HttpRequestException($"SMS sending failed with status code {response.StatusCode}");
                }

                _logger.LogInformation($"SMS sent successfully to {to} with response: {responseContent}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception occurred while sending SMS: {ex.Message}");
                throw;
            }
        }
    }
}
