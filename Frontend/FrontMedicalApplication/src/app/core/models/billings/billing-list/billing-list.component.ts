import { Component, OnInit } from '@angular/core';
import { BillingService } from '../../../services/billing-service.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-billing-list',
  templateUrl: './billing-list.component.html',
  styleUrls: ['./billing-list.component.css']
})
export class BillingListComponent implements OnInit {
  billingRecords: any[] = [];

  constructor(private billingService: BillingService) {}

  ngOnInit() {
    this.billingService.getAllBillingRecords().subscribe(
      (data) => {
        this.billingRecords = data;
      },
      (error) => {
        // Handle errors here
      }
    );
  }
}
