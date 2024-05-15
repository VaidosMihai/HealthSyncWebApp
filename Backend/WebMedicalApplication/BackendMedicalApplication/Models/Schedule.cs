using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebMedicalApplication.Models;

namespace BackendMedicalApplication.Models
{
    public class Schedule
    {
        [Key]
        public int ScheduleId { get; set; }
        [ForeignKey("Doctor")]
        public int DoctorId { get; set; }
        public User Doctor { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }

}
