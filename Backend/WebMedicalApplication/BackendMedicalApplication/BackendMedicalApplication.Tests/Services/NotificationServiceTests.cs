using BackendMedicalApplication;
using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using BackendMedicalApplication.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

public class NotificationServiceTests
{
    private readonly Mock<AppDbContext> _mockContext;
    private readonly NotificationService _notificationService;

    public NotificationServiceTests()
    {
        _mockContext = new Mock<AppDbContext>();
        _notificationService = new NotificationService(_mockContext.Object);
    }

    [Fact]
    public async Task GetUnreadNotificationsCount_ReturnsCount()
    {
        // Arrange
        var notifications = new List<Notification>
        {
            new Notification { UserId = 1, IsRead = false },
            new Notification { UserId = 1, IsRead = false },
            new Notification { UserId = 1, IsRead = true }
        }.AsQueryable();

        var mockSet = new Mock<DbSet<Notification>>();
        mockSet.As<IQueryable<Notification>>().Setup(m => m.Provider).Returns(notifications.Provider);
        mockSet.As<IQueryable<Notification>>().Setup(m => m.Expression).Returns(notifications.Expression);
        mockSet.As<IQueryable<Notification>>().Setup(m => m.ElementType).Returns(notifications.ElementType);
        mockSet.As<IQueryable<Notification>>().Setup(m => m.GetEnumerator()).Returns(notifications.GetEnumerator());

        _mockContext.Setup(c => c.Notifications).Returns(mockSet.Object);

        // Act
        var result = await _notificationService.GetUnreadNotificationsCount(1);

        // Assert
        Assert.Equal(2, result);
    }

    [Fact]
    public async Task CreateNotification_AddsNotification()
    {
        // Arrange
        var notification = new Notification { UserId = 1, Message = "Test Notification" };
        var mockSet = new Mock<DbSet<Notification>>();
        _mockContext.Setup(m => m.Notifications).Returns(mockSet.Object);
        _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        await _notificationService.CreateNotification(1, "Test Notification");

        // Assert
        mockSet.Verify(m => m.Add(It.IsAny<Notification>()), Times.Once());
        _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
    }

    [Fact]
    public async Task GetNotificationsByUserId_ReturnsNotifications()
    {
        // Arrange
        var notifications = new List<Notification>
        {
            new Notification { UserId = 1, IsRead = false },
            new Notification { UserId = 1, IsRead = false },
            new Notification { UserId = 2, IsRead = true }
        }.AsQueryable();

        var mockSet = new Mock<DbSet<Notification>>();
        mockSet.As<IQueryable<Notification>>().Setup(m => m.Provider).Returns(notifications.Provider);
        mockSet.As<IQueryable<Notification>>().Setup(m => m.Expression).Returns(notifications.Expression);
        mockSet.As<IQueryable<Notification>>().Setup(m => m.ElementType).Returns(notifications.ElementType);
        mockSet.As<IQueryable<Notification>>().Setup(m => m.GetEnumerator()).Returns(notifications.GetEnumerator());

        _mockContext.Setup(c => c.Notifications).Returns(mockSet.Object);

        // Act
        var result = await _notificationService.GetNotificationsByUserId(1);

        // Assert
        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task MarkAsRead_MarksNotificationAsRead()
    {
        // Arrange
        var notification = new Notification { Id = 1, IsRead = false };
        var mockSet = new Mock<DbSet<Notification>>();
        mockSet.Setup(m => m.FindAsync(It.IsAny<int>())).ReturnsAsync(notification);
        _mockContext.Setup(m => m.Notifications).Returns(mockSet.Object);
        _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        await _notificationService.MarkAsRead(1);

        // Assert
        Assert.True(notification.IsRead);
        _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
    }

    [Fact]
    public async Task MarkAllAsRead_MarksAllNotificationsAsRead()
    {
        // Arrange
        var notifications = new List<Notification>
        {
            new Notification { UserId = 1, IsRead = false },
            new Notification { UserId = 1, IsRead = false },
            new Notification { UserId = 1, IsRead = true }
        }.AsQueryable();

        var mockSet = new Mock<DbSet<Notification>>();
        mockSet.As<IQueryable<Notification>>().Setup(m => m.Provider).Returns(notifications.Provider);
        mockSet.As<IQueryable<Notification>>().Setup(m => m.Expression).Returns(notifications.Expression);
        mockSet.As<IQueryable<Notification>>().Setup(m => m.ElementType).Returns(notifications.ElementType);
        mockSet.As<IQueryable<Notification>>().Setup(m => m.GetEnumerator()).Returns(notifications.GetEnumerator());

        _mockContext.Setup(c => c.Notifications).Returns(mockSet.Object);

        // Act
        await _notificationService.MarkAllAsRead(1);

        // Assert
        foreach (var notification in notifications)
        {
            Assert.True(notification.IsRead);
        }
        _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
    }
}
