using Microsoft.AspNetCore.Mvc;
using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;

namespace BackendMedicalApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
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
        public IActionResult CreateAppointment([FromBody] AppointmentDto appointmentDto)
        {
            var createdAppointment = _appointmentService.CreateAppointment(appointmentDto);
            // Assuming CreateAppointment returns the created AppointmentDto including its ID
            return CreatedAtAction(nameof(GetAppointmentById), new { appointmentId = createdAppointment.Result.PatientId }, createdAppointment);
        }

        [HttpPut("{appointmentId}")]
        public IActionResult UpdateAppointment(int appointmentId, [FromBody] AppointmentDto appointmentDto)
        {
            var updatedAppointment = _appointmentService.UpdateAppointment(appointmentId, appointmentDto);
            if (updatedAppointment == null)
            {
                return NotFound($"Appointment with ID {appointmentId} not found.");
            }
            return Ok(updatedAppointment);
        }

        [HttpDelete("{appointmentId}")]
        public async Task<IActionResult> DeleteAppointment(int appointmentId)
        {
            var result = await _appointmentService.DeleteAppointment(appointmentId);
            if (!result)
            {
                return NotFound($"Appointment with ID {appointmentId} not found.");
            }
            return NoContent(); // Standard response for a successful delete operation
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

    }
}
