export class AppointmentDto {
  appointmentId?: number;
  patientId: number;
  doctorId: number;
  dateTime: Date; // Merge date, startTime, and endTime into dateTime
  reason?: string;
  patientRecordId?: number; // Add this line to include the PatientRecordId

  constructor(
    patientId: number,
    doctorId: number,
    dateTime: Date = new Date(),
    reason?: string,
    appointmentId?: number,
    patientRecordId?: number // Include PatientRecordId in the constructor
  ) {
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.dateTime = dateTime;
    this.reason = reason;
    if (appointmentId) {
      this.appointmentId = appointmentId;
    }
    if (patientRecordId) {
      this.patientRecordId = patientRecordId;
    }
  }
}
