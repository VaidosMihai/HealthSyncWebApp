using BackendMedicalApplication.DTo;
using System.Collections.Generic;

namespace BackendMedicalApplication.Interfaces
{
    public interface IPatientRecordService
    {
        IEnumerable<PatientRecordDto> GetAllPatientRecords();
        PatientRecordDto GetPatientRecordById(int recordId);
        PatientRecordDto CreatePatientRecord(PatientRecordDto patientRecordDto);
        PatientRecordDto UpdatePatientRecord(int recordId, PatientRecordDto patientRecordDto);
        bool DeletePatientRecord(int recordId);
        Task<PatientRecordDto> GetPatientRecordByAppointmentId(int appointmentId);
    }
}
