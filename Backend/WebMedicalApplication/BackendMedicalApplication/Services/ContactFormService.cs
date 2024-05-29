using System.Collections.Generic;
using System.Threading.Tasks;
using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using Microsoft.EntityFrameworkCore;

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

        public async Task<IEnumerable<ContactFormSubmission>> GetAllContactFormSubmissionsAsync()
        {
            return await _context.ContactFormSubmissions.ToListAsync();
        }

        public async Task<bool> DeleteContactFormSubmissionAsync(int id)
        {
            var submission = await _context.ContactFormSubmissions.FindAsync(id);
            if (submission == null)
            {
                return false;
            }

            _context.ContactFormSubmissions.Remove(submission);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
