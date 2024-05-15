using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendMedicalApplication.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using WebMedicalApplication.Models;
using System.Text.Json.Serialization;
using System.Text.Json; // Add this for Json Serialization options

namespace BackendMedicalApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SearchController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult> SearchUsers(string term)
        {
            if (string.IsNullOrEmpty(term))
            {
                return BadRequest("Search term is empty");
            }
            var users = await _context.Users
                .Where(u => u.Username.Contains(term) || u.EmailAddress.Contains(term))
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("appointments")]
        public async Task<IActionResult> SearchAppointments(string term)
        {
            if (string.IsNullOrEmpty(term))
            {
                return BadRequest("Search term is empty");
            }
            var appointments = await _context.Appointments
                .Where(a => a.Reason.Contains(term))
                .Select(a => new
                {
                    AppointmentId = a.AppointmentId,
                    AppointmentDate = a.AppointmentDate,
                    DoctorId = a.DoctorId,
                    PatientId = a.PatientId,
                    Reason = a.Reason
                })
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpGet("patientrecords")]
        public async Task<IActionResult> SearchPatientRecords(string term)
        {
            if (string.IsNullOrEmpty(term))
            {
                return BadRequest("Search term is empty");
            }
            var patientRecords = await _context.PatientRecords
                .Where(pr => pr.Diagnosis.Contains(term) || pr.Notes.Contains(term))
                .Include(pr => pr.Patient)
                .ToListAsync();

            return Ok(patientRecords);
        }

        [HttpGet("schedules")]
        public async Task<IActionResult> SearchSchedules(string term)
        {
            if (string.IsNullOrEmpty(term))
            {
                return BadRequest("Search term is empty");
            }
            var schedules = await _context.Schedules
                .Where(s => s.Date.ToString().Contains(term) ||
                            s.StartTime.ToString().Contains(term) ||
                            s.EndTime.ToString().Contains(term))
                .Include(s => s.Doctor)
                .ToListAsync();

            return Ok(schedules);
        }

        [HttpGet("billings")]
        public async Task<IActionResult> SearchBillings(string term)
        {
            if (string.IsNullOrEmpty(term))
            {
                return BadRequest("Search term is empty");
            }
            var billings = await _context.Billings
                .Where(b => b.Amount.ToString().Contains(term) ||
                            b.PaymentStatus.Contains(term) ||
                            b.DateIssued.ToString().Contains(term))
                .Include(b => b.Patient)
                .ToListAsync();

            return Ok(billings);
        }

        /*[HttpGet]
        public async Task<IActionResult> Search(string term, string entityType)
        {
            if (string.IsNullOrEmpty(term))
            {
                return BadRequest("Search term is empty");
            }

            object result;
            switch (entityType?.ToLower())
            {
                case "users":
                    result = await SearchUsers(term);
                    break;
                case "appointments":
                    result = await SearchAppointments(term);
                    break;
                case "patientrecords":
                    result = await SearchPatientRecords(term);
                    break;
                case "treatments":
                    result = await SearchTreatments(term);
                    break;
                case "schedules":
                    result = await SearchSchedules(term);
                    break;
                case "billings":
                    result = await SearchBillings(term);
                    break;
                default:
                    return BadRequest("Unknown entity type for search");
            }

            var options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve,
                WriteIndented = true // Set this based on environment or preference
            };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return Content(jsonResponse, "application/json");
        }

        // Separate methods for each entity type
        private async Task<IEnumerable<User>> SearchUsers(string term)
        {
            return await _context.Users
                .Where(u => u.Username.Contains(term) || u.EmailAddress.Contains(term))
                .ToListAsync();
        }

        private async Task<IEnumerable<object>> SearchAppointments(string term)
        {
            return await _context.Appointments
                .Where(a => a.Reason.Contains(term))
                .Select(a => new
                {
                    AppointmentId = a.AppointmentId,
                    AppointmentDate = a.AppointmentDate,
                    DoctorId = a.DoctorId,
                    PatientId = a.PatientId,
                    Reason = a.Reason
                })
                .ToListAsync();
        }

        private async Task<IEnumerable<PatientRecord>> SearchPatientRecords(string term)
        {
            return await _context.PatientRecords
                .Where(pr => pr.Diagnosis.Contains(term) || pr.Notes.Contains(term))
                .Include(pr => pr.Patient)
                .ToListAsync();
        }

        private async Task<IEnumerable<Treatment>> SearchTreatments(string term)
        {
            return await _context.Treatments
                .Where(t => t.Description.Contains(term))
                .ToListAsync();
        }

        private async Task<IEnumerable<Schedule>> SearchSchedules(string term)
        {
            // Assuming that you want to search within a string representation of the schedule's date and times
            return await _context.Schedules
                .Where(s => s.Date.ToString().Contains(term) ||
                            s.StartTime.ToString().Contains(term) ||
                            s.EndTime.ToString().Contains(term))
                .Include(s => s.Doctor) // Assuming you have a navigation property for Doctor in your Schedule model
                .ToListAsync();
        }

        private async Task<IEnumerable<Billing>> SearchBillings(string term)
        {
            return await _context.Billings
                .Where(b => b.Amount.ToString().Contains(term) ||
                            b.PaymentStatus.Contains(term) ||
                            b.DateIssued.ToString().Contains(term))
                .Include(b => b.Patient) // Assuming you have a navigation property for Patient in your Billing model
                .ToListAsync();
        }*/
    }
}
