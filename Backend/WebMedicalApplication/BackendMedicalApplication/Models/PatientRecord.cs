using BackendMedicalApplication.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebMedicalApplication.Models
{
    public class PatientRecord
    {
        [Key]
        public int PatientRecordId { get; set; }
        [ForeignKey("Patient")]
        public int PatientId { get; set; }
        public User Patient { get; set; }
        public DateTime RecordDate { get; set; }
        public string Diagnosis { get; set; }
        public string Notes { get; set; }
        public Appointment Appointment { get; set; }
    }
}
