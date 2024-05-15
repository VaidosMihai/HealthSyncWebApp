using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebMedicalApplication.Models;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpPost]
    public async Task<ActionResult<Review>> AddReview(Review review)
    {
        review.ReviewId = 0;
        var createdReview = await _reviewService.AddReview(review);
        return Ok(createdReview);
    }

    [HttpGet("doctor/{doctorId}")]
    public async Task<ActionResult<List<Review>>> GetReviewsByDoctorId(int doctorId)
    {
        var reviews = await _reviewService.GetReviewsByDoctorId(doctorId);
        return Ok(reviews);
    }

    [HttpGet("patient/{patientId}")]
    public async Task<ActionResult<List<Review>>> GetReviewsByPatientId(int patientId)
    {
        var reviews = await _reviewService.GetReviewsByPatientId(patientId);
        return Ok(reviews);
    }

    [HttpGet("{reviewId}")]
    public async Task<ActionResult<Review>> GetReviewById(int reviewId)
    {
        var review = await _reviewService.GetReviewById(reviewId);
        if (review == null)
        {
            return NotFound();
        }
        return Ok(review);
    }

    [HttpPost("{doctorId}")]
    public async Task<IActionResult> AddReviewByDoctorId(int doctorId, [FromBody] ReviewDto reviewDto)
    {
        if (reviewDto == null || reviewDto.PatientId == 0 || reviewDto.Rating < 1 || reviewDto.Rating > 5)
        {
            return BadRequest("Invalid review data.");
        }

        var review = new Review
        {
            DoctorId = doctorId,
            PatientId = reviewDto.PatientId,
            Rating = reviewDto.Rating,
            Comment = reviewDto.Comment,
            CreatedAt = DateTime.Now,
            HelpfulCount = 0,
            NotHelpfulCount = 0,
        };

        var createdReview = await _reviewService.AddReview(review);

        if (createdReview != null)
        {
            return Ok(createdReview);
        }
        return StatusCode(500, "An error occurred while creating the review.");
    }


    [HttpPut("{reviewId}/helpful")]
    public async Task<IActionResult> MarkReviewHelpful(int reviewId, [FromQuery] int userId)
    {
        var success = await _reviewService.IncrementHelpfulCount(reviewId, userId);
        if (success)
        {
            return Ok();
        }
        return BadRequest("User has already marked this review as helpful or changed from not helpful to helpful.");
    }

    [HttpPut("{reviewId}/not-helpful")]
    public async Task<IActionResult> MarkReviewNotHelpful(int reviewId, [FromQuery] int userId)
    {
        var success = await _reviewService.IncrementNotHelpfulCount(reviewId, userId);
        if (success)
        {
            return Ok();
        }
        return BadRequest("User has already marked this review as not helpful or changed from helpful to not helpful.");
    }

    [HttpDelete("{reviewId}")] 
    public async Task<IActionResult> DeleteReview(int reviewId)
    {
        var success = await _reviewService.DeleteReview(reviewId);
        if (!success)
        {
            return NotFound("Review not found");
        }
        return Ok("Review deleted successfully");
    }
}
