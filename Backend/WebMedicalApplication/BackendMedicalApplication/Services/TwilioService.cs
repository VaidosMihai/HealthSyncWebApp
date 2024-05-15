using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Microsoft.Extensions.Options;
using BackendMedicalApplication.Models;
using BackendMedicalApplication.Interfaces;
using WebMedicalApplication.Models;
using Microsoft.Extensions.Logging.Abstractions;

public class TwilioService : ITwilioService
{
    private readonly IConfiguration _configuration;


    public TwilioService(IConfiguration configuration)
    {
        _configuration = configuration;
        TwilioClient.Init(
            _configuration["TwilioSettings:AccountSid"],
            _configuration["TwilioSettings:AuthToken"]
        );
    }

    public async Task SendSms(string to, string message)
    {
        var from = new Twilio.Types.PhoneNumber(_configuration["TwilioSettings:FromNumber"]);
        var toNumber = new Twilio.Types.PhoneNumber(to);

        var response = await MessageResource.CreateAsync(
            body: message,
            from: from,
            to: toNumber
        );

        Console.WriteLine(response.Sid); // Optionally log the message SID or handle it as needed
    }
}
