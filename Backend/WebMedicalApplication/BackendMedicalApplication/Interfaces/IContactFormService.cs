using BackendMedicalApplication.Models;

namespace BackendMedicalApplication.Interfaces
{
    public interface IContactFormService
    {
        Task SaveContactFormSubmissionAsync(ContactFormSubmission submission);
    }

}
