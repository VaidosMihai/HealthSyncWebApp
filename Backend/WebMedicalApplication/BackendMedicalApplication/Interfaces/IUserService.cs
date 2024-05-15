using BackendMedicalApplication.DTo;
using WebMedicalApplication.Models;

namespace BackendMedicalApplication.Interfaces
{
    public interface IUserService
    {
        IEnumerable<UserDto> GetAllUsers();
        Task<UserDto> GetUserByIdAsync(int userId);
        UserDto CreateUser(UserDto userDto);
        UserDto UpdateUser(int userId, UserDto userDto);
        bool DeleteUser(int userId);
        Task<UserDto> AuthenticateUser(UserLoginDto userLoginDto);
        Task<UserDto> GetUserByEmailAsync(string email);
        Task<UserDto> CreateUserAsync(UserRegistrationDto userRegistrationDto);
        UserDto UpdateUserRole(int userId, int newRoleId);
        Task<UserDto> GetUserByUsernameAsync(string username);
        Task<User> GeneratePasswordResetCode(string phoneNumber);
        Task<User> ResetPasswordWithCode(string phoneNumber, string code, string newPassword);
        IEnumerable<UserDto> GetUsersByRole(int roleId);
    }
}
