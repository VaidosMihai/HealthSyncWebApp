import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillingService } from '../../../services/billing-service.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-billing-edit',
  templateUrl: './billing-edit.component.html',
  styleUrls: ['./billing-edit.component.css']
})
export class BillingEditComponent implements OnInit {
  billingForm: FormGroup;
  billingId: number;

  constructor(
    private billingService: BillingService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.billingForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0.01)]],
      dateIssued: ['', Validators.required],
      paymentStatus: ['', Validators.required]
      // Add other form controls as needed
    });
    this.billingId = +this.route.snapshot.params['id']; // Plus sign for type coercion to number
  }

  ngOnInit() {
    if (this.billingId) {
      this.billingService.getBillingRecordById(this.billingId).subscribe(
        (billing) => {
          this.billingForm.patchValue(billing); // Assuming 'billing' has the same structure as your form
        },
        (error: Error) => {
          // Handle error
        }
      );
    }
  }

  saveBillingRecord() {
    if (this.billingForm.valid) {
      const billingData = this.billingForm.value;
      if (this.billingId) {
        this.billingService.updateBillingRecord(this.billingId, billingData).subscribe(
          () => {
            // Handle successful update
          },
          (error: Error) => {
            // Handle update error
          }
        );
      } else {
        this.billingService.createBillingRecord(billingData).subscribe(
          () => {
            // Handle successful creation
          },
          (error: Error) => {
            // Handle creation error
          }
        );
      }
    }
  }
}
