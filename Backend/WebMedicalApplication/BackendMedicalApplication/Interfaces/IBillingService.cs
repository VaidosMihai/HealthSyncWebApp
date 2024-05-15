using BackendMedicalApplication.DTo;

namespace BackendMedicalApplication.Interfaces
{
    public interface IBillingService
    {
        IEnumerable<BillingDto> GetAllBillings();
        BillingDto GetBillingById(int billingId);
        BillingDto CreateBilling(BillingDto billingDto);
        BillingDto UpdateBilling(int billingId, BillingDto billingDto);
        bool DeleteBilling(int billingId);
    }
}
