using BackendMedicalApplication.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BackendMedicalApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("most-appointments-patients")]
        public async Task<IActionResult> GetPatientsWithMostAppointments()
        {
            var result = await _reportService.GetPatientsWithMostAppointments();
            return Ok(result);
        }

        [HttpGet("oldest-patient")]
        public async Task<IActionResult> GetOldestPatient()
        {
            var result = await _reportService.GetOldestPatient();
            return Ok(result);
        }

        [HttpGet("youngest-patient")]
        public async Task<IActionResult> GetYoungestPatient()
        {
            var result = await _reportService.GetYoungestPatient();
            return Ok(result);
        }

        [HttpGet("most-reviews-doctors")]
        public async Task<IActionResult> GetDoctorsWithMostReviews()
        {
            var result = await _reportService.GetDoctorsWithMostReviews();
            return Ok(result);
        }

        [HttpGet("most-reviews-patients")]
        public async Task<IActionResult> GetPatientsWithMostReviews()
        {
            var result = await _reportService.GetPatientsWithMostReviews();
            return Ok(result);
        }

        [HttpGet("most-medical-records-patients")]
        public async Task<IActionResult> GetPatientsWithMostMedicalRecords()
        {
            var result = await _reportService.GetPatientsWithMostMedicalRecords();
            return Ok(result);
        }

        [HttpGet("most-appointments-doctors")]
        public async Task<IActionResult> GetDoctorsWithMostAppointments()
        {
            var result = await _reportService.GetDoctorsWithMostAppointments();
            return Ok(result);
        }
    }
}
