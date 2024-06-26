﻿using WebMedicalApplication.Models;
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

            modelBuilder.Entity<PatientRecord>()
                .HasOne<User>(mr => mr.Patient)
                .WithMany(p => p.MedicalRecords)
                .HasForeignKey(mr => mr.PatientId);

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Username).IsRequired().HasMaxLength(256);
                entity.Property(e => e.Password).IsRequired();
                entity.Property(e => e.EmailAddress).IsRequired().HasMaxLength(256);
                entity.Property(e => e.ResetPasswordCode).HasMaxLength(6);
                entity.Property(e => e.ResetPasswordCodeExpires).HasColumnType("datetime2");
                entity.Property(e => e.VerificationToken).HasMaxLength(100).IsUnicode(false);
                entity.Property(e => e.VerificationTokenExpires).IsUnicode(false);
                entity.Property(e => e.IsVerified).HasDefaultValue(false);
                entity.Property(e => e.Description).HasMaxLength(1000);

                entity.HasIndex(u => u.EmailAddress).IsUnique();
                entity.HasIndex(u => u.ResetPasswordCode).IsUnique(false);

                entity.HasOne(u => u.Role)
                      .WithMany()
                      .HasForeignKey(u => u.RoleId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<User>()
                        .HasIndex(u => u.CNP)
                        .IsUnique();

            modelBuilder.Entity<ReviewVote>().HasIndex(rv => new { rv.ReviewId, rv.UserId }).IsUnique();

            modelBuilder.Entity<ContactFormSubmission>().ToTable("ContactFormSubmissions");
        }
    }
}
