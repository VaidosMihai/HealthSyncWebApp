namespace BackendMedicalApplication.Interfaces
{

    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body, bool isHtml);
    }
}
