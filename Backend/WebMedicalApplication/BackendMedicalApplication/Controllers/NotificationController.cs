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

    public NotificationController(INotificationService notificationService, IEmailService emailService)
    {
        _notificationService = notificationService;
        _emailService = emailService;
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

    [HttpPost]
    public async Task<ActionResult> CreateNotification([FromBody] NotificationDto notificationDto)
    {
        await _notificationService.CreateNotification(notificationDto.UserId, notificationDto.Message);
        return Ok();
    }

    [HttpPut("{notificationId}/mark-as-read")]
    public async Task<ActionResult> MarkAsRead(int notificationId)
    {
        await _notificationService.MarkAsRead(notificationId);
        return Ok();
    }

    [HttpPost("mark-all-as-read/{userId}")]
    public async Task<ActionResult> MarkAllAsRead(int userId)
    {
        try
        {
            await _notificationService.MarkAllAsRead(userId);
            return Ok(new { message = "All notifications marked as read" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }

}
