import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private apiUrl = `${environment.apiUrl}/Billing`; // Update this with the actual API endpoint

  constructor(private http: HttpClient) { }

  getAllBillingRecords(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getBillingRecordById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createBillingRecord(billingRecord: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, billingRecord);
  }

  updateBillingRecord(id: number, billingRecord: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, billingRecord);
  }

  // Add other necessary methods
}
