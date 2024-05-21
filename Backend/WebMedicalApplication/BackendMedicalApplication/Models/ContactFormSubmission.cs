namespace BackendMedicalApplication.Models
{
    public class ContactFormSubmission
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public DateTime Dob { get; set; }
        public string Comments { get; set; }
        public bool AgreeTerms { get; set; }
        public bool AgreePrivacy { get; set; }
        public bool AgreeMarketing { get; set; }
        public DateTime SubmissionDate { get; set; }
    }
}
