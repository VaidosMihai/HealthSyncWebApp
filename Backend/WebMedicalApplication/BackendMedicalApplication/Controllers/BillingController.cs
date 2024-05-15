using BackendMedicalApplication.DTo;
using BackendMedicalApplication.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BackendMedicalApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class BillingController : ControllerBase
    {
        private readonly IBillingService _billingService;

        public BillingController(IBillingService billingService)
        {
            _billingService = billingService;
        }

        [HttpGet]
        public IActionResult GetAllBillingRecords()
        {
            var billings = _billingService.GetAllBillings();
            return Ok(billings);
        }

        [HttpGet("{billingId}")]
        public IActionResult GetBillingRecordById(int billingId)
        {
            var billing = _billingService.GetBillingById(billingId);
            if (billing == null)
            {
                return NotFound($"Billing record with ID {billingId} not found.");
            }
            return Ok(billing);
        }

        [HttpPost]
        public IActionResult CreateBillingRecord([FromBody] BillingDto billingDto)
        {
            var newBilling = _billingService.CreateBilling(billingDto);
            // Assuming CreateBilling returns the created BillingDto including its ID
            return CreatedAtAction(nameof(GetBillingRecordById), new { billingId = newBilling.PatientId }, newBilling);
        }

        [HttpPut("{billingId}")]
        public IActionResult UpdateBillingRecord(int billingId, [FromBody] BillingDto billingDto)
        {
            var updatedBilling = _billingService.UpdateBilling(billingId, billingDto);
            if (updatedBilling == null)
            {
                return NotFound($"Billing record with ID {billingId} not found.");
            }
            return Ok(updatedBilling);
        }

        [HttpDelete("{billingId}")]
        public IActionResult DeleteBillingRecord(int billingId)
        {
            var result = _billingService.DeleteBilling(billingId);
            if (!result)
            {
                return NotFound($"Billing record with ID {billingId} not found.");
            }
            return NoContent(); // Standard response for a successful delete operation
        }

        // Additional endpoints as needed
    }

}
