using Microsoft.AspNetCore.Mvc;
using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using System.Threading.Tasks;

namespace BackendMedicalApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientRecordController : ControllerBase
    {
        private readonly IPatientRecordService _patientRecordService;

        public PatientRecordController(IPatientRecordService patientRecordService)
        {
            _patientRecordService = patientRecordService;
        }

        [HttpGet]
        public IActionResult GetAllPatientRecords()
        {
            var records = _patientRecordService.GetAllPatientRecords();
            return Ok(records);
        }

        [HttpGet("{recordId}")]
        public IActionResult GetPatientRecordById(int recordId)
        {
            var record = _patientRecordService.GetPatientRecordById(recordId);
            if (record == null)
            {
                return NotFound($"Patient record with ID {recordId} not found.");
            }
            return Ok(record);
        }

        [HttpPost]
        public IActionResult CreatePatientRecord([FromBody] PatientRecordDto patientRecordDto)
        {
            var createdRecord = _patientRecordService.CreatePatientRecord(patientRecordDto);
            if (createdRecord == null)
            {
                return BadRequest("Error creating patient record.");
            }
            return CreatedAtAction(nameof(GetPatientRecordById), new { recordId = createdRecord.PatientRecordId }, createdRecord);
        }

        [HttpPut("{recordId}")]
        public IActionResult UpdatePatientRecord(int recordId, [FromBody] PatientRecordDto patientRecordDto)
        {
            var updatedRecord = _patientRecordService.UpdatePatientRecord(recordId, patientRecordDto);
            if (updatedRecord == null)
            {
                return NotFound($"Patient record with ID {recordId} not found.");
            }
            return Ok(updatedRecord);
        }

        [HttpDelete("{recordId}")]
        public IActionResult DeletePatientRecord(int recordId)
        {
            var isDeleted = _patientRecordService.DeletePatientRecord(recordId);
            if (!isDeleted)
            {
                return NotFound($"Patient record with ID {recordId} not found.");
            }
            return NoContent();
        }

        [HttpGet("by-appointment/{appointmentId}")]
        public async Task<IActionResult> GetPatientRecordByAppointmentId(int appointmentId)
        {
            var medicalRecord = await _patientRecordService.GetPatientRecordByAppointmentId(appointmentId);
            if (medicalRecord == null)
            {
                return NotFound($"No medical record found for appointment ID {appointmentId}.");
            }
            return Ok(medicalRecord);
        }
    }
}
