import { Component, OnInit } from '@angular/core';
import { MedicalRecordService } from '../../../services/medical-record.service';

@Component({
  selector: 'app-medical-record-list',
  templateUrl: './medical-record-list.component.html',
  styleUrls: ['./medical-record-list.component.css']
})
export class MedicalRecordListComponent implements OnInit {
  medicalRecords: any[] = [];

  constructor(private medicalRecordService: MedicalRecordService) {}

  ngOnInit() {
    this.medicalRecordService.getMedicalRecords().subscribe(
      (data) => {
        this.medicalRecords = data;
      },
      (error) => {
        // Handle errors here
      }
    );
  }
}
