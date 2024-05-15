namespace BackendMedicalApplication.DTo
{
    public class ReviewDto
    {
        public int ReviewId { get; set; }
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public int HelpfulCount { get; set; } 
        public int NotHelpfulCount { get; set; }
    }
}
