using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using BackendMedicalApplication.Services;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebMedicalApplication.Models;
using Xunit;
using Microsoft.EntityFrameworkCore;  // Ensure this is added for EF Core

namespace BackendMedicalApplication.Tests
{
    public class AppointmentServiceTests
    {
        private readonly Mock<AppDbContext> _mockContext;
        private readonly Mock<INotificationService> _mockNotificationService;
        private readonly AppointmentService _appointmentService;

        public AppointmentServiceTests()
        {
            _mockContext = new Mock<AppDbContext>();
            _mockNotificationService = new Mock<INotificationService>();
            _appointmentService = new AppointmentService(_mockContext.Object, _mockNotificationService.Object);
        }

        [Fact]
        public void GetAllAppointments_ReturnsAllAppointments()
        {
            // Arrange
            var appointments = new List<Appointment>
            {
                new Appointment { AppointmentId = 1, PatientId = 1, DoctorId = 1, AppointmentDate = DateTime.Now, Reason = "Reason 1", Status = "Pending" },
                new Appointment { AppointmentId = 2, PatientId = 2, DoctorId = 2, AppointmentDate = DateTime.Now, Reason = "Reason 2", Status = "Confirmed" }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Appointment>>();
            mockSet.As<IQueryable<Appointment>>().Setup(m => m.Provider).Returns(appointments.Provider);
            mockSet.As<IQueryable<Appointment>>().Setup(m => m.Expression).Returns(appointments.Expression);
            mockSet.As<IQueryable<Appointment>>().Setup(m => m.ElementType).Returns(appointments.ElementType);
            mockSet.As<IQueryable<Appointment>>().Setup(m => m.GetEnumerator()).Returns(appointments.GetEnumerator());

            _mockContext.Setup(c => c.Appointments).Returns(mockSet.Object);

            // Act
            var result = _appointmentService.GetAllAppointments();

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal("Reason 1", result.First().Reason);
        }

        [Fact]
        public void GetAppointmentById_ReturnsAppointment_WhenAppointmentExists()
        {
            // Arrange
            var appointment = new Appointment { AppointmentId = 1, PatientId = 1, DoctorId = 1, AppointmentDate = DateTime.Now, Reason = "Reason 1", Status = "Pending" };
            _mockContext.Setup(c => c.Appointments.Find(It.IsAny<int>())).Returns(appointment);

            // Act
            var result = _appointmentService.GetAppointmentById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Reason 1", result.Reason);
        }

        [Fact]
        public void GetAppointmentById_ReturnsNull_WhenAppointmentDoesNotExist()
        {
            // Arrange
            _mockContext.Setup(c => c.Appointments.Find(It.IsAny<int>())).Returns((Appointment)null);

            // Act
            var result = _appointmentService.GetAppointmentById(1);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateAppointment_AddsNewAppointment()
        {
            // Arrange
            var appointmentDto = new AppointmentDto
            {
                PatientId = 1,
                DoctorId = 1,
                DateTime = DateTime.Now,
                Reason = "Reason 1",
                Status = "Pending"
            };

            var mockSet = new Mock<DbSet<Appointment>>();
            _mockContext.Setup(c => c.Appointments).Returns(mockSet.Object);
            _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _appointmentService.CreateAppointment(appointmentDto);

            // Assert
            mockSet.Verify(m => m.Add(It.IsAny<Appointment>()), Times.Once());
            _mockNotificationService.Verify(n => n.CreateNotification(It.IsAny<int>(), It.IsAny<string>()), Times.Once());
            Assert.NotNull(result);
            Assert.Equal("Pending", result.Status);
        }

        // Additional tests for UpdateAppointment, DeleteAppointment, etc.
    }
}
