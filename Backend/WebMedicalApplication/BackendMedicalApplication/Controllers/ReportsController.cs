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

    [HttpGet("oldest-patient")]
    public async Task<ActionResult<UserDto>> GetOldestPatient()
    {
        var patient = await _reportService.GetOldestPatientAsync();
        return Ok(patient);
    }

    [HttpGet("youngest-patient")]
    public async Task<ActionResult<UserDto>> GetYoungestPatient()
    {
        var patient = await _reportService.GetYoungestPatientAsync();
        return Ok(patient);
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
}
