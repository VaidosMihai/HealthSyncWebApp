using System.ComponentModel.DataAnnotations;

namespace WebMedicalApplication.Models
{
    public class Review
    {
        [Key]
        public int ReviewId { get; set; }
        [Required]
        public int DoctorId { get; set; }
        [Required]
        public int PatientId { get; set; }
        [Range(1, 5)]
        public int Rating { get; set; }
        [Required]
        [MaxLength(250)]
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public int HelpfulCount { get; set; } = 0;
        public int NotHelpfulCount { get; set; } = 0;
    }
}
