using Microsoft.AspNetCore.Mvc;
using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BackendMedicalApplication.Models;
using Microsoft.Extensions.Options;
using BackendMedicalApplication.Services;

namespace BackendMedicalApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        private readonly JwtConfig _jwtConfig;

        public AuthController(IUserService userService, IEmailService emailService, IOptionsMonitor<JwtConfig> optionsMonitor)
        {
            _userService = userService;
            _emailService = emailService;
            _jwtConfig = optionsMonitor.CurrentValue;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
        {
            var user = await _userService.AuthenticateUser(loginDto);
            if (user == null)
                return BadRequest(new { message = "Email or password is incorrect" });

            var token = GenerateJwtToken(user);

            return Ok(new { token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDto registrationDto)
        {
            var userExists = await _userService.GetUserByEmailAsync(registrationDto.Email);
            if (userExists != null)
            {
                return BadRequest(new { message = "User already exists" });
            }

            if (registrationDto.Password == registrationDto.ConfirmPassword)
            {

                var user = new UserDto
                {
                    Username = registrationDto.Username,
                    EmailAddress = registrationDto.Email,
                    Password = registrationDto.Password,
                    CNP = registrationDto.CNP,
                    Name = registrationDto.Name,
                    Surname = registrationDto.Surname,
                    Age = registrationDto.Age,
                    RoleId = registrationDto.RoleId,
                    Address = registrationDto.Address,
                    PhoneNumber = registrationDto.PhoneNumber,
                };
            }
            else
            {
                return BadRequest(new { message = "Passwords don't match" });
            }
            var createdUser = await _userService.CreateUserAsync(registrationDto);
            if (createdUser == null)
            {
                return BadRequest(new { message = "User creation failed" });
            }

            var jwtToken = GenerateJwtToken(createdUser);

            return Ok(new { token = jwtToken });
        }

        private string GenerateJwtToken(UserDto user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes(_jwtConfig.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", user.UserId.ToString()),
                    new Claim(JwtRegisteredClaimNames.Sub, user.EmailAddress),
                    new Claim(JwtRegisteredClaimNames.Email, user.EmailAddress),
                    // Add other claims as needed
                }),
                Expires = DateTime.UtcNow.AddMinutes(_jwtConfig.AccessTokenExpirationMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Audience = _jwtConfig.Audience,
                Issuer = _jwtConfig.Issuer
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }

        [HttpPost("forgot-password/email")]
        public async Task<IActionResult> ForgotPasswordEmail([FromBody] ForgotPasswordEmailDto model)
        {
            var user = await _userService.GeneratePasswordResetCode(model.Email);
            if (user == null) return NotFound("User not found.");

            await _emailService.SendEmailAsync(model.Email, "Your Password Reset Code", $"Your reset code is: {user.ResetPasswordCode}", true);
            return Ok("Reset code sent to your email.");
        }

        [HttpPost("reset-password/email")]
        public async Task<IActionResult> ResetPasswordEmail([FromBody] ResetPasswordEmailDto model)
        {
            var user = await _userService.ResetPasswordWithCode(model.Email, model.Code, model.NewPassword);
            if (user == null)
                return BadRequest("Invalid code or code expired.");

            return Ok("Password has been reset successfully.");
        }
    }
}

namespace BackendMedicalApplication.DTo
{
    public class ForgotPasswordEmailDto
    {
        public string Email { get; set; }
    }

    public class ResetPasswordEmailDto
    {
        public string Email { get; set; }
        public string Code { get; set; }
        public string NewPassword { get; set; }
    }
}
