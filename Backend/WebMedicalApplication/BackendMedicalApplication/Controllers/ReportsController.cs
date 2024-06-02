using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("patient-most-appointments")]
    public async Task<ActionResult<UserDto>> GetPatientWithMostAppointments()
    {
        var patient = await _reportService.GetPatientWithMostAppointmentsAsync();
        return Ok(patient);
    }

    [HttpGet("doctor-most-reviews")]
    public async Task<ActionResult<UserDto>> GetDoctorWithMostReviews()
    {
        var doctor = await _reportService.GetDoctorWithMostReviewsAsync();
        return Ok(doctor);
    }

    [HttpGet("oldest-patient")]
    public async Task<ActionResult<UserDto>> GetOldestPatient()
    {
        var patient = await _reportService.GetOldestPatientAsync();
        if (patient == null)
        {
            return NotFound();
        }
        return Ok(patient);
    }

    [HttpGet("youngest-patient")]
    public async Task<ActionResult<UserDto>> GetYoungestPatient()
    {
        var patient = await _reportService.GetYoungestPatientAsync();
        if (patient == null)
        {
            return NotFound();
        }
        return Ok(patient);
    }

    [HttpGet("oldest-doctor")]
    public async Task<ActionResult<UserDto>> GetOldestDoctor()
    {
        var doctor = await _reportService.GetOldestDoctorAsync();
        if (doctor == null)
        {
            return NotFound();
        }
        return Ok(doctor);
    }

    [HttpGet("youngest-doctor")]
    public async Task<ActionResult<UserDto>> GetYoungestDoctor()
    {
        var doctor = await _reportService.GetYoungestDoctorAsync();
        if (doctor == null)
        {
            return NotFound();
        }
        return Ok(doctor);
    }
}
