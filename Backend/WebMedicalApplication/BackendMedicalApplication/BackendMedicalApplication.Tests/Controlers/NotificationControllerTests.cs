using BackendMedicalApplication.Controllers;
using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace BackendMedicalApplication.Tests
{
    public class NotificationControllerTests
    {
        private readonly Mock<INotificationService> _mockNotificationService;
        private readonly Mock<IEmailService> _mockEmailService;
        private readonly NotificationController _controller;

        public NotificationControllerTests()
        {
            _mockNotificationService = new Mock<INotificationService>();
            _mockEmailService = new Mock<IEmailService>();
            _controller = new NotificationController(_mockNotificationService.Object, _mockEmailService.Object);
        }

        [Fact]
        public async Task GetNotifications_ReturnsOkResult()
        {
            var notifications = new List<Notification>
            {
                new Notification { Id = 1, Message = "Message 1" },
                new Notification { Id = 2, Message = "Message 2" }
            };
            _mockNotificationService.Setup(service => service.GetNotificationsByUserId(It.IsAny<int>())).ReturnsAsync(notifications);

            var result = await _controller.GetNotifications(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<Notification>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetUnreadNotificationsCount_ReturnsOkResult()
        {
            _mockNotificationService.Setup(service => service.GetUnreadNotificationsCount(It.IsAny<int>())).ReturnsAsync(5);

            var result = await _controller.GetUnreadNotificationsCount(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<int>(okResult.Value);
            Assert.Equal(5, returnValue);
        }

        [Fact]
        public async Task CreateNotification_ReturnsOkResult()
        {
            var notificationDto = new NotificationDto { UserId = 1, Message = "New Notification" };

            var result = await _controller.CreateNotification(notificationDto);

            _mockNotificationService.Verify(service => service.CreateNotification(It.IsAny<int>(), It.IsAny<string>()), Times.Once);
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task MarkAsRead_ReturnsOkResult()
        {
            var result = await _controller.MarkAsRead(1);

            _mockNotificationService.Verify(service => service.MarkAsRead(It.IsAny<int>()), Times.Once);
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task MarkAllAsRead_ReturnsOkResult()
        {
            var result = await _controller.MarkAllAsRead(1);

            _mockNotificationService.Verify(service => service.MarkAllAsRead(It.IsAny<int>()), Times.Once);
            Assert.IsType<OkResult>(result);
        }
    }
}
