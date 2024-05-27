import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalRecordDto } from '../../../dtos/medical-record.dto';
import { AppointmentService } from '../../../services/appointment-service.service';

@Component({
  selector: 'app-medical-record-new',
  templateUrl: './medical-record-new.component.html',
  styleUrls: ['./medical-record-new.component.css']
})
export class MedicalRecordNewComponent implements OnInit {
  medicalRecord: MedicalRecordDto = new MedicalRecordDto(0, 0, new Date(), '', '');
  appointmentId!: number;

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.appointmentId = parseInt(this.route.snapshot.paramMap.get('appointmentId')!, 10);
  }

  onSubmit(): void {
    this.appointmentService.addPatientRecordToAppointment(this.appointmentId, this.medicalRecord)
      .subscribe({
        next: (response) => {
          this.sendNotification(response.patientId, 'A new medical diagnosis has been added to your appointment.');
          alert('Medical record added successfully');
          this.router.navigate(['/appointment']);
        },
        error: (error) => {
          alert('Failed to add medical record: ' + error.message);
        }
      });
  }

  sendNotification(userId: number, message: string): void {
    this.appointmentService.notifyUser(userId, message).subscribe({
      next: () => console.log('Notification sent'),
      error: err => console.error('Error sending notification:', err)
    });
  }
}
