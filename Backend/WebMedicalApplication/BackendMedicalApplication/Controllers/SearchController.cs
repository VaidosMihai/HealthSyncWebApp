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
    }
}
