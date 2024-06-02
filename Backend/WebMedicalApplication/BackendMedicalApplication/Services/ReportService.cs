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

        public async Task<UserDto> GetOldestPatientAsync()
        {
            return await _context.Users
                .Where(u => u.RoleId == 2) // Assuming roleId 2 is for Patients
                .OrderByDescending(p => p.Age)
                .Select(p => new UserDto
                {
                    UserId = p.UserId,
                    Name = p.Name,
                    Age = p.Age,
                    EmailAddress = p.EmailAddress
                }).FirstOrDefaultAsync();
        }

        public async Task<UserDto> GetYoungestPatientAsync()
        {
            return await _context.Users
                .Where(u => u.RoleId == 2) // Assuming roleId 2 is for Patients
                .OrderBy(p => p.Age)
                .Select(p => new UserDto
                {
                    UserId = p.UserId,
                    Name = p.Name,
                    Age = p.Age,
                    EmailAddress = p.EmailAddress
                }).FirstOrDefaultAsync();
        }

        public async Task<UserDto> GetPatientWithMostAppointmentsAsync()
        {
            return await _context.Users
                .Where(u => u.RoleId == 2) // Assuming roleId 2 is for Patients
                .Select(p => new
                {
                    Patient = p,
                    AppointmentCount = _context.Appointments.Count(a => a.PatientId == p.UserId)
                })
                .OrderByDescending(p => p.AppointmentCount)
                .Select(p => new UserDto
                {
                    UserId = p.Patient.UserId,
                    Name = p.Patient.Name,
                    Age = p.Patient.Age,
                    EmailAddress = p.Patient.EmailAddress,
                    Description = $"Appointments: {p.AppointmentCount}"
                })
                .FirstOrDefaultAsync();
        }

        public async Task<UserDto> GetDoctorWithMostReviewsAsync()
        {
            return await _context.Users
                .Where(u => u.RoleId == 1) // Assuming roleId 1 is for Doctors
                .Select(d => new
                {
                    Doctor = d,
                    ReviewCount = _context.Reviews.Count(r => r.DoctorId == d.UserId)
                })
                .OrderByDescending(d => d.ReviewCount)
                .Select(d => new UserDto
                {
                    UserId = d.Doctor.UserId,
                    Name = d.Doctor.Name,
                    EmailAddress = d.Doctor.EmailAddress,
                    Description = $"Reviews: {d.ReviewCount}"
                })
                .FirstOrDefaultAsync();
        }
    }
}
