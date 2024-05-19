using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System;
using BackendMedicalApplication.Interfaces;

namespace BackendMedicalApplication.Services
{
    public class TwilioService : ITwilioService
    {
        private readonly IConfiguration _configuration;

        public TwilioService(IConfiguration configuration)
        {
            _configuration = configuration;
            string accountSid = _configuration["TwilioSettings:AccountSid"];
            string authToken = _configuration["TwilioSettings:AuthToken"];

            // Log the Twilio settings for debugging
            Console.WriteLine($"Twilio AccountSid: {accountSid}");
            Console.WriteLine($"Twilio AuthToken: {authToken}");

            if (string.IsNullOrEmpty(accountSid) || string.IsNullOrEmpty(authToken))
            {
                throw new InvalidOperationException("Twilio AccountSid and AuthToken must be provided.");
            }

            TwilioClient.Init(accountSid, authToken);
        }

        public async Task SendSms(string to, string message)
        {
            var from = new Twilio.Types.PhoneNumber(_configuration["TwilioSettings:FromNumber"]);
            var toNumber = new Twilio.Types.PhoneNumber(FormatPhoneNumber(to));

            try
            {
                var response = await MessageResource.CreateAsync(
                    body: message,
                    from: from,
                    to: toNumber
                );

                Console.WriteLine($"Twilio Message SID: {response.Sid}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending SMS: {ex.Message}");
                throw;
            }
        }

        private string FormatPhoneNumber(string phoneNumber)
        {
            // Remove any non-digit characters
            phoneNumber = new string(phoneNumber.Where(char.IsDigit).ToArray());

            // Add the Romanian country code if not already present
            if (!phoneNumber.StartsWith("40"))
            {
                if (phoneNumber.StartsWith("0"))
                {
                    phoneNumber = phoneNumber.TrimStart('0');
                }
                phoneNumber = "40" + phoneNumber;
            }

            return "+" + phoneNumber;
        }
    }
}
