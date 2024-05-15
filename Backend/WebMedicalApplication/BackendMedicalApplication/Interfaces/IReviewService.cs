using WebMedicalApplication.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackendMedicalApplication.Interfaces
{
    public interface IReviewService
    {
        Task<Review> AddReview(Review review);
        //Task<Review> AddReview(int doctorId, Review reviewDto);
        Task<List<Review>> GetReviewsByDoctorId(int doctorId);
        Task<List<Review>> GetReviewsByPatientId(int patientId);
        Task<Review> GetReviewById(int reviewId);
        Task<bool> IncrementHelpfulCount(int reviewId, int userId);
        Task<bool> IncrementNotHelpfulCount(int reviewId, int userId);
        Task<bool> DeleteReview(int reviewId);
    }
}
