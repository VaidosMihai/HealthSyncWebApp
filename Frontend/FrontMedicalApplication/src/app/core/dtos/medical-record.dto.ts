export class MedicalRecordDto {
  medicalRecordId?: number;
  appointmentId: number;
  patientId: number;
  dateRecorded: Date;
  diagnosis: string;
  notes?: string;

  constructor(
    patientId: number,
    appointmentId: number,
    dateRecorded: Date = new Date(),
    diagnosis: string,
    notes?: string,
    medicalRecordId?: number
  ) {
    this.patientId = patientId;
    this.appointmentId = appointmentId;
    this.dateRecorded = dateRecorded;
    this.diagnosis = diagnosis;
    this.notes = notes;
    this.medicalRecordId = medicalRecordId;
  }
}
