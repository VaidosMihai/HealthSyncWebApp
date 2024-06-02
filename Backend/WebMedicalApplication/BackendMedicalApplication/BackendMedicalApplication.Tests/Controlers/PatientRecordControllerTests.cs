using BackendMedicalApplication.Controllers;
using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using Xunit;

namespace BackendMedicalApplication.Tests
{
    public class PatientRecordControllerTests
    {
        private readonly Mock<IPatientRecordService> _mockService;
        private readonly PatientRecordController _controller;

        public PatientRecordControllerTests()
        {
            _mockService = new Mock<IPatientRecordService>();
            _controller = new PatientRecordController(_mockService.Object);
        }

        [Fact]
        public void GetAllPatientRecords_ReturnsOkResult()
        {
            var records = new List<PatientRecordDto>
            {
                new PatientRecordDto { PatientRecordId = 1, Diagnosis = "Diagnosis 1" },
                new PatientRecordDto { PatientRecordId = 2, Diagnosis = "Diagnosis 2" }
            };
            _mockService.Setup(service => service.GetAllPatientRecords()).Returns(records);

            var result = _controller.GetAllPatientRecords();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<PatientRecordDto>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public void GetPatientRecordById_ReturnsOkResult()
        {
            var record = new PatientRecordDto { PatientRecordId = 1, Diagnosis = "Diagnosis 1" };
            _mockService.Setup(service => service.GetPatientRecordById(It.IsAny<int>())).Returns(record);

            var result = _controller.GetPatientRecordById(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PatientRecordDto>(okResult.Value);
            Assert.Equal("Diagnosis 1", returnValue.Diagnosis);
        }

        [Fact]
        public void CreatePatientRecord_ReturnsCreatedAtActionResult()
        {
            var recordDto = new PatientRecordDto { Diagnosis = "Diagnosis 1" };
            _mockService.Setup(service => service.CreatePatientRecord(It.IsAny<PatientRecordDto>())).Returns(recordDto);

            var result = _controller.CreatePatientRecord(recordDto);

            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnValue = Assert.IsType<PatientRecordDto>(createdAtActionResult.Value);
            Assert.Equal("Diagnosis 1", returnValue.Diagnosis);
        }

        [Fact]
        public void UpdatePatientRecord_ReturnsOkResult()
        {
            var recordDto = new PatientRecordDto { PatientRecordId = 1, Diagnosis = "Updated Diagnosis" };
            _mockService.Setup(service => service.UpdatePatientRecord(It.IsAny<int>(), It.IsAny<PatientRecordDto>())).Returns(recordDto);

            var result = _controller.UpdatePatientRecord(1, recordDto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PatientRecordDto>(okResult.Value);
            Assert.Equal("Updated Diagnosis", returnValue.Diagnosis);
        }

        [Fact]
        public void DeletePatientRecord_ReturnsNoContentResult()
        {
            _mockService.Setup(service => service.DeletePatientRecord(It.IsAny<int>())).Returns(true);

            var result = _controller.DeletePatientRecord(1);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task GetPatientRecordByAppointmentId_ReturnsOkResult()
        {
            var recordDto = new PatientRecordDto { PatientRecordId = 1, Diagnosis = "Diagnosis 1" };
            _mockService.Setup(service => service.GetPatientRecordByAppointmentId(It.IsAny<int>())).ReturnsAsync(recordDto);

            var result = await _controller.GetPatientRecordByAppointmentId(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<PatientRecordDto>(okResult.Value);
            Assert.Equal("Diagnosis 1", returnValue.Diagnosis);
        }
    }
}
