using BackendMedicalApplication.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebMedicalApplication.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string EmailAddress { get; set; }

        [ForeignKey("Role")]
        public int RoleId { get; set; }
        public Role Role { get; set; }

        public string Name { get; set; }
        public string Surname { get; set; }
        public string CNP { get; set; }
        public int Age { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string? ResetPasswordCode { get; set; }
        public DateTime? ResetPasswordCodeExpires { get; set; }

        public ICollection<Appointment> DoctorAppointments { get; set; }
        public ICollection<Appointment> PatientAppointments { get; set; }
        public ICollection<PatientRecord> MedicalRecords { get; set; }
        public ICollection<Billing> Billings { get; set; }
        public ICollection<Schedule> Schedules { get; set; }

        public User()
        {
            DoctorAppointments = new HashSet<Appointment>();
            PatientAppointments = new HashSet<Appointment>();
            MedicalRecords = new HashSet<PatientRecord>();
            Billings = new HashSet<Billing>();
            Schedules = new HashSet<Schedule>();
        }
    }
}
