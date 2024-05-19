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

namespace BackendMedicalApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITwilioService _twilioService;
        private readonly JwtConfig _jwtConfig;

        public AuthController(IUserService userService, ITwilioService twilioService, IOptionsMonitor<JwtConfig> optionsMonitor)
        {
            _userService = userService;
            _twilioService = twilioService;
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

        [HttpPost("forgot-password/sms")]
        public async Task<IActionResult> ForgotPasswordSMS([FromBody] ForgotPasswordSMSDto model)
        {
            var user = await _userService.GeneratePasswordResetCode(model.PhoneNumber);
            if (user == null) return NotFound("User not found.");

            // Ensure phone number is correctly formatted
            string formattedPhoneNumber = FormatPhoneNumber(model.PhoneNumber);

            await _twilioService.SendSms(formattedPhoneNumber, $"Your reset code is: {user.ResetPasswordCode}");
            return Ok("Reset code sent to your phone.");
        }

        private string FormatPhoneNumber(string phoneNumber)
        {
            // Remove any non-digit characters
            phoneNumber = new string(phoneNumber.Where(char.IsDigit).ToArray());

            // Add the Romanian country code if not already present
            if (!phoneNumber.StartsWith("40"))
            {
                if (phoneNumber.StartsWith("0"))
                {
                    phoneNumber = phoneNumber.TrimStart('0');
                }
                phoneNumber = "40" + phoneNumber;
            }

            return "+" + phoneNumber;
        }



        [HttpPost("reset-password/sms")]
        public async Task<IActionResult> ResetPasswordSMS([FromBody] ResetPasswordSMSDto model)
        {
            var user = await _userService.ResetPasswordWithCode(model.PhoneNumber, model.Code, model.NewPassword);
            if (user == null)
                return BadRequest("Invalid code or code expired.");

            // Ensure reset code and its expiration are handled correctly
            if (user.ResetPasswordCode == null || user.ResetPasswordCodeExpires == null || user.ResetPasswordCodeExpires < DateTime.UtcNow)
                return BadRequest("Reset code is expired or not set.");

            return Ok("Password has been reset successfully.");
        }
    }
}
