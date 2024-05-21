using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;

namespace BackendMedicalApplication.Services
{
    public class ContactFormService : IContactFormService
    {
        private readonly AppDbContext _context;

        public ContactFormService(AppDbContext context)
        {
            _context = context;
        }

        public async Task SaveContactFormSubmissionAsync(ContactFormSubmission submission)
        {
            _context.ContactFormSubmissions.Add(submission);
            await _context.SaveChangesAsync();
        }
    }

}
