using BackendMedicalApplication.DTo;
using WebMedicalApplication.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackendMedicalApplication.Interfaces
{
    public interface IAppointmentService
    {
        IEnumerable<AppointmentDto> GetAllAppointments();
        AppointmentDto GetAppointmentById(int appointmentId);
        Task<AppointmentDto> CreateAppointment(AppointmentDto appointmentDto);
        Task<AppointmentDto> UpdateAppointment(int appointmentId, AppointmentDto appointmentDto);
        Task<bool> DeleteAppointment(int appointmentId);
        Task<List<AppointmentDto>> GetByDoctorId(int doctorId);
        Task<List<AppointmentDto>> GetAppointmentsByPatientId(int patientId);
        Task<AppointmentDto> AddPatientRecordToAppointment(int appointmentId, PatientRecordDto patientRecordDto);
    }
}
