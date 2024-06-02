using BackendMedicalApplication;
using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using BackendMedicalApplication.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using WebMedicalApplication.Models;
using Xunit;

public class ReviewServiceTests
{
    private readonly Mock<AppDbContext> _mockContext;
    private readonly ReviewService _reviewService;

    public ReviewServiceTests()
    {
        _mockContext = new Mock<AppDbContext>();
        _reviewService = new ReviewService(_mockContext.Object);
    }

    [Fact]
    public async Task AddReview_AddsReview()
    {
        // Arrange
        var review = new Review { ReviewId = 1, DoctorId = 1, PatientId = 1, Comment = "Great doctor!" };
        var mockSet = new Mock<System.Data.Entity.DbSet<Review>>();
        _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _reviewService.AddReview(review);

        // Assert
        mockSet.Verify(m => m.Add(It.IsAny<Review>()), Times.Once());
        _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        Assert.Equal(1, result.ReviewId);
    }

    [Fact]
    public async Task GetReviewsByDoctorId_ReturnsReviews()
    {
        // Arrange
        var reviews = new List<Review>
        {
            new Review { ReviewId = 1, DoctorId = 1, Comment = "Great doctor!" },
            new Review { ReviewId = 2, DoctorId = 1, Comment = "Very professional." }
        }.AsQueryable();

        var mockSet = new Mock<System.Data.Entity.DbSet<Review>>();
        mockSet.As<IQueryable<Review>>().Setup(m => m.Provider).Returns(reviews.Provider);
        mockSet.As<IQueryable<Review>>().Setup(m => m.Expression).Returns(reviews.Expression);
        mockSet.As<IQueryable<Review>>().Setup(m => m.ElementType).Returns(reviews.ElementType);
        mockSet.As<IQueryable<Review>>().Setup(m => m.GetEnumerator()).Returns(reviews.GetEnumerator());


        // Act
        var result = await _reviewService.GetReviewsByDoctorId(1);

        // Assert
        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task GetReviewsByPatientId_ReturnsReviews()
    {
        // Arrange
        var reviews = new List<Review>
        {
            new Review { ReviewId = 1, PatientId = 1, Comment = "Great doctor!" },
            new Review { ReviewId = 2, PatientId = 1, Comment = "Very professional." }
        }.AsQueryable();

        var mockSet = new Mock<System.Data.Entity.DbSet<Review>>();
        mockSet.As<IQueryable<Review>>().Setup(m => m.Provider).Returns(reviews.Provider);
        mockSet.As<IQueryable<Review>>().Setup(m => m.Expression).Returns(reviews.Expression);
        mockSet.As<IQueryable<Review>>().Setup(m => m.ElementType).Returns(reviews.ElementType);
        mockSet.As<IQueryable<Review>>().Setup(m => m.GetEnumerator()).Returns(reviews.GetEnumerator());


        // Act
        var result = await _reviewService.GetReviewsByPatientId(1);

        // Assert
        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task GetReviewById_ReturnsReview()
    {
        // Arrange
        var review = new Review { ReviewId = 1, DoctorId = 1, PatientId = 1, Comment = "Great doctor!" };
        _mockContext.Setup(c => c.Reviews.FindAsync(It.IsAny<int>())).ReturnsAsync(review);

        // Act
        var result = await _reviewService.GetReviewById(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Great doctor!", result.Comment);
    }

    [Fact]
    public async Task IncrementHelpfulCount_IncrementsCount()
    {
        // Arrange
        var review = new Review { ReviewId = 1, HelpfulCount = 0 };
        var reviewVote = new ReviewVote { ReviewId = 1, UserId = 1, VoteType = "helpful" };

        var mockSetReview = new Mock<System.Data.Entity.DbSet<Review>>();
        var mockSetReviewVote = new Mock<System.Data.Entity.DbSet<ReviewVote>>();

        mockSetReview.Setup(m => m.FindAsync(It.IsAny<int>())).ReturnsAsync(review);
        _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _reviewService.IncrementHelpfulCount(1, 1);

        // Assert
        Assert.True(result);
        Assert.Equal(1, review.HelpfulCount);
        mockSetReviewVote.Verify(m => m.Add(It.IsAny<ReviewVote>()), Times.Once());
        _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
    }

    [Fact]
    public async Task IncrementNotHelpfulCount_IncrementsCount()
    {
        // Arrange
        var review = new Review { ReviewId = 1, NotHelpfulCount = 0 };
        var reviewVote = new ReviewVote { ReviewId = 1, UserId = 1, VoteType = "not-helpful" };

        var mockSetReview = new Mock<System.Data.Entity.DbSet<Review>>();
        var mockSetReviewVote = new Mock<System.Data.Entity.DbSet<ReviewVote>>();

        mockSetReview.Setup(m => m.FindAsync(It.IsAny<int>())).ReturnsAsync(review);

        _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _reviewService.IncrementNotHelpfulCount(1, 1);

        // Assert
        Assert.True(result);
        Assert.Equal(1, review.NotHelpfulCount);
        mockSetReviewVote.Verify(m => m.Add(It.IsAny<ReviewVote>()), Times.Once());
        _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
    }

    [Fact]
    public async Task UpdateReview_UpdatesReview()
    {
        // Arrange
        var review = new Review { ReviewId = 1, Comment = "Great doctor!" };
        var mockSet = new Mock<System.Data.Entity.DbSet<Review>>();
        mockSet.Setup(m => m.FindAsync(It.IsAny<int>())).ReturnsAsync(review);
        _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        review.Comment = "Updated review content";
        await _reviewService.UpdateReview(review);

        // Assert
        Assert.Equal("Updated review content", review.Comment);
        _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
    }

    [Fact]
    public async Task DeleteReview_DeletesReview()
    {
        // Arrange
        var review = new Review { ReviewId = 1, Comment = "Great doctor!" };
        var mockSet = new Mock<System.Data.Entity.DbSet<Review>>();
        mockSet.Setup(m => m.FindAsync(It.IsAny<int>())).ReturnsAsync(review);
        _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _reviewService.DeleteReview(1);

        // Assert
        Assert.True(result);
        mockSet.Verify(m => m.Remove(It.IsAny<Review>()), Times.Once());
        _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
    }
}
