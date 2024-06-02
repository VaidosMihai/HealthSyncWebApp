using BackendMedicalApplication.Controllers;
using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebMedicalApplication.Models;
using Xunit;

namespace BackendMedicalApplication.Tests
{
    public class AppointmentControllerTests
    {
        private readonly Mock<IAppointmentService> _mockService;
        private readonly Mock<AppDbContext> _mockContext;
        private readonly Mock<ILogger<AppointmentController>> _mockLogger;
        private readonly AppointmentController _controller;

        public AppointmentControllerTests()
        {
            _mockService = new Mock<IAppointmentService>();
            _mockContext = new Mock<AppDbContext>();
            _mockLogger = new Mock<ILogger<AppointmentController>>();
            _controller = new AppointmentController(_mockService.Object, _mockContext.Object, _mockLogger.Object);
        }

        [Fact]
        public void GetAllAppointments_ReturnsOkResult()
        {
            var appointments = new List<AppointmentDto>
            {
                new AppointmentDto { AppointmentId = 1, Reason = "Checkup" },
                new AppointmentDto { AppointmentId = 2, Reason = "Follow-up" }
            };
            _mockService.Setup(service => service.GetAllAppointments()).Returns(appointments);

            var result = _controller.GetAllAppointments();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<AppointmentDto>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public void GetAppointmentById_ReturnsOkResult()
        {
            var appointment = new AppointmentDto { AppointmentId = 1, Reason = "Checkup" };
            _mockService.Setup(service => service.GetAppointmentById(It.IsAny<int>())).Returns(appointment);

            var result = _controller.GetAppointmentById(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<AppointmentDto>(okResult.Value);
            Assert.Equal("Checkup", returnValue.Reason);
        }

        [Fact]
        public async Task CreateAppointment_ReturnsCreatedAtActionResult()
        {
            var appointmentDto = new AppointmentDto { Reason = "Checkup" };
            _mockService.Setup(service => service.CreateAppointment(It.IsAny<AppointmentDto>())).ReturnsAsync(appointmentDto);

            var result = await _controller.CreateAppointment(appointmentDto);

            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnValue = Assert.IsType<AppointmentDto>(createdAtActionResult.Value);
            Assert.Equal("Checkup", returnValue.Reason);
        }

        [Fact]
        public async Task UpdateAppointment_ReturnsOkResult()
        {
            var appointmentDto = new AppointmentDto { AppointmentId = 1, Reason = "Updated Checkup" };
            _mockService.Setup(service => service.UpdateAppointment(It.IsAny<int>(), It.IsAny<AppointmentDto>())).ReturnsAsync(appointmentDto);

            var result = await _controller.UpdateAppointment(1, appointmentDto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<AppointmentDto>(okResult.Value);
            Assert.Equal("Updated Checkup", returnValue.Reason);
        }

        [Fact]
        public async Task DeleteAppointment_ReturnsNoContentResult()
        {
            _mockService.Setup(service => service.DeleteAppointment(It.IsAny<int>())).ReturnsAsync(true);

            var result = await _controller.DeleteAppointment(1);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task GetAppointmentsByDoctor_ReturnsOkResult()
        {
            var appointments = new List<AppointmentDto>
            {
                new AppointmentDto { AppointmentId = 1, Reason = "Checkup" }
            };
            _mockService.Setup(service => service.GetByDoctorId(It.IsAny<int>())).ReturnsAsync(appointments);

            var result = await _controller.GetAppointmentsByDoctor(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<AppointmentDto>>(okResult.Value);
            Assert.Single(returnValue);
        }

        [Fact]
        public async Task GetAppointmentsByPatient_ReturnsOkResult()
        {
            var appointments = new List<AppointmentDto>
            {
                new AppointmentDto { AppointmentId = 1, Reason = "Checkup" }
            };
            _mockService.Setup(service => service.GetAppointmentsByPatientId(It.IsAny<int>())).ReturnsAsync(appointments);

            var result = await _controller.GetAppointmentsByPatient(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<AppointmentDto>>(okResult.Value);
            Assert.Single(returnValue);
        }

        [Fact]
        public async Task AddPatientRecordToAppointment_ReturnsCreatedAtActionResult()
        {
            var appointmentDto = new AppointmentDto { Reason = "Checkup" };
            _mockService.Setup(service => service.AddPatientRecordToAppointment(It.IsAny<int>(), It.IsAny<PatientRecordDto>())).ReturnsAsync(appointmentDto);

            var result = _controller.AddPatientRecordToAppointment(1, new PatientRecordDto());

            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnValue = Assert.IsType<AppointmentDto>(createdAtActionResult.Value);
            Assert.Equal("Checkup", returnValue.Reason);
        }

        [Fact]
        public async Task AcceptAppointment_ReturnsOkResult()
        {
            var appointment = new Appointment { AppointmentId = 1, Status = "Pending" };
            _mockContext.Setup(c => c.Appointments.FindAsync(It.IsAny<int>())).ReturnsAsync(appointment);

            var result = await _controller.AcceptAppointment(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<Appointment>(okResult.Value);
            Assert.Equal("Accepted", returnValue.Status);
        }

        [Fact]
        public async Task DeclineAppointment_ReturnsOkResult()
        {
            var appointment = new Appointment { AppointmentId = 1, Status = "Pending" };
            _mockContext.Setup(c => c.Appointments.FindAsync(It.IsAny<int>())).ReturnsAsync(appointment);

            var result = await _controller.DeclineAppointment(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<Appointment>(okResult.Value);
            Assert.Equal("Declined", returnValue.Status);
        }

        [Fact]
        public async Task RescheduleAppointment_ReturnsOkResult()
        {
            var appointment = new Appointment { AppointmentId = 1, Status = "Pending", AppointmentDate = DateTime.Now };
            _mockContext.Setup(c => c.Appointments.FindAsync(It.IsAny<int>())).ReturnsAsync(appointment);

            var newDateTime = DateTime.Now.AddDays(1);
            var result = await _controller.RescheduleAppointment(1, newDateTime);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<Appointment>(okResult.Value);
            Assert.Equal("Rescheduled", returnValue.Status);
            Assert.Equal(newDateTime, returnValue.AppointmentDate);
        }

        [Fact]
        public async Task UpdateAppointmentStatus_ReturnsOkResult()
        {
            var appointmentDto = new AppointmentDto { AppointmentId = 1, Status = "Pending" };
            _mockService.Setup(service => service.UpdateAppointmentStatus(It.IsAny<int>(), It.IsAny<string>())).ReturnsAsync(appointmentDto);

            var result = await _controller.UpdateAppointmentStatus(1, "Completed");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<AppointmentDto>(okResult.Value);
            Assert.Equal("Completed", returnValue.Status);
        }
    }
}
