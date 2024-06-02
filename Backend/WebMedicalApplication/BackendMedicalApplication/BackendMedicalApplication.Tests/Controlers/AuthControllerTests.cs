using BackendMedicalApplication.Controllers;
using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;
using System.Data.Entity;
using System.Threading.Tasks;
using WebMedicalApplication.Models;
using Xunit;

namespace BackendMedicalApplication.Tests
{
    public class AuthControllerTests
    {
        private readonly Mock<IUserService> _mockUserService;
        private readonly Mock<IEmailService> _mockEmailService;
        private readonly Mock<IOptionsMonitor<JwtConfig>> _mockOptionsMonitor;
        private readonly Mock<AppDbContext> _mockContext;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _mockUserService = new Mock<IUserService>();
            _mockEmailService = new Mock<IEmailService>();
            _mockOptionsMonitor = new Mock<IOptionsMonitor<JwtConfig>>();
            _mockContext = new Mock<AppDbContext>();
            var jwtConfig = new JwtConfig { Secret = "YourSecretKey", AccessTokenExpirationMinutes = 30, Issuer = "TestIssuer", Audience = "TestAudience" };
            _mockOptionsMonitor.Setup(o => o.CurrentValue).Returns(jwtConfig);
            _controller = new AuthController(_mockUserService.Object, _mockEmailService.Object, _mockOptionsMonitor.Object, _mockContext.Object);
        }

        [Fact]
        public async Task Login_ReturnsOkResult()
        {
            var loginDto = new UserLoginDto { Email = "test@example.com", Password = "password" };
            var userDto = new UserDto { EmailAddress = "test@example.com" };
            _mockUserService.Setup(service => service.AuthenticateUser(It.IsAny<UserLoginDto>())).ReturnsAsync(userDto);

            var result = await _controller.Login(loginDto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<string>(okResult.Value);
            Assert.NotNull(returnValue);
        }

        [Fact]
        public async Task Register_ReturnsOkResult()
        {
            var registrationDto = new UserRegistrationDto { Email = "test@example.com", Password = "password", ConfirmPassword = "password" };
            _mockUserService.Setup(service => service.CreateUserAsync(It.IsAny<UserRegistrationDto>())).ReturnsAsync(new UserDto());

            var result = await _controller.Register(registrationDto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<string>(okResult.Value);
            Assert.NotNull(returnValue);
        }

        [Fact]
        public async Task ForgotPasswordEmail_ReturnsOkResult()
        {
            var model = new ForgotPasswordEmailDto { Email = "test@example.com" };
            _mockUserService.Setup(service => service.GeneratePasswordResetCode(It.IsAny<string>())).ReturnsAsync(new User());

            var result = await _controller.ForgotPasswordEmail(model);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<string>(okResult.Value);
            Assert.Equal("Reset code sent to your email.", returnValue);
        }

        [Fact]
        public async Task ResetPasswordEmail_ReturnsOkResult()
        {
            var model = new ResetPasswordEmailDto { Email = "test@example.com", Code = "123456", NewPassword = "newpassword" };
            _mockUserService.Setup(service => service.ResetPasswordWithCode(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(new User());

            var result = await _controller.ResetPasswordEmail(model);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<string>(okResult.Value);
            Assert.Equal("Password has been reset successfully.", returnValue);
        }

        [Fact]
        public async Task VerifyEmail_ReturnsOkResult()
        {
            var user = new User { IsVerified = false, VerificationToken = "token" };

            var result = await _controller.VerifyEmail("token");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<string>(okResult.Value);
            Assert.Equal("Email verified successfully.", returnValue);
        }
    }
}
