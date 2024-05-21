using WebMedicalApplication.Models;
using BackendMedicalApplication.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace BackendMedicalApplication
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
        {
            if (options is null)
            {
                throw new ArgumentNullException(nameof(options));
            }
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<PatientRecord> PatientRecords { get; set; }
        public DbSet<Billing> Billings { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<ReviewVote> ReviewVotes { get; set; }
        public DbSet<ContactFormSubmission> ContactFormSubmissions { get; set; }
        public virtual ICollection<Appointment> DoctorAppointments { get; set; }
        public virtual ICollection<Appointment> PatientAppointments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Billing>(entity =>
            {
                entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)"); // or whatever precision and scale is appropriate
            });

            // User and Appointments (One-to-Many)

            modelBuilder.Entity<Appointment>()
                .HasOne<User>(a => a.Doctor)
                .WithMany(u => u.DoctorAppointments)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .HasOne<User>(a => a.Patient)
                .WithMany(u => u.PatientAppointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            // User and MedicalRecords (One-to-Many)
            modelBuilder.Entity<PatientRecord>()
                .HasOne<User>(mr => mr.Patient)
                .WithMany(p => p.MedicalRecords)
                .HasForeignKey(mr => mr.PatientId);

            // User and Billing (One-to-Many)
            modelBuilder.Entity<Billing>()
                .HasOne<User>(b => b.Patient)
                .WithMany(p => p.Billings)
                .HasForeignKey(b => b.PatientId);

            // User and Schedules (One-to-Many)

            modelBuilder.Entity<Schedule>()
                .HasOne<User>(s => s.Doctor)
                .WithMany(d => d.Schedules)
                .HasForeignKey(s => s.DoctorId);

            // Unique indices and additional configurations for User
            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Username).IsRequired().HasMaxLength(256);
                entity.Property(e => e.Password).IsRequired();
                entity.Property(e => e.EmailAddress).IsRequired().HasMaxLength(256);
                entity.Property(e => e.ResetPasswordCode).HasMaxLength(6);
                entity.Property(e => e.ResetPasswordCodeExpires).HasColumnType("datetime2");

                // Unique constraints
                entity.HasIndex(u => u.EmailAddress).IsUnique();
                entity.HasIndex(u => u.ResetPasswordCode).IsUnique(false);  // Non-unique index for potentially faster lookups

                // Foreign key for Role
                entity.HasOne(u => u.Role)
                      .WithMany()
                      .HasForeignKey(u => u.RoleId)
                      .OnDelete(DeleteBehavior.Restrict); // Consider appropriate delete behavior
            });

            modelBuilder.Entity<ReviewVote>().HasIndex(rv => new { rv.ReviewId, rv.UserId }).IsUnique();

            modelBuilder.Entity<ContactFormSubmission>().ToTable("ContactFormSubmissions");
        }
    }
}
