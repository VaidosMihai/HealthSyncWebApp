using BackendMedicalApplication;
using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using BackendMedicalApplication.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using WebMedicalApplication.Models;
using Xunit;

public class UserServiceTests
{
    private readonly Mock<AppDbContext> _mockContext;
    private readonly Mock<IEmailService> _mockEmailService;
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _mockContext = new Mock<AppDbContext>();
        _mockEmailService = new Mock<IEmailService>();
        _mockConfiguration = new Mock<IConfiguration>();
        _userService = new UserService(_mockContext.Object, _mockConfiguration.Object, _mockEmailService.Object);
    }

    [Fact]
    public void GetAllUsers_ReturnsAllUsers()
    {
        // Arrange
        var users = new List<User>
        {
            new User { UserId = 1, Username = "User1", EmailAddress = "user1@example.com" },
            new User { UserId = 2, Username = "User2", EmailAddress = "user2@example.com" }
        }.AsQueryable();

        var mockSet = new Mock<System.Data.Entity.DbSet<User>>();
        mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(users.Provider);
        mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(users.Expression);
        mockSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(users.ElementType);
        mockSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(users.GetEnumerator());


        // Act
        var result = _userService.GetAllUsers();

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetUserByIdAsync_ReturnsUser_WhenUserExists()
    {
        // Arrange
        var user = new User { UserId = 1, Username = "User1", EmailAddress = "user1@example.com" };

        // Act
        var result = await _userService.GetUserByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("User1", result.Username);
    }

    [Fact]
    public async Task GetUserByIdAsync_ThrowsException_WhenUserDoesNotExist()
    {

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _userService.GetUserByIdAsync(1));
    }

    [Fact]
    public void CreateUser_AddsUser()
    {
        // Arrange
        var userDto = new UserDto { Username = "User1", EmailAddress = "user1@example.com", Password = "password" };
        var mockSet = new Mock<System.Data.Entity.DbSet<User>>();
        _mockContext.Setup(m => m.SaveChanges()).Returns(1);

        // Act
        var result = _userService.CreateUser(userDto);

        // Assert
        mockSet.Verify(m => m.Add(It.IsAny<User>()), Times.Once());
        _mockContext.Verify(m => m.SaveChanges(), Times.Once());
        Assert.NotNull(result);
    }

    [Fact]
    public void UpdateUser_UpdatesUser()
    {
        // Arrange
        var user = new User { UserId = 1, Username = "User1", EmailAddress = "user1@example.com" };
        var userDto = new UserDto { Username = "UpdatedUser", EmailAddress = "updateduser@example.com" };

        _mockContext.Setup(c => c.Users.Find(It.IsAny<int>())).Returns(user);
        _mockContext.Setup(m => m.SaveChanges()).Returns(1);

        // Act
        var result = _userService.UpdateUser(1, userDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("UpdatedUser", user.Username);
        Assert.Equal("updateduser@example.com", user.EmailAddress);
    }

    [Fact]
    public void DeleteUser_DeletesUser()
    {
        // Arrange
        var user = new User { UserId = 1, Username = "User1", EmailAddress = "user1@example.com" };
        var mockSet = new Mock<System.Data.Entity.DbSet<User>>();
        mockSet.Setup(m => m.Find(It.IsAny<int>())).Returns(user);
        _mockContext.Setup(m => m.SaveChanges()).Returns(1);

        // Act
        var result = _userService.DeleteUser(1);

        // Assert
        Assert.True(result);
        mockSet.Verify(m => m.Remove(It.IsAny<User>()), Times.Once());
        _mockContext.Verify(m => m.SaveChanges(), Times.Once());
    }

    [Fact]
    public async Task AuthenticateUser_ReturnsUserDto_WhenCredentialsAreValid()
    {
        // Arrange
        var userLoginDto = new UserLoginDto { Email = "user1@example.com", Password = "password" };
        var user = new User { Username = "User1", EmailAddress = "user1@example.com", Password = BCrypt.Net.BCrypt.HashPassword("password") };

        // Act
        var result = await _userService.AuthenticateUser(userLoginDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("User1", result.Username);
    }

    [Fact]
    public async Task AuthenticateUser_ReturnsNull_WhenCredentialsAreInvalid()
    {
        // Arrange
        var userLoginDto = new UserLoginDto { Email = "user1@example.com", Password = "wrongpassword" };
        var user = new User { Username = "User1", EmailAddress = "user1@example.com", Password = BCrypt.Net.BCrypt.HashPassword("password") };

        // Act
        var result = await _userService.AuthenticateUser(userLoginDto);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetUserByEmailAsync_ReturnsUser_WhenUserExists()
    {
        // Arrange
        var user = new User { UserId = 1, Username = "User1", EmailAddress = "user1@example.com" };

        // Act
        var result = await _userService.GetUserByEmailAsync("user1@example.com");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("User1", result.Username);
    }

    [Fact]
    public async Task GetUserByEmailAsync_ReturnsNull_WhenUserDoesNotExist()
    {
        // Act
        var result = await _userService.GetUserByEmailAsync("user1@example.com");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CreateUserAsync_AddsUser()
    {
        // Arrange
        var userRegistrationDto = new UserRegistrationDto { Username = "User1", Email = "user1@example.com", Password = "password", Name = "John", Surname = "Doe", CNP = "1234567890123", Age = 30, RoleId = 1, PhoneNumber = "1234567890", Address = "123 Main St", Description = "Description" };
        var mockSet = new Mock<System.Data.Entity.DbSet<User>>();
        var mockSetRole = new Mock<System.Data.Entity.DbSet<Role>>();

        _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _userService.CreateUserAsync(userRegistrationDto);

        // Assert
        mockSet.Verify(m => m.Add(It.IsAny<User>()), Times.Once());
        _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        Assert.NotNull(result);
    }

    [Fact]
    public void UpdateUserRole_UpdatesUserRole()
    {
        // Arrange
        var user = new User { UserId = 1, Username = "User1", RoleId = 1 };
        var mockSet = new Mock<System.Data.Entity.DbSet<User>>();
        mockSet.Setup(m => m.Find(It.IsAny<int>())).Returns(user);
        _mockContext.Setup(m => m.SaveChanges()).Returns(1);

        // Act
        var result = _userService.UpdateUserRole(1, 2);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, user.RoleId);
    }

    [Fact]
    public async Task GetUserByUsernameAsync_ReturnsUser_WhenUserExists()
    {
        // Arrange
        var user = new User { UserId = 1, Username = "User1" };

        // Act
        var result = await _userService.GetUserByUsernameAsync("User1");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("User1", result.Username);
    }

    [Fact]
    public async Task GetUserByUsernameAsync_ReturnsNull_WhenUserDoesNotExist()
    {
        // Act
        var result = await _userService.GetUserByUsernameAsync("User1");

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GeneratePasswordResetCode_GeneratesCode()
    {
        // Arrange
        var user = new User { UserId = 1, EmailAddress = "user1@example.com" };
        var mockSet = new Mock<System.Data.Entity.DbSet<User>>();
        _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _userService.GeneratePasswordResetCode("user1@example.com");

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(result.ResetPasswordCode);
    }

    [Fact]
    public async Task ResetPasswordWithCode_ResetsPassword()
    {
        // Arrange
        var user = new User { UserId = 1, EmailAddress = "user1@example.com", ResetPasswordCode = "123456", ResetPasswordCodeExpires = DateTime.UtcNow.AddMinutes(15) };
        var mockSet = new Mock<System.Data.Entity.DbSet<User>>();
        _mockContext.Setup(m => m.SaveChangesAsync(default)).ReturnsAsync(1);

        // Act
        var result = await _userService.ResetPasswordWithCode("user1@example.com", "123456", "newpassword");

        // Assert
        Assert.NotNull(result);
        Assert.True(BCrypt.Net.BCrypt.Verify("newpassword", result.Password));
    }

    [Fact]
    public async Task GetUsersByRole_ReturnsUsers()
    {
        // Arrange
        var users = new List<User>
        {
            new User { UserId = 1, Username = "User1", RoleId = 1 },
            new User { UserId = 2, Username = "User2", RoleId = 1 }
        }.AsQueryable();

        var mockSet = new Mock<System.Data.Entity.DbSet<User>>();
        mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(users.Provider);
        mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(users.Expression);
        mockSet.As<IQueryable<User>>().Setup(m => m.ElementType).Returns(users.ElementType);
        mockSet.As<IQueryable<User>>().Setup(m => m.GetEnumerator()).Returns(users.GetEnumerator());

        // Act
        var result = _userService.GetUsersByRole(1);

        // Assert
        Assert.Equal(2, result.Count());
    }
}
