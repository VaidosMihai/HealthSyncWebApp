import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../../../services/patient-service.service';

@Component({
  selector: 'app-patient-record-edit',
  templateUrl: './patient-record-edit.component.html',
  styleUrls: ['./patient-record-edit.component.css']
})
export class PatientRecordEditComponent implements OnInit {
  recordForm: FormGroup;
  recordId: number;

  constructor(
    private patientRecordService: PatientService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recordForm = this.fb.group({
      diagnosis: ['', [Validators.required]],
      treatment: ['', [Validators.required]],
      notes: ['']
      // Add other form controls as needed
    });
    this.recordId = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
  }

  ngOnInit() {
    if (this.recordId) {
      // Fetch the record details and populate the form
    }
  }

  saveRecord() {
    // Save record logic goes here
  }
}
