using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackendMedicalApplication.Interfaces
{
    public interface IReportService
    {
        Task<IEnumerable<object>> GetPatientsWithMostAppointments();
        Task<object> GetOldestPatient();
        Task<object> GetYoungestPatient();
        Task<IEnumerable<object>> GetDoctorsWithMostReviews();
        Task<IEnumerable<object>> GetPatientsWithMostReviews();
        Task<IEnumerable<object>> GetPatientsWithMostMedicalRecords();
        Task<IEnumerable<object>> GetDoctorsWithMostAppointments();
    }
}
