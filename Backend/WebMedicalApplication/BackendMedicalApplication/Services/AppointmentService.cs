﻿using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using BackendMedicalApplication.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebMedicalApplication.Models;

namespace BackendMedicalApplication.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public AppointmentService(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public IEnumerable<AppointmentDto> GetAllAppointments()
        {
            return _context.Appointments.Select(a => new AppointmentDto
            {
                AppointmentId = a.AppointmentId,
                PatientId = a.PatientId,
                DoctorId = a.DoctorId,
                DateTime = a.AppointmentDate,
                Reason = a.Reason,
                Status = a.Status,
                PatientRecordId = a.PatientRecordId
            }).ToList();
        }

        public AppointmentDto GetAppointmentById(int appointmentId)
        {
            var appointment = _context.Appointments.Find(appointmentId);
            if (appointment == null) return null;

            return new AppointmentDto
            {
                AppointmentId = appointment.AppointmentId,
                PatientId = appointment.PatientId,
                DoctorId = appointment.DoctorId,
                DateTime = appointment.AppointmentDate,
                Reason = appointment.Reason,
                Status = appointment.Status,
                PatientRecordId = appointment.PatientRecordId
            };
        }

        public async Task<AppointmentDto> CreateAppointment(AppointmentDto appointmentDto)
        {
            var newAppointment = new Appointment
            {
                PatientId = appointmentDto.PatientId,
                DoctorId = appointmentDto.DoctorId,
                AppointmentDate = appointmentDto.DateTime,
                Reason = appointmentDto.Reason,
                Status = appointmentDto.Status ?? "Pending"  // Ensure status defaults to "Pending"
            };

            _context.Appointments.Add(newAppointment);
            await _context.SaveChangesAsync();

            var notificationMessage = $"New appointment scheduled for {newAppointment.AppointmentDate}.";
            await _notificationService.CreateNotification(newAppointment.DoctorId, notificationMessage);

            appointmentDto.AppointmentId = newAppointment.AppointmentId;
            return appointmentDto;
        }


        public async Task NotifyUserAsync(int userId, string message)
        {
            var notification = new Notification
            {
                UserId = userId,
                Message = message,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task<AppointmentDto> UpdateAppointment(int appointmentId, AppointmentDto appointmentDto)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null) return null;

            var originalDateTime = appointment.AppointmentDate;

            appointment.PatientId = appointmentDto.PatientId;
            appointment.DoctorId = appointmentDto.DoctorId;
            appointment.AppointmentDate = appointmentDto.DateTime;
            appointment.Reason = appointmentDto.Reason;
            appointment.Status = appointmentDto.Status;

            await _context.SaveChangesAsync();

            if (originalDateTime != appointmentDto.DateTime)
            {
                var message = $"Your appointment has been rescheduled to {appointmentDto.DateTime}.";
                await NotifyUserAsync(appointment.PatientId, message);
            }

            return appointmentDto;
        }


        public async Task<bool> DeleteAppointment(int appointmentId)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null) return false;

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<AppointmentDto>> GetByDoctorId(int doctorId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.DoctorId == doctorId)
                .Select(a => new AppointmentDto
                {
                    AppointmentId = a.AppointmentId,
                    DoctorId = a.DoctorId,
                    PatientId = a.PatientId,
                    DateTime = a.AppointmentDate,
                    Reason = a.Reason,
                    Status = a.Status,
                    PatientRecordId = a.PatientRecordId
                })
                .ToListAsync();

            return appointments;
        }

        public async Task<List<AppointmentDto>> GetAppointmentsByPatientId(int patientId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .Select(a => new AppointmentDto
                {
                    AppointmentId = a.AppointmentId,
                    DoctorId = a.DoctorId,
                    PatientId = a.PatientId,
                    DateTime = a.AppointmentDate,
                    Reason = a.Reason,
                    Status = a.Status,
                    PatientRecordId = a.PatientRecordId,
                })
                .ToListAsync();

            return appointments;
        }

        public async Task<AppointmentDto> AddPatientRecordToAppointment(int appointmentId, PatientRecordDto patientRecordDto)
        {
            var appointment = await _context.Appointments.Include(a => a.PatientRecord).FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
            if (appointment == null)
            {
                throw new Exception("Appointment not found.");
            }
            if (appointment.PatientRecord != null)
            {
                throw new Exception("Appointment already has a patient record.");
            }

            var patientRecord = new PatientRecord
            {
                PatientId = appointment.PatientId,
                RecordDate = patientRecordDto.DateRecorded,
                Diagnosis = patientRecordDto.Diagnosis,
                Notes = patientRecordDto.Notes
            };

            _context.PatientRecords.Add(patientRecord);
            await _context.SaveChangesAsync();

            appointment.PatientRecordId = patientRecord.PatientRecordId;
            await _context.SaveChangesAsync();

            return new AppointmentDto
            {
                AppointmentId = appointment.AppointmentId,
                DoctorId = appointment.DoctorId,
                PatientId = appointment.PatientId,
                DateTime = appointment.AppointmentDate,
                Reason = appointment.Reason,
                Status = appointment.Status,
                PatientRecordId = patientRecord.PatientRecordId
            };
        }

        public async Task<AppointmentDto> UpdateAppointmentStatus(int appointmentId, string status)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null) return null;

            appointment.Status = status;
            await _context.SaveChangesAsync();

            return new AppointmentDto
            {
                AppointmentId = appointment.AppointmentId,
                PatientId = appointment.PatientId,
                DoctorId = appointment.DoctorId,
                DateTime = appointment.AppointmentDate,
                Reason = appointment.Reason,
                Status = appointment.Status,
                PatientRecordId = appointment.PatientRecordId
            };
        }
    }
}
