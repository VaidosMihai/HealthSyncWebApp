using BackendMedicalApplication.DTo;
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
    private readonly IEmailService _emailService;
    private readonly ISmsService _smsService;

    public NotificationController(INotificationService notificationService, IEmailService emailService, ISmsService smsService)
    {
        _notificationService = notificationService;
        _emailService = emailService;
        _smsService = smsService;
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
/*
    [HttpPost("send-email")]
    public async Task<IActionResult> SendEmail([FromBody] EmailDto emailDto)
    {

        await _emailService.SendEmailAsync(emailDto.To, emailDto.Subject, emailDto.Body);
        return Ok("Email sent successfully.");
    }*/
}
