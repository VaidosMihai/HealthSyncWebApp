namespace BackendMedicalApplication.DTo
{
    public class ResetPasswordSMSDto
    {
        public string PhoneNumber { get; set; }
        public string Code { get; set; }
        public string NewPassword { get; set; }
    }
}
