using Microsoft.AspNetCore.Mvc;
using BackendMedicalApplication.Models;
using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using System.Linq;

// Other necessary imports

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public IActionResult GetAllUsers()
    {
        var users = _userService.GetAllUsers();
        return Ok(users);
    }

    [HttpGet("by-username/{username}")]
    public async Task<IActionResult> GetUserByUsername(string username)
    {
        var user = await _userService.GetUserByUsernameAsync(username);
        if (user == null)
        {
            return NotFound($"User with username {username} not found.");
        }
        return Ok(user);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserById(int userId)
    {
        var user = await _userService.GetUserByIdAsync(userId);
        if (user == null)
        {
            return NotFound($"User with ID {userId} not found.");
        }
        return Ok(user);
    }

    [HttpGet("email")]
    public async Task<IActionResult> GetUserByEmail(string email)
    {
        var user = await _userService.GetUserByEmailAsync(email);
        if (user == null)
        {
            return NotFound($"User with email {email} not found.");
        }
        return Ok(user);
    }

    [HttpPost]
    public IActionResult CreateUser(UserDto userDto)
    {
        var createdUser = _userService.CreateUser(userDto);
        if (createdUser == null)
        {
            return BadRequest("User creation failed.");
        }
        return Ok(createdUser);
    }

    [HttpPut("{userId}")]
    public IActionResult UpdateUser(int userId, UserDto userDto)
    {
        var updatedUser = _userService.UpdateUser(userId, userDto);
        if (updatedUser == null)
        {
            return NotFound($"User with ID {userId} not found.");
        }
        return Ok(updatedUser);
    }

    [HttpPut("{userId}/role")]
    public IActionResult UpdateUserRole(int userId, int newRoleId)
    {
        var updatedUser = _userService.UpdateUserRole(userId, newRoleId);
        if (updatedUser == null)
        {
            return NotFound($"User with ID {userId} not found.");
        }
        return Ok(updatedUser);
    }

    [HttpDelete("{userId}")]
    public IActionResult DeleteUser(int userId)
    {
        bool isDeleted = _userService.DeleteUser(userId);
        if (!isDeleted)
        {
            return NotFound($"User with ID {userId} not found.");
        }
        return Ok($"User with ID {userId} deleted successfully.");
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetCurrentUserProfile()
    {
        var emailClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Email)?.Value;

        if (string.IsNullOrEmpty(emailClaim))
        {
            return Unauthorized("Invalid user claim.");
        }

        var user = await _userService.GetUserByEmailAsync(emailClaim);
        if (user == null)
        {
            return NotFound("User not found.");
        }
        return Ok(user);
    }

    [HttpGet("doctors")]
    public IActionResult GetAllDoctors()
    {
        var doctors = _userService.GetUsersByRole(1); // Assuming RoleId 1 is for doctors
        if (!doctors.Any())
        {
            return NotFound("No doctors found.");
        }
        return Ok(doctors);
    }
}
