export class AppointmentDto {
  appointmentId?: number;
  patientId: number;
  doctorId: number;
  dateTime: Date;
  reason?: string;
  patientRecordId?: number;
  status?: string;

  constructor(
    patientId: number,
    doctorId: number,
    dateTime: Date = new Date(),
    reason?: string,
    appointmentId?: number,
    patientRecordId?: number,
    status?: string
  ) {
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.dateTime = dateTime;
    this.reason = reason;
    this.status = status;
    if (appointmentId) {
      this.appointmentId = appointmentId;
    }
    if (patientRecordId) {
      this.patientRecordId = patientRecordId;
    }
  }
}
