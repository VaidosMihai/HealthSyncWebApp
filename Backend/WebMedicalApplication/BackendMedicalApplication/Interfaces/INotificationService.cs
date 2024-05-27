using BackendMedicalApplication.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackendMedicalApplication.Interfaces
{
    public interface INotificationService
    {
        Task CreateNotification(int userId, string message);
        Task<List<Notification>> GetNotificationsByUserId(int userId);
        Task<int> GetUnreadNotificationsCount(int userId);
        Task MarkAsRead(int notificationId);
        Task MarkAllAsRead(int userId);
    }
}
