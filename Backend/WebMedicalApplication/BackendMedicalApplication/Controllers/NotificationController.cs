using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;
    private readonly IEmailService _emailService; // Email service dependency

    public NotificationController(INotificationService notificationService, IEmailService emailService)
    {
        _notificationService = notificationService;
        _emailService = emailService; // Initialize email service
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<Notification>>> GetNotifications(int userId)
    {
        var notifications = await _notificationService.GetNotificationsByUserId(userId);
        return Ok(notifications);
    }

    [HttpGet("unread-count/{userId}")]
    public async Task<ActionResult<int>> GetUnreadNotificationsCount(int userId)
    {
        var count = await _notificationService.GetUnreadNotificationsCount(userId);
        return Ok(count);
    }

    [HttpPost("send-email")]
    public async Task<IActionResult> SendEmailNotification([FromBody] EmailRequest emailRequest)
    {
        try
        {
            await _emailService.SendEmailAsync(emailRequest.To, emailRequest.Subject, emailRequest.Body);
            return Ok("Email sent successfully.");
        }
        catch (System.Exception ex)
        {
            return BadRequest("Failed to send email: " + ex.Message);
        }
    }
}

public class EmailRequest
{
    public string To { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
}
