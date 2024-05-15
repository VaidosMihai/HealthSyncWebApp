using WebMedicalApplication.Models;

namespace BackendMedicalApplication.Interfaces
{
    public interface ITwilioService
    {
        Task SendSms(string to, string message);
    }

}
