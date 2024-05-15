using BackendMedicalApplication;
using BackendMedicalApplication.DTo;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using WebMedicalApplication.Models;

namespace YourNamespace.Repositories
{
    public interface IReviewRepository
    {
        Task<ReviewDto> AddReview(ReviewDto reviewDto);
    }

    public class ReviewRepository : IReviewRepository
    {
        private readonly AppDbContext _context;

        public ReviewRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ReviewDto> AddReview(ReviewDto reviewDto)
        {
            var reviewEntity = new Review
            {
                DoctorId = reviewDto.DoctorId,
                PatientId = reviewDto.PatientId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                CreatedAt = reviewDto.CreatedAt
            };

            _context.Reviews.Add(reviewEntity);
            await _context.SaveChangesAsync();

            reviewDto.ReviewId = reviewEntity.ReviewId;
            return reviewDto;
        }
    }
}