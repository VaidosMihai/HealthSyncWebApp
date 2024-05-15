namespace BackendMedicalApplication.DTo
{
    public class AppointmentDto
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime DateTime { get; set; }
        public string Reason { get; set; }
        public int? PatientRecordId { get; set; }
        public PatientRecordDto? PatientRecord { get; set; }
    }

}
