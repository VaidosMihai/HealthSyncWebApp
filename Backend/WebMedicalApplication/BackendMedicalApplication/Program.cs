using Microsoft.EntityFrameworkCore;
using BackendMedicalApplication;
using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Services;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BackendMedicalApplication.Models;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ContactApi.Controllers;

var builder = WebApplication.CreateBuilder(args);

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Load configuration from environment variables
string GetEnvironmentVariable(string name)
{
    var value = Environment.GetEnvironmentVariable(name);
    if (string.IsNullOrEmpty(value))
    {
        Console.WriteLine($"Environment variable '{name}' is not set.");
        throw new ArgumentNullException(name, $"Environment variable '{name}' is not set.");
    }
    return value;
}

var jwtSecret = GetEnvironmentVariable("JWT_SECRET");
var jwtIssuer = GetEnvironmentVariable("JWT_ISSUER");
var jwtAudience = GetEnvironmentVariable("JWT_AUDIENCE");
var twilioAccountSid = GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
var twilioAuthToken = GetEnvironmentVariable("TWILIO_AUTH_TOKEN");
var twilioFromNumber = GetEnvironmentVariable("TWILIO_FROM_NUMBER");
var backendDatabaseConnectionString = GetEnvironmentVariable("BACKEND_DATABASE_CONNECTION_STRING");
var smtpServer = GetEnvironmentVariable("SMTP_SERVER");
var smtpPort = GetEnvironmentVariable("SMTP_PORT");
var emailSenderName = GetEnvironmentVariable("EMAIL_SENDER_NAME");
var emailSenderEmail = GetEnvironmentVariable("EMAIL_SENDER_EMAIL");
var emailSenderPassword = GetEnvironmentVariable("EMAIL_SENDER_PASSWORD");

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "BackendMedicalApplication", Version = "v1" });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(backendDatabaseConnectionString));

// Dependency Injection for services
builder.Services.Configure<JwtConfig>(options =>
{
    options.Secret = jwtSecret;
    options.Issuer = jwtIssuer;
    options.Audience = jwtAudience;
    options.AccessTokenExpirationMinutes = 60;
    options.RefreshTokenExpirationDays = 7;
});

builder.Services.Configure<TwilioSettings>(options =>
{
    options.AccountSid = twilioAccountSid;
    options.AuthToken = twilioAuthToken;
    options.FromNumber = twilioFromNumber;
});

builder.Services.Configure<EmailSettings>(options =>
{
    options.SmtpServer = smtpServer;
    options.SmtpPort = int.Parse(smtpPort);
    options.SenderName = emailSenderName;
    options.SenderEmail = emailSenderEmail;
    options.SenderPassword = emailSenderPassword;
});

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.Configure<SMSApiSettings>(builder.Configuration.GetSection("SMSApiSettings"));
builder.Services.Configure<MailerSendSettings>(builder.Configuration.GetSection("MailerSendSettings"));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPatientRecordService, PatientRecordService>();
builder.Services.AddScoped<IBillingService, BillingService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<ITwilioService, TwilioService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<ISmsService, SmsService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IEmailService, MailerSendEmailService>();
builder.Services.AddScoped<IContactFormService, ContactFormService>();
builder.Services.AddScoped<IReportService, ReportService>();



/*builder.Services.AddTransient<IEmailService, EmailService>();*/

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
    };
});

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder
            .WithOrigins(
                "http://localhost:4200", // Local development
                "https://lemon-cliff-0c0893203.5.azurestaticapps.net" // Azure Static Web Apps
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BackendMedicalApplication v1"));
    app.UseDeveloperExceptionPage();
}

app.UseStaticFiles(); // This will serve the Angular build files

app.UseCors("AllowSpecificOrigin");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapFallbackToFile("index.html"); // This will ensure that Angular routing works
});

app.Run();
