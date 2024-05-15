using System.ComponentModel.DataAnnotations;

namespace BackendMedicalApplication.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }
        public string Name { get; set; } // e.g., "Patient", "Doctor", "Admin"
    }

}
