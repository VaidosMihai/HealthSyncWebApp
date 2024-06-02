using BackendMedicalApplication.Controllers;
using BackendMedicalApplication.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebMedicalApplication.Models;
using Xunit;

namespace BackendMedicalApplication.Tests
{
    public class SearchControllerTests
    {
        private readonly Mock<AppDbContext> _mockContext;
        private readonly SearchController _controller;

        public SearchControllerTests()
        {
            _mockContext = new Mock<AppDbContext>();
            _controller = new SearchController(_mockContext.Object);
        }

        [Fact]
        public async Task SearchUsers_ReturnsOkResult()
        {
            var users = new List<User>
            {
                new User { UserId = 1, Username = "user1", EmailAddress = "user1@example.com" },
                new User { UserId = 2, Username = "user2", EmailAddress = "user2@example.com" }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<User>>();
            mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(users.Provider);
            mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(users.Expression);
            mockSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(users.ElementType);
            mockSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(users.GetEnumerator());

            _mockContext.Setup(c => c.Users).Returns(mockSet.Object);

            var result = await _controller.SearchUsers("user");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<User>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task SearchAppointments_ReturnsOkResult()
        {
            var appointments = new List<Appointment>
            {
                new Appointment { AppointmentId = 1, Reason = "Checkup" },
                new Appointment { AppointmentId = 2, Reason = "Follow-up" }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Appointment>>();
            mockSet.As<IQueryable<Appointment>>().Setup(m => m.Provider).Returns(appointments.Provider);
            mockSet.As<IQueryable<Appointment>>().Setup(m => m.Expression).Returns(appointments.Expression);
            mockSet.As<IQueryable<Appointment>>().Setup(m => m.ElementType).Returns(appointments.ElementType);
            mockSet.As<IQueryable<Appointment>>().Setup(m => m.GetEnumerator()).Returns(appointments.GetEnumerator());

            _mockContext.Setup(c => c.Appointments).Returns(mockSet.Object);

            var result = await _controller.SearchAppointments("Checkup");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<object>>(okResult.Value);
            Assert.Single(returnValue);
        }

        [Fact]
        public async Task SearchPatientRecords_ReturnsOkResult()
        {
            var patientRecords = new List<PatientRecord>
            {
                new PatientRecord { PatientRecordId = 1, Diagnosis = "Diagnosis 1", Notes = "Notes 1" },
                new PatientRecord { PatientRecordId = 2, Diagnosis = "Diagnosis 2", Notes = "Notes 2" }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<PatientRecord>>();
            mockSet.As<IQueryable<PatientRecord>>().Setup(m => m.Provider).Returns(patientRecords.Provider);
            mockSet.As<IQueryable<PatientRecord>>().Setup(m => m.Expression).Returns(patientRecords.Expression);
            mockSet.As<IQueryable<PatientRecord>>().Setup(m => m.ElementType).Returns(patientRecords.ElementType);
            mockSet.As<IQueryable<PatientRecord>>().Setup(m => m.GetEnumerator()).Returns(patientRecords.GetEnumerator());

            _mockContext.Setup(c => c.PatientRecords).Returns(mockSet.Object);

            var result = await _controller.SearchPatientRecords("Diagnosis");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<PatientRecord>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }
    }
}
