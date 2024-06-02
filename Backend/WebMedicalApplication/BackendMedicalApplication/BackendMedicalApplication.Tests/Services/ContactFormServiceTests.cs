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

public class ContactFormServiceTests
{
    private readonly Mock<AppDbContext> _mockContext;
    private readonly ContactFormService _contactFormService;

    public ContactFormServiceTests()
    {
        _mockContext = new Mock<AppDbContext>();
        _contactFormService = new ContactFormService(_mockContext.Object);
    }

    [Fact]
    public async Task SaveContactFormSubmissionAsync_SavesSubmission()
    {
        // Arrange
        var submission = new ContactFormSubmission { Id = 1, FirstName = "John", LastName = "Doe", Email = "john@example.com", AgreeMarketing=true, AgreePrivacy=true, Comments = "Test message" };
        var mockSet = new Mock<DbSet<ContactFormSubmission>>();
        _mockContext.Setup(m => m.ContactFormSubmissions).Returns(mockSet.Object);
        _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        await _contactFormService.SaveContactFormSubmissionAsync(submission);

        // Assert
        mockSet.Verify(m => m.Add(It.IsAny<ContactFormSubmission>()), Times.Once());
        _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
    }

    [Fact]
    public async Task GetAllContactFormSubmissionsAsync_ReturnsAllSubmissions()
    {
        // Arrange
        var submissions = new List<ContactFormSubmission>
        {
            new ContactFormSubmission { Id = 1, FirstName = "John", LastName = "Doe", Email = "john@example.com", AgreeMarketing=true, AgreePrivacy=true, Comments = "Test message" },
            new ContactFormSubmission { Id = 2, FirstName = "John", LastName = "Doe", Email = "jane@example.com", AgreeMarketing=true, AgreePrivacy=true, Comments = "Another test message" }
    }.AsQueryable();

        var mockSet = new Mock<DbSet<ContactFormSubmission>>();
        mockSet.As<IQueryable<ContactFormSubmission>>().Setup(m => m.Provider).Returns(submissions.Provider);
        mockSet.As<IQueryable<ContactFormSubmission>>().Setup(m => m.Expression).Returns(submissions.Expression);
        mockSet.As<IQueryable<ContactFormSubmission>>().Setup(m => m.ElementType).Returns(submissions.ElementType);
        mockSet.As<IQueryable<ContactFormSubmission>>().Setup(m => m.GetEnumerator()).Returns(submissions.GetEnumerator());

        _mockContext.Setup(m => m.ContactFormSubmissions).Returns(mockSet.Object);

        // Act
        var result = await _contactFormService.GetAllContactFormSubmissionsAsync();

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task DeleteContactFormSubmissionAsync_DeletesSubmission_WhenSubmissionExists()
    {
        // Arrange
        var submission = new ContactFormSubmission { Id = 1, FirstName = "John", LastName = "Doe", Email = "john@example.com", AgreeMarketing = true, AgreePrivacy = true, Comments = "Test message" };
        var mockSet = new Mock<DbSet<ContactFormSubmission>>();
        mockSet.Setup(m => m.FindAsync(It.IsAny<int>())).ReturnsAsync(submission);
        _mockContext.Setup(m => m.ContactFormSubmissions).Returns(mockSet.Object);
        _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _contactFormService.DeleteContactFormSubmissionAsync(1);

        // Assert
        Assert.True(result);
        mockSet.Verify(m => m.Remove(It.IsAny<ContactFormSubmission>()), Times.Once());
        _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
    }

    [Fact]
    public async Task DeleteContactFormSubmissionAsync_ReturnsFalse_WhenSubmissionDoesNotExist()
    {
        // Arrange
        var mockSet = new Mock<DbSet<ContactFormSubmission>>();
        mockSet.Setup(m => m.FindAsync(It.IsAny<int>())).ReturnsAsync((ContactFormSubmission)null);
        _mockContext.Setup(m => m.ContactFormSubmissions).Returns(mockSet.Object);

        // Act
        var result = await _contactFormService.DeleteContactFormSubmissionAsync(1);

        // Assert
        Assert.False(result);
        mockSet.Verify(m => m.Remove(It.IsAny<ContactFormSubmission>()), Times.Never());
        _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Never());
    }
}
