using BackendMedicalApplication.Controllers;
using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebMedicalApplication.Models;
using Xunit;

namespace BackendMedicalApplication.Tests
{
    public class ReviewControllerTests
    {
        private readonly Mock<IReviewService> _mockService;
        private readonly ReviewController _controller;

        public ReviewControllerTests()
        {
            _mockService = new Mock<IReviewService>();
            _controller = new ReviewController(_mockService.Object);
        }

        [Fact]
        public async Task AddReview_ReturnsOkResult()
        {
            var review = new Review { ReviewId = 1, Rating = 5 };
            _mockService.Setup(service => service.AddReview(It.IsAny<Review>())).ReturnsAsync(review);

            var result = await _controller.AddReview(review);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<Review>(okResult.Value);
            Assert.Equal(1, returnValue.ReviewId);
        }

        [Fact]
        public async Task GetReviewsByDoctorId_ReturnsOkResult()
        {
            var reviews = new List<Review>
            {
                new Review { ReviewId = 1, Rating = 5 }
            };
            _mockService.Setup(service => service.GetReviewsByDoctorId(It.IsAny<int>())).ReturnsAsync(reviews);

            var result = await _controller.GetReviewsByDoctorId(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<Review>>(okResult.Value);
            Assert.Single(returnValue);
        }

        [Fact]
        public async Task GetReviewsByPatientId_ReturnsOkResult()
        {
            var reviews = new List<Review>
            {
                new Review { ReviewId = 1, Rating = 5 }
            };
            _mockService.Setup(service => service.GetReviewsByPatientId(It.IsAny<int>())).ReturnsAsync(reviews);

            var result = await _controller.GetReviewsByPatientId(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<Review>>(okResult.Value);
            Assert.Single(returnValue);
        }

        [Fact]
        public async Task GetReviewById_ReturnsOkResult()
        {
            var review = new Review { ReviewId = 1, Rating = 5 };
            _mockService.Setup(service => service.GetReviewById(It.IsAny<int>())).ReturnsAsync(review);

            var result = await _controller.GetReviewById(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<Review>(okResult.Value);
            Assert.Equal(1, returnValue.ReviewId);
        }

        [Fact]
        public async Task AddReviewByDoctorId_ReturnsOkResult()
        {
            var reviewDto = new ReviewDto { PatientId = 1, Rating = 5, Comment = "Great doctor!" };
            var review = new Review { ReviewId = 1, DoctorId = 1, PatientId = 1, Rating = 5, Comment = "Great doctor!" };
            _mockService.Setup(service => service.AddReview(It.IsAny<Review>())).ReturnsAsync(review);

            var result = await _controller.AddReviewByDoctorId(1, reviewDto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<Review>(okResult.Value);
            Assert.Equal(1, returnValue.ReviewId);
        }

        [Fact]
        public async Task MarkReviewHelpful_ReturnsOkResult()
        {
            _mockService.Setup(service => service.IncrementHelpfulCount(It.IsAny<int>(), It.IsAny<int>())).ReturnsAsync(true);

            var result = await _controller.MarkReviewHelpful(1, 1);

            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task MarkReviewNotHelpful_ReturnsOkResult()
        {
            _mockService.Setup(service => service.IncrementNotHelpfulCount(It.IsAny<int>(), It.IsAny<int>())).ReturnsAsync(true);

            var result = await _controller.MarkReviewNotHelpful(1, 1);

            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task DeleteReview_ReturnsOkResult()
        {
            _mockService.Setup(service => service.DeleteReview(It.IsAny<int>())).ReturnsAsync(true);

            var result = await _controller.DeleteReview(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<string>(okResult.Value);
            Assert.Equal("Review deleted successfully", returnValue);
        }
    }
}
