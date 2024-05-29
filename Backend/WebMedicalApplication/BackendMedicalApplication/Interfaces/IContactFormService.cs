using BackendMedicalApplication.Models;

namespace BackendMedicalApplication.Interfaces
{
    public interface IContactFormService
    {
        Task SaveContactFormSubmissionAsync(ContactFormSubmission submission);
        Task<IEnumerable<ContactFormSubmission>> GetAllContactFormSubmissionsAsync();
        Task<bool> DeleteContactFormSubmissionAsync(int id);
    }

}
