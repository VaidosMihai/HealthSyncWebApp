namespace BackendMedicalApplication.DTo
{
    public class UserUpdateDto
    {
        public string Username { get; set; }
        public string EmailAddress { get; set; }
        public int RoleId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string CNP { get; set; }
        public int Age { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
    }
}
