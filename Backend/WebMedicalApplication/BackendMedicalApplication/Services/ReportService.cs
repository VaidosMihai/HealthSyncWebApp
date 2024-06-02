using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using WebMedicalApplication.Models;

namespace BackendMedicalApplication.Services
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<object>> GetPatientsWithMostAppointments()
        {
            var result = await _context.Appointments
                .GroupBy(a => new { a.PatientId, a.Patient.Name })
                .Select(g => new
                {
                    g.Key.PatientId,
                    g.Key.Name,
                    AppointmentsCount = g.Count()
                })
                .OrderByDescending(g => g.AppointmentsCount)
                .Take(10)
                .ToListAsync();

            return result;
        }

        public async Task<object> GetOldestPatient()
        {
            var result = await _context.Users
                .Where(u => u.RoleId == 2) // Assuming RoleId 2 is for patients
                .OrderByDescending(u => u.Age)
                .Select(u => new
                {
                    u.UserId,
                    u.Name,
                    u.Age
                })
                .FirstOrDefaultAsync();

            return result;
        }

        public async Task<object> GetYoungestPatient()
        {
            var result = await _context.Users
                .Where(u => u.RoleId == 2) // Assuming RoleId 2 is for patients
                .OrderBy(u => u.Age)
                .Select(u => new
                {
                    u.UserId,
                    u.Name,
                    u.Age
                })
                .FirstOrDefaultAsync();

            return result;
        }

        public async Task<IEnumerable<object>> GetDoctorsWithMostReviews()
        {
            var result = await _context.Reviews
                .Join(_context.Users,
                    review => review.DoctorId,
                    user => user.UserId,
                    (review, user) => new { review, user })
                .Where(ru => ru.user.RoleId == 1) // Assuming RoleId 1 is for doctors
                .GroupBy(ru => new { ru.review.DoctorId, ru.user.Name })
                .Select(g => new
                {
                    g.Key.DoctorId,
                    g.Key.Name,
                    ReviewCount = g.Count()
                })
                .OrderByDescending(g => g.ReviewCount)
                .Take(10)
                .ToListAsync();

            return result;
        }

        public async Task<IEnumerable<object>> GetPatientsWithMostReviews()
        {
            var result = await _context.Reviews
                .Join(_context.Users,
                    review => review.PatientId,
                    user => user.UserId,
                    (review, user) => new { review, user })
                .Where(ru => ru.user.RoleId == 2) // Assuming RoleId 2 is for patients
                .GroupBy(ru => new { ru.review.PatientId, ru.user.Name })
                .Select(g => new
                {
                    g.Key.PatientId,
                    g.Key.Name,
                    ReviewCount = g.Count()
                })
                .OrderByDescending(g => g.ReviewCount)
                .Take(10)
                .ToListAsync();

            return result;
        }

        public async Task<IEnumerable<object>> GetPatientsWithMostMedicalRecords()
        {
            var result = await _context.PatientRecords
                .Include(pr => pr.Patient)
                .GroupBy(pr => new { pr.PatientId, pr.Patient.Name })
                .Select(g => new
                {
                    g.Key.PatientId,
                    g.Key.Name,
                    MedicalRecordCount = g.Count()
                })
                .OrderByDescending(g => g.MedicalRecordCount)
                .Take(10)
                .ToListAsync();

            return result;
        }

        public async Task<IEnumerable<object>> GetDoctorsWithMostAppointments()
        {
            var result = await _context.Appointments
                .Include(a => a.Doctor)
                .GroupBy(a => new { a.DoctorId, a.Doctor.Name })
                .Select(g => new
                {
                    g.Key.DoctorId,
                    g.Key.Name,
                    AppointmentsCount = g.Count()
                })
                .OrderByDescending(g => g.AppointmentsCount)
                .Take(10)
                .ToListAsync();

            return result;
        }
    }
}
