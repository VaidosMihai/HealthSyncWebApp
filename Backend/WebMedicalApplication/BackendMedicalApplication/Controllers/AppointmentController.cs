using Microsoft.AspNetCore.Mvc;
using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebMedicalApplication.Models;

namespace BackendMedicalApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly AppDbContext _context;
        private readonly ILogger<AppointmentController> _logger;

        public AppointmentController(IAppointmentService appointmentService, AppDbContext context, ILogger<AppointmentController> logger)
        {
            _appointmentService = appointmentService;
            _context = context; // Initialize _context
            _logger = logger;
        }

        [HttpGet]
        public IActionResult GetAllAppointments()
        {
            var appointments = _appointmentService.GetAllAppointments();
            return Ok(appointments);
        }

        [HttpGet("{appointmentId}")]
        public IActionResult GetAppointmentById(int appointmentId)
        {
            var appointment = _appointmentService.GetAppointmentById(appointmentId);
            if (appointment == null)
            {
                return NotFound($"Appointment with ID {appointmentId} not found.");
            }
            return Ok(appointment);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] AppointmentDto appointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdAppointment = await _appointmentService.CreateAppointment(appointmentDto);
                return CreatedAtAction(nameof(GetAppointmentById), new { appointmentId = createdAppointment.AppointmentId }, createdAppointment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating appointment");
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPut("{appointmentId}")]
        public async Task<IActionResult> UpdateAppointment(int appointmentId, [FromBody] AppointmentDto appointmentDto)
        {
            try
            {
                var updatedAppointment = await _appointmentService.UpdateAppointment(appointmentId, appointmentDto);
                if (updatedAppointment == null)
                {
                    return NotFound($"Appointment with ID {appointmentId} not found.");
                }
                return Ok(updatedAppointment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating appointment");
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpDelete("{appointmentId}")]
        public async Task<IActionResult> DeleteAppointment(int appointmentId)
        {
            var result = await _appointmentService.DeleteAppointment(appointmentId);
            if (!result)
            {
                return NotFound($"Appointment with ID {appointmentId} not found.");
            }
            return NoContent();
        }

        [HttpGet("by-doctor/{doctorId}")]
        public async Task<IActionResult> GetAppointmentsByDoctor(int doctorId)
        {
            var appointments = await _appointmentService.GetByDoctorId(doctorId);
            if (appointments == null || !appointments.Any())
            {
                return NotFound();
            }
            return Ok(appointments);
        }

        [HttpGet("by-patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAppointmentsByPatient(int patientId)
        {
            var appointments = await _appointmentService.GetAppointmentsByPatientId(patientId);
            if (appointments == null || !appointments.Any())
            {
                return NotFound("No appointments found for the specified patient.");
            }
            return Ok(appointments);
        }

        [HttpPost("{appointmentId}/addPatientRecord")]
        public IActionResult AddPatientRecordToAppointment(int appointmentId, [FromBody] PatientRecordDto patientRecordDto)
        {
            try
            {
                var appointment = _appointmentService.AddPatientRecordToAppointment(appointmentId, patientRecordDto);
                return CreatedAtAction(nameof(GetAppointmentById), new { appointmentId = appointment.Result.PatientId }, appointment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{appointmentId}/accept")]
        public async Task<IActionResult> AcceptAppointment(int appointmentId)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null)
            {
                return NotFound($"Appointment with ID {appointmentId} not found.");
            }

            appointment.Status = "Accepted";
            await _context.SaveChangesAsync();
            return Ok(appointment);
        }

        [HttpPut("{appointmentId}/decline")]
        public async Task<IActionResult> DeclineAppointment(int appointmentId)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null)
            {
                return NotFound($"Appointment with ID {appointmentId} not found.");
            }

            appointment.Status = "Declined";
            await _context.SaveChangesAsync();
            return Ok(appointment);
        }

        [HttpPut("{appointmentId}/reschedule")]
        public async Task<IActionResult> RescheduleAppointment(int appointmentId, [FromBody] DateTime newDateTime)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null)
            {
                return NotFound($"Appointment with ID {appointmentId} not found.");
            }

            appointment.Status = "Rescheduled";
            appointment.AppointmentDate = newDateTime;
            await _context.SaveChangesAsync();
            return Ok(appointment);
        }

        [HttpPut("{appointmentId}/status")]
        public async Task<IActionResult> UpdateAppointmentStatus(int appointmentId, [FromBody] string status)
        {
            var updatedAppointment = await _appointmentService.UpdateAppointmentStatus(appointmentId, status);
            if (updatedAppointment == null)
            {
                return NotFound($"Appointment with ID {appointmentId} not found.");
            }
            return Ok(updatedAppointment);
        }
    }
}
