using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebMedicalApplication.Models;

namespace BackendMedicalApplication.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;

        public ReviewService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Review> AddReview(Review review)
        {
            review.ReviewId = 0;
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return review;
        }

        public async Task<List<Review>> GetReviewsByDoctorId(int doctorId)
        {
            return await _context.Reviews
                .Where(r => r.DoctorId == doctorId)
                .ToListAsync();
        }

        public async Task<List<Review>> GetReviewsByPatientId(int patientId)
        {
            return await _context.Reviews
                .Where(r => r.PatientId == patientId)
                .ToListAsync();
        }

        public async Task<Review> GetReviewById(int reviewId)
        {
            return await _context.Reviews.FindAsync(reviewId);
        }

        public async Task<bool> IncrementHelpfulCount(int reviewId, int userId)
        {
            var existingVote = await _context.ReviewVotes
                .FirstOrDefaultAsync(rv => rv.ReviewId == reviewId && rv.UserId == userId);

            if (existingVote != null && existingVote.VoteType == "helpful")
            {
                // User has already voted helpful
                return false;
            }

            if (existingVote != null)
            {
                // User changes vote from not helpful to helpful
                _context.ReviewVotes.Remove(existingVote);
                var review = await _context.Reviews.FindAsync(reviewId);
                review.NotHelpfulCount = Math.Max(0, review.NotHelpfulCount - 1);
            }

            var newVote = new ReviewVote
            {
                ReviewId = reviewId,
                UserId = userId,
                VoteType = "helpful"
            };

            _context.ReviewVotes.Add(newVote);

            var reviewToUpdate = await _context.Reviews.FindAsync(reviewId);
            if (reviewToUpdate != null)
            {
                reviewToUpdate.HelpfulCount++;
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> IncrementNotHelpfulCount(int reviewId, int userId)
        {
            var existingVote = await _context.ReviewVotes
                .FirstOrDefaultAsync(rv => rv.ReviewId == reviewId && rv.UserId == userId);

            if (existingVote != null && existingVote.VoteType == "not-helpful")
            {
                // User has already voted not helpful
                return false;
            }

            if (existingVote != null)
            {
                // User changes vote from helpful to not helpful
                _context.ReviewVotes.Remove(existingVote);
                var review = await _context.Reviews.FindAsync(reviewId);
                review.HelpfulCount = Math.Max(0, review.HelpfulCount - 1);
            }

            var newVote = new ReviewVote
            {
                ReviewId = reviewId,
                UserId = userId,
                VoteType = "not-helpful"
            };

            _context.ReviewVotes.Add(newVote);

            var reviewToUpdate = await _context.Reviews.FindAsync(reviewId);
            if (reviewToUpdate != null)
            {
                reviewToUpdate.NotHelpfulCount++;
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task UpdateReview(Review review)
        {
            _context.Entry(review).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
        public async Task<bool> DeleteReview(int reviewId) 
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null) return false;

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
