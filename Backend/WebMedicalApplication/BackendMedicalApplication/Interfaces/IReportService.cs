using BackendMedicalApplication.DTo;
using System.Threading.Tasks;

namespace BackendMedicalApplication.Interfaces
{
    public interface IReportService
    {
        Task<UserDto> GetOldestPatientAsync();
        Task<UserDto> GetYoungestPatientAsync();
        Task<UserDto> GetPatientWithMostAppointmentsAsync();
        Task<UserDto> GetDoctorWithMostReviewsAsync();
    }
}
