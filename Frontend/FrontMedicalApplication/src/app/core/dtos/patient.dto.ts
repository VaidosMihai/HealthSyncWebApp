export class PatientRecordDto {
    public patientId: number;
    public recordDate: Date;
    public diagnosis: string;
    public notes: string;
  
    constructor(
      patientId: number,
      recordDate: Date,
      diagnosis: string,
      notes: string
    ) {
      this.patientId = patientId;
      this.recordDate = recordDate;
      this.diagnosis = diagnosis;
      this.notes = notes;
    }
  }
  