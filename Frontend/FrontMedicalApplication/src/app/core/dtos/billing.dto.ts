export class BillingDto {
    billingId?: number;
    patientId: number;
    amount: number;
    dateIssued: Date;
    paymentStatus: string;
  
    constructor(
      patientId: number,
      amount: number,
      dateIssued: Date = new Date(),
      paymentStatus: string = 'Pending',
      billingId?: number
    ) {
      this.patientId = patientId;
      this.amount = amount;
      this.dateIssued = dateIssued;
      this.paymentStatus = paymentStatus;
      if (billingId) {
        this.billingId = billingId;
      }
    }
  }
  