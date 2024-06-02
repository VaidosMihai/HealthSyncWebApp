using BackendMedicalApplication;
using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using BackendMedicalApplication.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using WebMedicalApplication.Models;
using Xunit;

public class PatientRecordServiceTests
{
    private readonly Mock<DbSet<PatientRecord>> _mockSet;
    private readonly Mock<AppDbContext> _mockContext;
    private readonly PatientRecordService _service;

    public PatientRecordServiceTests()
    {
        _mockSet = new Mock<DbSet<PatientRecord>>();
        _mockContext = new Mock<AppDbContext>();
        _service = new PatientRecordService(_mockContext.Object);
    }

    private Expression<Func<PatientRecord, bool>> GetExpressionForAppointmentId(int appointmentId)
    {
        return pr => pr.Appointment.AppointmentId == appointmentId;
    }


    [Fact]
    public void GetAllPatientRecords_ReturnsAllRecords()
    {
        var records = new List<PatientRecord>
        {
            new PatientRecord { PatientRecordId = 1, RecordDate = DateTime.Now, Diagnosis = "Diagnosis 1", Notes = "Notes 1" },
            new PatientRecord { PatientRecordId = 2, RecordDate = DateTime.Now, Diagnosis = "Diagnosis 2", Notes = "Notes 2" }
        }.AsQueryable();

        _mockSet.As<IQueryable<PatientRecord>>().Setup(m => m.Provider).Returns(records.Provider);
        _mockSet.As<IQueryable<PatientRecord>>().Setup(m => m.Expression).Returns(records.Expression);
        _mockSet.As<IQueryable<PatientRecord>>().Setup(m => m.ElementType).Returns(records.ElementType);
        _mockSet.As<IQueryable<PatientRecord>>().Setup(m => m.GetEnumerator()).Returns(records.GetEnumerator());

        _mockContext.Setup(c => c.PatientRecords).Returns(_mockSet.Object);

        var result = _service.GetAllPatientRecords();

        Assert.Equal(2, result.Count());
        Assert.Equal("Diagnosis 1", result.First().Diagnosis);
    }

    [Fact]
    public void GetPatientRecordById_ReturnsRecord_WhenRecordExists()
    {
        var record = new PatientRecord { PatientRecordId = 1, RecordDate = DateTime.Now, Diagnosis = "Diagnosis 1", Notes = "Notes 1" };
        _mockContext.Setup(c => c.PatientRecords.Find(It.IsAny<int>())).Returns(record);

        var result = _service.GetPatientRecordById(1);

        Assert.NotNull(result);
        Assert.Equal("Diagnosis 1", result.Diagnosis);
    }

    [Fact]
    public void GetPatientRecordById_ReturnsNull_WhenRecordDoesNotExist()
    {
        _mockContext.Setup(c => c.PatientRecords.Find(It.IsAny<int>())).Returns((PatientRecord)null);

        var result = _service.GetPatientRecordById(1);

        Assert.Null(result);
    }

    [Fact]
    public void CreatePatientRecord_AddsRecord()
    {
        var appointment = new Appointment { AppointmentId = 1 };
        var patientRecordDto = new PatientRecordDto
        {
            PatientRecordId = 1,
            AppointmentId = 1,
            DateRecorded = DateTime.Now,
            Diagnosis = "Diagnosis 1",
            Notes = "Notes 1"
        };

        _mockContext.Setup(c => c.PatientRecords).Returns(_mockSet.Object);
        _mockContext.Setup(c => c.Appointments.Find(It.IsAny<int>())).Returns(appointment);
        _mockContext.Setup(m => m.SaveChanges()).Returns(1);

        var result = _service.CreatePatientRecord(patientRecordDto);

        _mockSet.Verify(m => m.Add(It.IsAny<PatientRecord>()), Times.Once());
        _mockContext.Verify(m => m.SaveChanges(), Times.Once());
        Assert.NotNull(result);
    }

    [Fact]
    public void UpdatePatientRecord_UpdatesRecord()
    {
        var record = new PatientRecord { PatientRecordId = 1, RecordDate = DateTime.Now, Diagnosis = "Diagnosis 1", Notes = "Notes 1" };
        var patientRecordDto = new PatientRecordDto
        {
            PatientRecordId = 1,
            DateRecorded = DateTime.Now,
            Diagnosis = "Updated Diagnosis",
            Notes = "Updated Notes"
        };

        _mockSet.Setup(m => m.Include(It.IsAny<string>())).Returns(_mockSet.Object);
        _mockSet.Setup(m => m.FirstOrDefault(It.IsAny<System.Linq.Expressions.Expression<Func<PatientRecord, bool>>>())).Returns(record);
        _mockContext.Setup(c => c.PatientRecords).Returns(_mockSet.Object);
        _mockContext.Setup(m => m.SaveChanges()).Returns(1);

        var result = _service.UpdatePatientRecord(1, patientRecordDto);

        _mockContext.Verify(m => m.SaveChanges(), Times.Once());
        Assert.Equal("Updated Diagnosis", record.Diagnosis);
        Assert.Equal("Updated Notes", record.Notes);
    }

    [Fact]
    public void DeletePatientRecord_DeletesRecord()
    {
        var record = new PatientRecord { PatientRecordId = 1, RecordDate = DateTime.Now, Diagnosis = "Diagnosis 1", Notes = "Notes 1" };

        _mockSet.Setup(m => m.Include(It.IsAny<string>())).Returns(_mockSet.Object);
        _mockSet.Setup(m => m.FirstOrDefault(It.IsAny<System.Linq.Expressions.Expression<Func<PatientRecord, bool>>>())).Returns(record);
        _mockContext.Setup(c => c.PatientRecords).Returns(_mockSet.Object);
        _mockContext.Setup(m => m.SaveChanges()).Returns(1);

        var result = _service.DeletePatientRecord(1);

        Assert.True(result);
        _mockSet.Verify(m => m.Remove(It.IsAny<PatientRecord>()), Times.Once());
        _mockContext.Verify(m => m.SaveChanges(), Times.Once());
    }
}
