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

        public async Task<UserDto> GetOldestPatientAsync()
        {
            return await _context.Users
                .Where(u => u.RoleId == 2) // Assuming roleId 2 is for Patients
                .OrderByDescending(u => u.Age)
                .Select(p => new UserDto
                {
                    UserId = p.UserId,
                    Name = p.Name,
                    Age = p.Age,
                    EmailAddress = p.EmailAddress,
                    Description = $"Age: {p.Age}"
                })
                .FirstOrDefaultAsync();
        }

        public async Task<UserDto> GetYoungestPatientAsync()
        {
            return await _context.Users
                .Where(u => u.RoleId == 2) // Assuming roleId 2 is for Patients
                .OrderBy(u => u.Age)
                .Select(p => new UserDto
                {
                    UserId = p.UserId,
                    Name = p.Name,
                    Age = p.Age,
                    EmailAddress = p.EmailAddress,
                    Description = $"Age: {p.Age}"
                })
                .FirstOrDefaultAsync();
        }

        public async Task<UserDto> GetOldestDoctorAsync()
        {
            return await _context.Users
                .Where(u => u.RoleId == 1) // Assuming roleId 1 is for Doctors
                .OrderByDescending(u => u.Age)
                .Select(d => new UserDto
                {
                    UserId = d.UserId,
                    Name = d.Name,
                    Age = d.Age,
                    EmailAddress = d.EmailAddress,
                    Description = $"Age: {d.Age}"
                })
                .FirstOrDefaultAsync();
        }

        public async Task<UserDto> GetYoungestDoctorAsync()
        {
            return await _context.Users
                .Where(u => u.RoleId == 1) // Assuming roleId 1 is for Doctors
                .OrderBy(u => u.Age)
                .Select(d => new UserDto
                {
                    UserId = d.UserId,
                    Name = d.Name,
                    Age = d.Age,
                    EmailAddress = d.EmailAddress,
                    Description = $"Age: {d.Age}"
                })
                .FirstOrDefaultAsync();
        }
    }

}
