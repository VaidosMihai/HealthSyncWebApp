using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebMedicalApplication.Models
{
    public class Appointment
    {
        [Key]
        public int AppointmentId { get; set; }
        public DateTime AppointmentDate { get; set; }
        [ForeignKey("Doctor")]
        public int DoctorId { get; set; }
        public User Doctor { get; set; }
        [ForeignKey("Patient")]
        public int PatientId { get; set; }
        public User Patient { get; set; }
        public string Reason { get; set; }
        public int? PatientRecordId { get; set; }
        public PatientRecord? PatientRecord { get; set; }
    }
}
