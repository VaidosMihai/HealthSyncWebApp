import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicalRecordService } from '../../../services/medical-record.service';
import { MedicalRecordDto } from '../../../dtos/medical-record.dto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-medical-record-edit',
  templateUrl: './medical-record-edit.component.html',
  styleUrls: ['./medical-record-edit.component.css'],
  providers: [DatePipe]
})
export class MedicalRecordEditComponent implements OnInit {
  medicalRecordForm: FormGroup;
  medicalRecordId: number | undefined;
  appointmentId: number | undefined;

  constructor(
    private medicalRecordService: MedicalRecordService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.medicalRecordForm = this.fb.group({
      patientId: [{ value: '', disabled: true }, Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      diagnosis: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.appointmentId = this.route.snapshot.params['appointmentId'];
    if (this.appointmentId) {
      this.medicalRecordService.getMedicalRecordByAppointmentId(this.appointmentId).subscribe(
        (medicalRecord: MedicalRecordDto) => {
          this.medicalRecordId = medicalRecord.medicalRecordId;
          const { date, time } = this.splitDateTime(medicalRecord.dateRecorded);
          this.medicalRecordForm.patchValue({
            patientId: medicalRecord.patientId,
            date: date,
            time: time,
            diagnosis: medicalRecord.diagnosis,
            notes: medicalRecord.notes
          });
        },
        (error) => console.error('Error fetching medical record:', error)
      );
    }
  }

  splitDateTime(dateTime: Date): { date: string, time: string } {
    const date = this.datePipe.transform(dateTime, 'yyyy-MM-dd') || '';
    const time = this.datePipe.transform(dateTime, 'HH:mm') || '';
    return { date, time };
  }

  onSubmit() {
    if (this.medicalRecordForm.valid) {
      const formValues = this.medicalRecordForm.getRawValue();
      const medicalRecordData: MedicalRecordDto = {
        ...formValues,
        dateRecorded: this.combineDateTime(formValues.date, formValues.time),
        appointmentId: this.appointmentId!,
        medicalRecordId: this.medicalRecordId
      };
      
      if (this.medicalRecordId) {
        this.medicalRecordService.updateMedicalRecord(this.medicalRecordId, medicalRecordData).subscribe(
          () => this.router.navigate(['/medical-records']),
          (error) => console.error('Error updating medical record:', error)
        );
      } else {
        this.medicalRecordService.createMedicalRecord(medicalRecordData).subscribe(
          () => this.router.navigate(['/medical-records']),
          (error) => console.error('Error creating medical record:', error)
        );
      }
    }
  }

  combineDateTime(date: string, time: string): Date {
    const dateTimeString = `${date}T${time}:00`;
    return new Date(dateTimeString);
  }
}
