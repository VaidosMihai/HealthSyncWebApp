using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Microsoft.Extensions.Configuration;
using WebMedicalApplication.Models;
using System;

namespace BackendMedicalApplication.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public UserService(AppDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        public IEnumerable<UserDto> GetAllUsers()
        {
            return _context.Users
                           .Select(u => new UserDto
                           {
                               UserId = u.UserId,
                               Username = u.Username,
                               EmailAddress = u.EmailAddress,
                               RoleId = u.RoleId,
                               Name = u.Name,
                               Surname = u.Surname,
                               Age = u.Age,
                               CNP = u.CNP,
                               PhoneNumber = u.PhoneNumber,
                               Address = u.Address
                           })
                           .ToList();
        }

        public async Task<UserDto> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                throw new InvalidOperationException($"No user found with ID {userId}");
            }

            return new UserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                EmailAddress = user.EmailAddress,
                RoleId = user.RoleId,
                Name = user.Name,
                Surname = user.Surname,
                Age = user.Age,
                CNP = user.CNP ?? "Not Provided", // Handle nullable string by providing a default
                Password = user.Password,
                Address = user.Address,
                PhoneNumber = user.PhoneNumber,
                ResetPasswordCode = user.ResetPasswordCode ?? "Not Set", // Default for nullable string
                ResetPasswordCodeExpires = user.ResetPasswordCodeExpires // Format DateTime or provide a default
            };
        }

        public UserDto CreateUser(UserDto userDto)
        {
            var newUser = new User
            {
                Username = userDto.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
                EmailAddress = userDto.EmailAddress,
                RoleId = userDto.RoleId,
                Name = userDto.Name,
                Surname = userDto.Surname,
                CNP = userDto.CNP,
                Age = userDto.Age,
                Address = userDto.Address,
                PhoneNumber = userDto.PhoneNumber
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            userDto.UserId = newUser.UserId; // Get the ID of the newly created user
            userDto.Password = null; // Remove password from DTO after creation for security
            return userDto;
        }

        public UserDto UpdateUser(int userId, UserDto userDto)
        {
            var user = _context.Users.Find(userId);
            if (user == null)
                return null;

            user.Username = userDto.Username;
            user.EmailAddress = userDto.EmailAddress;
            // Do not update the password here. It should be handled separately with proper current password verification.
            user.RoleId = userDto.RoleId;
            user.Name = userDto.Name;
            user.Surname = userDto.Surname;
            user.CNP = userDto.CNP;
            user.Age = userDto.Age;
            user.Address = userDto.Address;
            user.PhoneNumber = userDto.PhoneNumber;

            _context.SaveChanges();
            userDto.Password = null; // Remove password from DTO after update for security
            return userDto;
        }

        public bool DeleteUser(int userId)
        {
            var user = _context.Users.Find(userId);
            if (user == null) return false;

            _context.Users.Remove(user);
            _context.SaveChanges();
            return true;
        }

        public async Task<UserDto> AuthenticateUser(UserLoginDto userLoginDto)
        {
            var user = await _context.Users
                                     .Where(u => u.EmailAddress == userLoginDto.Email)
                                     .Select(u => new
                                     {
                                         u.Username,
                                         u.EmailAddress,
                                         PasswordHash = u.Password  // Assuming 'Password' is the hashed password field
                                     })
                                     .SingleOrDefaultAsync();

            if (user == null)
            {
                // Log the error or handle it appropriately
                return null;
            }

            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                // Handle the case where the password hash is null or empty
                return null;
            }

            if (BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.PasswordHash))
            {
                return new UserDto
                {
                    Username = user.Username,
                    EmailAddress = user.EmailAddress,
                };
            }

            return null;
        }

        public async Task<UserDto> GetUserByEmailAsync(string email)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.EmailAddress == email);
            if (user == null)
                return null;

            return new UserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                EmailAddress = user.EmailAddress,
                RoleId = user.RoleId,
                Name = user.Name,
                Surname = user.Surname,
                Age = user.Age,
                CNP = user.CNP,
                Password = user.Password,
                Address = user.Address,
                PhoneNumber = user.PhoneNumber
                // Add other properties as needed but exclude the password for security reasons
            };
        }

        public async Task<UserDto> CreateUserAsync(UserRegistrationDto userRegistrationDto)
        {
            // Check if a user with the same email already exists
            var existingUser = await _context.Users
                                             .AnyAsync(u => u.EmailAddress == userRegistrationDto.Email);
            if (existingUser)
                throw new System.Exception("User with the given email already exists.");

            // Check if the provided RoleId exists in the Roles table
            var roleExists = await _context.Roles.AnyAsync(r => r.RoleId == userRegistrationDto.RoleId);
            if (!roleExists)
            {
                throw new System.Exception("The specified Role ID does not exist.");
            }

            // Create a new user with the valid RoleId
            var newUser = new User
            {
                Username = userRegistrationDto.Username,
                EmailAddress = userRegistrationDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(userRegistrationDto.Password),
                Name = userRegistrationDto.Name,
                Surname = userRegistrationDto.Surname,
                CNP = userRegistrationDto.CNP,
                Age = userRegistrationDto.Age,
                RoleId = userRegistrationDto.RoleId,
                PhoneNumber = userRegistrationDto.PhoneNumber,
                Address = userRegistrationDto.Address
                // Map other fields from userRegistrationDto to newUser as needed
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = newUser.Username,
                Name = newUser.Name,
                Surname = newUser.Surname,
                EmailAddress = newUser.EmailAddress,
                CNP = newUser.CNP,
                Age = newUser.Age,
                RoleId = newUser.RoleId,
                // Optionally map other fields as needed, excluding sensitive data like passwords
            };
        }

        public UserDto UpdateUserRole(int userId, int newRoleId)
        {
            var user = _context.Users.Find(userId);
            if (user == null)
            {
                return null; // User not found
            }

            user.RoleId = newRoleId;

            _context.SaveChanges();

            return new UserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                EmailAddress = user.EmailAddress,
                RoleId = user.RoleId,
                Name = user.Name,
                Surname = user.Surname,
                Age = user.Age,
                CNP = user.CNP,
                Password = user.Password,
            };
        }

        public async Task<UserDto> GetUserByUsernameAsync(string username)
        {
            var user = await _context.Users
                .Where(u => u.Username.Equals(username))
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Username = u.Username,
                    EmailAddress = u.EmailAddress,
                    RoleId = u.RoleId,
                    Name = u.Name,
                    Age = u.Age,
                    CNP = u.CNP,
                    Surname = u.Surname,
                    Address = u.Address,
                    // Include other properties that you need, except sensitive ones like Password
                })
                .FirstOrDefaultAsync();

            return user;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var user = await _context.Users
                                     .Where(u => u.EmailAddress == email)
                                     .FirstOrDefaultAsync();

            if (user == null)
            {
                return null;
            }

            return user;
        }

        public async Task<User> GeneratePasswordResetCode(string email)
        {
            var user = await GetUserByEmail(email);
            if (user == null)
            {
                return null;
            }

            // Generate a 6-digit code
            user.ResetPasswordCode = new Random().Next(100000, 999999).ToString();
            user.ResetPasswordCodeExpires = DateTime.UtcNow.AddMinutes(15); // Code expires in 15 minutes
            await _context.SaveChangesAsync();

            string emailSubject = "Your Password Reset Code";
            string emailBody = $"Your password reset code is: {user.ResetPasswordCode}. You have 15 minutes to use this code before it expires.";
            await _emailService.SendEmailAsync(user.EmailAddress, emailSubject, emailBody, true);
            return user;
        }


        public async Task<User> ResetPasswordWithCode(string email, string code, string newPassword)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.EmailAddress == email && u.ResetPasswordCode == code
                                                                      && u.ResetPasswordCodeExpires > DateTime.UtcNow);
            if (user == null) return null;

            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.ResetPasswordCode = null;
            user.ResetPasswordCodeExpires = null;
            await _context.SaveChangesAsync();

            return user;
        }

        public IEnumerable<UserDto> GetUsersByRole(int roleId)
        {
            return _context.Users
                           .Where(u => u.RoleId == roleId)
                           .Select(u => new UserDto
                           {
                               UserId = u.UserId,
                               Username = u.Username,
                               EmailAddress = u.EmailAddress,
                               RoleId = u.RoleId,
                               Name = u.Name,
                               Surname = u.Surname,
                               Age = u.Age,
                               CNP = u.CNP,
                               PhoneNumber = u.PhoneNumber,
                               Address = u.Address
                           })
                           .ToList();
        }
    }
}
