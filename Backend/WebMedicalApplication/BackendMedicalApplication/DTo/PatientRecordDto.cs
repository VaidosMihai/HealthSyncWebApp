using BackendMedicalApplication.Models;

namespace BackendMedicalApplication.DTo
{
    public class PatientRecordDto
    {
        public int PatientRecordId { get; set; }
        public int AppointmentId { get; set; }
        public DateTime DateRecorded { get; set; }
        public string Diagnosis { get; set; }
        public string Notes { get; set; }
    }

}
