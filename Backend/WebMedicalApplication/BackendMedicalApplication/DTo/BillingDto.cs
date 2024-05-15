namespace BackendMedicalApplication.DTo
{
    public class BillingDto
    {
        public int PatientId { get; set; }
        public decimal Amount { get; set; }
        public DateTime DateIssued { get; set; }
        public string PaymentStatus { get; set; }
    }

}
