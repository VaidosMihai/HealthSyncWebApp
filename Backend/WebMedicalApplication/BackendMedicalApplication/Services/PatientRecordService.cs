using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebMedicalApplication.Models;

namespace BackendMedicalApplication.Services
{
    public class PatientRecordService : IPatientRecordService
    {
        private readonly AppDbContext _context;

        public PatientRecordService(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<PatientRecordDto> GetAllPatientRecords()
        {
            return _context.PatientRecords
                .Include(mr => mr.Appointment) // Ensure Appointment is included
                .Select(mr => new PatientRecordDto
                {
                    PatientRecordId = mr.PatientRecordId,
                    AppointmentId = mr.Appointment != null ? mr.Appointment.AppointmentId : 0, // Handle null
                    DateRecorded = mr.RecordDate,
                    Diagnosis = mr.Diagnosis,
                    Notes = mr.Notes
                }).ToList();
        }

        public PatientRecordDto GetPatientRecordById(int recordId)
        {
            var record = _context.PatientRecords
                .Include(r => r.Appointment) // Ensure Appointment is included
                .FirstOrDefault(r => r.PatientRecordId == recordId);

            if (record == null)
            {
                return null;
            }

            return new PatientRecordDto
            {
                PatientRecordId = record.PatientRecordId,
                AppointmentId = record.Appointment != null ? record.Appointment.AppointmentId : 0, // Handle null
                DateRecorded = record.RecordDate,
                Diagnosis = record.Diagnosis,
                Notes = record.Notes
            };
        }

        public async Task<PatientRecordDto> GetPatientRecordByAppointmentId(int appointmentId)
        {
            var record = await _context.PatientRecords
                .Include(r => r.Appointment)
                .FirstOrDefaultAsync(r => r.Appointment.AppointmentId == appointmentId);

            if (record == null)
            {
                return null;
            }

            return new PatientRecordDto
            {
                PatientRecordId = record.PatientRecordId,
                AppointmentId = record.Appointment != null ? record.Appointment.AppointmentId : 0, // Handle null
                DateRecorded = record.RecordDate,
                Diagnosis = record.Diagnosis,
                Notes = record.Notes
            };
        }

        public PatientRecordDto CreatePatientRecord(PatientRecordDto patientRecordDto)
        {
            var appointment = _context.Appointments.Find(patientRecordDto.AppointmentId);
            if (appointment == null)
            {
                throw new ArgumentException("Invalid AppointmentId.");
            }

            var newRecord = new PatientRecord
            {
                PatientId = patientRecordDto.PatientRecordId,
                Appointment = appointment,
                RecordDate = patientRecordDto.DateRecorded,
                Diagnosis = patientRecordDto.Diagnosis,
                Notes = patientRecordDto.Notes,
            };

            _context.PatientRecords.Add(newRecord);
            _context.SaveChanges();

            patientRecordDto.PatientRecordId = newRecord.PatientRecordId;
            return patientRecordDto;
        }

        public PatientRecordDto UpdatePatientRecord(int recordId, PatientRecordDto patientRecordDto)
        {
            var record = _context.PatientRecords
                .Include(r => r.Appointment) // Ensure Appointment is included
                .FirstOrDefault(r => r.PatientRecordId == recordId);

            if (record == null)
            {
                return null;
            }

            record.RecordDate = patientRecordDto.DateRecorded;
            record.Diagnosis = patientRecordDto.Diagnosis;
            record.Notes = patientRecordDto.Notes;

            _context.SaveChanges();

            return patientRecordDto;
        }

        public bool DeletePatientRecord(int recordId)
        {
            var record = _context.PatientRecords
                .Include(r => r.Appointment) // Ensure Appointment is included
                .FirstOrDefault(r => r.PatientRecordId == recordId);

            if (record == null)
            {
                return false;
            }

            _context.PatientRecords.Remove(record);
            _context.SaveChanges();

            return true;
        }
    }
}
