using System.ComponentModel.DataAnnotations;

namespace BackendMedicalApplication.Models
{
    public class ReviewVote
    {
        [Key]
        public int VoteId { get; set; }
        public int ReviewId { get; set; }
        public int UserId { get; set; }
        public string VoteType { get; set; }  // "helpful" or "not-helpful"
    }
}
