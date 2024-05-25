namespace BackendMedicalApplication.DTo
{
    public class UserRegistrationDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string CNP { get; set; }
        public int Age { get; set; }
        public int RoleId { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string? Description { get; set; }
    }
}
