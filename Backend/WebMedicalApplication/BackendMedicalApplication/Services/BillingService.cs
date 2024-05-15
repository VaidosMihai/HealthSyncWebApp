using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using global::BackendMedicalApplication.DTo;
using global::BackendMedicalApplication.Interfaces;
using global::BackendMedicalApplication.Models;
using System.Collections.Generic;
using System.Linq;
using WebMedicalApplication.Models; // Adjust namespaces as necessary

namespace BackendMedicalApplication.Services
{
    public class BillingService : IBillingService
    {
        private readonly AppDbContext _context;

        public BillingService(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<BillingDto> GetAllBillings()
        {
            return _context.Billings.Select(b => new BillingDto
            {
                PatientId = b.PatientId,
                Amount = b.Amount,
                DateIssued = b.DateIssued,
                PaymentStatus = b.PaymentStatus
            }).ToList();
        }

        public BillingDto GetBillingById(int billingId)
        {
            var billing = _context.Billings.Find(billingId);
            if (billing == null) return null;

            return new BillingDto
            {
                PatientId = billing.PatientId,
                Amount = billing.Amount,
                DateIssued = billing.DateIssued,
                PaymentStatus = billing.PaymentStatus
            };
        }

        public BillingDto CreateBilling(BillingDto billingDto)
        {
            var newBilling = new Billing
            {
                PatientId = billingDto.PatientId,
                Amount = billingDto.Amount,
                DateIssued = billingDto.DateIssued,
                PaymentStatus = billingDto.PaymentStatus
            };

            _context.Billings.Add(newBilling);
            _context.SaveChanges();

            // Adjust to include generated ID if necessary
            billingDto.PatientId = newBilling.BillingId; 
            return billingDto;
        }

        public BillingDto UpdateBilling(int billingId, BillingDto billingDto)
        {
            var billing = _context.Billings.Find(billingId);
            if (billing == null) return null;

            billing.Amount = billingDto.Amount;
            billing.DateIssued = billingDto.DateIssued;
            billing.PaymentStatus = billingDto.PaymentStatus;

            _context.SaveChanges();

            return billingDto;
        }

        public bool DeleteBilling(int billingId)
        {
            var billing = _context.Billings.Find(billingId);
            if (billing == null) return false;

            _context.Billings.Remove(billing);
            _context.SaveChanges();

            return true;
        }
    }
}

