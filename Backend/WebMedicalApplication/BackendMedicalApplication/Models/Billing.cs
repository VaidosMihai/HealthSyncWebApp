using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebMedicalApplication.Models;

namespace BackendMedicalApplication.Models
{
    public class Billing
    {
        [Key]
        public int BillingId { get; set; }
        [ForeignKey("Patient")]
        public int PatientId { get; set; }
        public decimal Amount { get; set; }
        public DateTime DateIssued { get; set; }
        public string PaymentStatus { get; set; } // e.g., "Pending", "Paid", "Overdue"

        // Navigation property
        public User Patient { get; set; }
    }

}
