using BackendMedicalApplication.Controllers;
using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace BackendMedicalApplication.Tests
{
    public class UserControllerTests
    {
        private readonly Mock<IUserService> _mockService;
        private readonly UserController _controller;

        public UserControllerTests()
        {
            _mockService = new Mock<IUserService>();
            _controller = new UserController(_mockService.Object);
        }

        [Fact]
        public void GetAllUsers_ReturnsOkResult()
        {
            var users = new List<UserDto>
            {
                new UserDto { UserId = 1, Username = "user1" },
                new UserDto { UserId = 2, Username = "user2" }
            };
            _mockService.Setup(service => service.GetAllUsers()).Returns(users);

            var result = _controller.GetAllUsers();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<UserDto>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetUserByUsername_ReturnsOkResult()
        {
            var user = new UserDto { UserId = 1, Username = "user1" };
            _mockService.Setup(service => service.GetUserByUsernameAsync(It.IsAny<string>())).ReturnsAsync(user);

            var result = await _controller.GetUserByUsername("user1");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<UserDto>(okResult.Value);
            Assert.Equal("user1", returnValue.Username);
        }

        [Fact]
        public async Task GetUserById_ReturnsOkResult()
        {
            var user = new UserDto { UserId = 1, Username = "user1" };
            _mockService.Setup(service => service.GetUserByIdAsync(It.IsAny<int>())).ReturnsAsync(user);

            var result = await _controller.GetUserById(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<UserDto>(okResult.Value);
            Assert.Equal("user1", returnValue.Username);
        }

        [Fact]
        public async Task GetUserByEmail_ReturnsOkResult()
        {
            var user = new UserDto { UserId = 1, Username = "user1" };
            _mockService.Setup(service => service.GetUserByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);

            var result = await _controller.GetUserByEmail("user1@example.com");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<UserDto>(okResult.Value);
            Assert.Equal("user1", returnValue.Username);
        }

        [Fact]
        public void CreateUser_ReturnsOkResult()
        {
            var userDto = new UserDto { Username = "user1" };
            _mockService.Setup(service => service.CreateUser(It.IsAny<UserDto>())).Returns(userDto);

            var result = _controller.CreateUser(userDto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<UserDto>(okResult.Value);
            Assert.Equal("user1", returnValue.Username);
        }

        [Fact]
        public void UpdateUser_ReturnsOkResult()
        {
            var userDto = new UserDto { Username = "updatedUser" };
            _mockService.Setup(service => service.UpdateUser(It.IsAny<int>(), It.IsAny<UserDto>())).Returns(userDto);

            var result = _controller.UpdateUser(1, userDto);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<UserDto>(okResult.Value);
            Assert.Equal("updatedUser", returnValue.Username);
        }

        [Fact]
        public void DeleteUser_ReturnsOkResult()
        {
            _mockService.Setup(service => service.DeleteUser(It.IsAny<int>())).Returns(true);

            var result = _controller.DeleteUser(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<string>(okResult.Value);
            Assert.Equal("User with ID 1 deleted successfully.", returnValue);
        }

        [Fact]
        public async Task GetCurrentUserProfile_ReturnsOkResult()
        {
            var user = new UserDto { UserId = 1, Username = "user1" };
            _mockService.Setup(service => service.GetUserByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);

            var result = await _controller.GetCurrentUserProfile();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<UserDto>(okResult.Value);
            Assert.Equal("user1", returnValue.Username);
        }

        [Fact]
        public void GetAllDoctors_ReturnsOkResult()
        {
            var doctors = new List<UserDto>
            {
                new UserDto { UserId = 1, Username = "doctor1" },
                new UserDto { UserId = 2, Username = "doctor2" }
            };
            _mockService.Setup(service => service.GetUsersByRole(It.IsAny<int>())).Returns(doctors);

            var result = _controller.GetAllDoctors();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<UserDto>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task UpdateDescription_ReturnsOkResult()
        {
            var user = new UserDto { UserId = 1, Username = "user1", Description = "Old Description" };
            _mockService.Setup(service => service.GetUserByIdAsync(It.IsAny<int>())).ReturnsAsync(user);
            _mockService.Setup(service => service.UpdateUser(It.IsAny<int>(), It.IsAny<UserDto>())).Returns(user);

            var result = await _controller.UpdateDescription(1, "New Description");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<UserDto>(okResult.Value);
            Assert.Equal("New Description", returnValue.Description);
        }
    }
}
