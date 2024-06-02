using BackendMedicalApplication.DTo;
using System.Threading.Tasks;

namespace BackendMedicalApplication.Interfaces
{
    public interface IReportService
    {
        Task<UserDto> GetPatientWithMostAppointmentsAsync();
        Task<UserDto> GetDoctorWithMostReviewsAsync();
        Task<UserDto> GetOldestPatientAsync();
        Task<UserDto> GetYoungestPatientAsync();
        Task<UserDto> GetOldestDoctorAsync();
        Task<UserDto> GetYoungestDoctorAsync();
    }
}
