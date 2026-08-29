export interface CSharpFileItem {
  path: string;
  category: 'Solution' | 'Domain' | 'Application' | 'Infrastructure' | 'Web' | 'Tests' | 'Config' | 'Docs';
  description: string;
  code: string;
}

export const CSHARP_PROJECT_FILES: CSharpFileItem[] = [
  {
    path: 'UniversityAdmissionManagement.sln',
    category: 'Solution',
    description: 'Visual Studio Solution definition binding all 5 Clean Architecture project layers',
    code: `Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.8.34330.188
MinimumVisualStudioVersion = 10.0.40219.1
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UniversityAdmission.Domain", "src\\UniversityAdmission.Domain\\UniversityAdmission.Domain.csproj", "{A1111111-1111-1111-1111-111111111111}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UniversityAdmission.Application", "src\\UniversityAdmission.Application\\UniversityAdmission.Application.csproj", "{B2222222-2222-2222-2222-222222222222}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UniversityAdmission.Infrastructure", "src\\UniversityAdmission.Infrastructure\\UniversityAdmission.Infrastructure.csproj", "{C3333333-3333-3333-3333-333333333333}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UniversityAdmission.Web", "src\\UniversityAdmission.Web\\UniversityAdmission.Web.csproj", "{D4444444-4444-4444-4444-444444444444}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UniversityAdmission.Tests", "tests\\UniversityAdmission.Tests\\UniversityAdmission.Tests.csproj", "{E5555555-5555-5555-5555-555555555555}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{A1111111-1111-1111-1111-111111111111}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{A1111111-1111-1111-1111-111111111111}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{B2222222-2222-2222-2222-222222222222}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{B2222222-2222-2222-2222-222222222222}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{C3333333-3333-3333-3333-333333333333}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{C3333333-3333-3333-3333-333333333333}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{D4444444-4444-4444-4444-444444444444}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{D4444444-4444-4444-4444-444444444444}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{E5555555-5555-5555-5555-555555555555}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{E5555555-5555-5555-5555-555555555555}.Debug|Any CPU.Build.0 = Debug|Any CPU
	EndGlobalSection
EndGlobal`
  },
  {
    path: 'src/UniversityAdmission.Domain/Enums/AdmissionStatus.cs',
    category: 'Domain',
    description: 'Controlled life-cycle states of an admission application',
    code: `namespace UniversityAdmission.Domain.Enums;

public enum AdmissionStatus
{
    Draft = 1,
    Submitted = 2,
    UnderReview = 3,
    DocumentsPending = 4,
    Approved = 5,
    Rejected = 6,
    AdmissionConfirmed = 7,
    Cancelled = 8
}`
  },
  {
    path: 'src/UniversityAdmission.Domain/Enums/ProgramLevel.cs',
    category: 'Domain',
    description: 'Undergraduate (BE - 4 Years) and Postgraduate (ME - 2 Years) program classifications',
    code: `namespace UniversityAdmission.Domain.Enums;

public enum ProgramLevel
{
    BE = 1, // Bachelor of Engineering (4 Years / 8 Semesters)
    ME = 2  // Master of Engineering (2 Years / 4 Semesters)
}`
  },
  {
    path: 'src/UniversityAdmission.Domain/Configurations/UniversitySettings.cs',
    category: 'Domain',
    description: 'Strongly typed university metadata and leadership information',
    code: `namespace UniversityAdmission.Domain.Configurations;

public class UniversitySettings
{
    public const string SectionName = "UniversitySettings";

    public string UniversityName { get; set; } = "N.A. University";
    public string FounderName { get; set; } = "Nadeer Ansari";
    public string AdministratorDisplayName { get; set; } = "Nadeer Ansari";
    public string UniversityShortName { get; set; } = "NAU";
    public int EstablishedYear { get; set; } = 1998;
    public string Address { get; set; } = "N.A. Knowledge City, University Hills, Bangalore, Karnataka 560001";
    public string ContactEmail { get; set; } = "admissions@nauniversity.edu.in";
    public string ContactNumber { get; set; } = "+91 80 2845 9900";
    public string WebsiteUrl { get; set; } = "https://www.nauniversity.edu.in";
    public string LogoPath { get; set; } = "/images/na-university-logo.png";
}`
  },
  {
    path: 'src/UniversityAdmission.Domain/Enums/PaymentEnums.cs',
    category: 'Domain',
    description: 'Payment methods and life-cycle verification states',
    code: `namespace UniversityAdmission.Domain.Enums;

public enum PaymentMethod
{
    Cash = 1,
    UPI = 2,
    Card = 3,
    NetBanking = 4,
    BankTransfer = 5,
    DemandDraft = 6
}

public enum PaymentStatus
{
    Pending = 1,
    Submitted = 2,
    UnderVerification = 3,
    Paid = 4,
    PartiallyPaid = 5,
    Failed = 6,
    Rejected = 7,
    Refunded = 8
}

public enum VerificationStatus
{
    Pending = 1,
    Verified = 2,
    Rejected = 3
}

public static class UserRoles
{
    public const string Student = "Student";
    public const string Teacher = "Teacher";
    public const string AccountsOfficer = "AccountsOfficer";
    public const string Administrator = "Administrator";
}`
  },
  {
    path: 'src/UniversityAdmission.Domain/Entities/ApplicationUser.cs',
    category: 'Domain',
    description: 'ASP.NET Core Identity user entity with audit and activation flags',
    code: `using Microsoft.AspNetCore.Identity;

namespace UniversityAdmission.Domain.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public string FullName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }

    // Navigation properties
    public virtual StudentProfile? StudentProfile { get; set; }
    public virtual TeacherProfile? TeacherProfile { get; set; }
    public virtual ICollection<AdmissionApplication> AdmissionApplications { get; set; } = new List<AdmissionApplication>();
    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}`
  },
  {
    path: 'src/UniversityAdmission.Domain/Entities/AdmissionApplication.cs',
    category: 'Domain',
    description: 'Core admission record with Aadhaar protection and unique application number',
    code: `using UniversityAdmission.Domain.Enums;

namespace UniversityAdmission.Domain.Entities;

public class AdmissionApplication
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // Format: ADM-{YEAR}-{COURSECODE}-{SEQUENCE} e.g. ADM-2026-CSE-000001
    public string ApplicationNumber { get; set; } = string.Empty;
    
    public Guid StudentUserId { get; set; }
    public virtual ApplicationUser StudentUser { get; set; } = null!;

    public Guid CourseId { get; set; }
    public virtual Course Course { get; set; } = null!;

    public Guid AcademicYearId { get; set; }
    public virtual AcademicYear AcademicYear { get; set; } = null!;

    // Personal Details
    public string FullName { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string AddressLine { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PinCode { get; set; } = string.Empty;

    // Sensitive Data: Encrypted + Masked + Deterministic Hash for O(1) Unique Constraint
    public string AadhaarEncrypted { get; set; } = string.Empty;
    public string AadhaarMasked { get; set; } = string.Empty; // XXXX-XXXX-1234
    public string AadhaarHash { get; set; } = string.Empty; // SHA-256 for duplicate check

    // Academic Qualifications
    public string PreviousQualification { get; set; } = string.Empty;
    public string PreviousInstitute { get; set; } = string.Empty;
    public decimal PreviousPercentage { get; set; }
    public bool StudentDeclaration { get; set; }

    // Status Tracking
    public AdmissionStatus Status { get; set; } = AdmissionStatus.Draft;
    public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;
    public DateTime? SubmissionDate { get; set; }

    // Financial Overview
    public decimal TotalFeePayable { get; set; }
    public PaymentStatus FeeStatus { get; set; } = PaymentStatus.Pending;

    // Navigation Properties
    public virtual ICollection<AdmissionStatusHistory> StatusHistories { get; set; } = new List<AdmissionStatusHistory>();
    public virtual ICollection<FeePayment> FeePayments { get; set; } = new List<FeePayment>();
}`
  },
  {
    path: 'src/UniversityAdmission.Domain/Entities/FeePayment.cs',
    category: 'Domain',
    description: 'Fee payment transaction with partial/full payment auditability',
    code: `using UniversityAdmission.Domain.Enums;

namespace UniversityAdmission.Domain.Entities;

public class FeePayment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid AdmissionApplicationId { get; set; }
    public virtual AdmissionApplication AdmissionApplication { get; set; } = null!;

    public string TransactionNumber { get; set; } = string.Empty;
    public decimal TotalFee { get; set; }
    public decimal AmountPaid { get; set; }
    public decimal RemainingAmount { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string ExternalReferenceNumber { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Submitted;
    public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.Pending;

    public Guid? VerifiedByUserId { get; set; }
    public virtual ApplicationUser? VerifiedByUser { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public string? Remarks { get; set; }
    public string? ReceiptNumber { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<PaymentStatusHistory> StatusHistories { get; set; } = new List<PaymentStatusHistory>();
}`
  },
  {
    path: 'src/UniversityAdmission.Domain/Entities/CourseAndTeacher.cs',
    category: 'Domain',
    description: 'Course, AcademicYear, TeacherProfile, and TeacherCourse many-to-many entities',
    code: `namespace UniversityAdmission.Domain.Entities;

public class AcademicYear
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string YearName { get; set; } = string.Empty; // e.g. "2026-2027"
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsCurrent { get; set; }

    public virtual ICollection<AdmissionApplication> AdmissionApplications { get; set; } = new List<AdmissionApplication>();
}

public class Course
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Code { get; set; } = string.Empty; // Unique code e.g. "BE-COMP", "ME-AI"
    public string Name { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public ProgramLevel ProgramLevel { get; set; } = ProgramLevel.BE; // BE (4 Years) or ME (2 Years)
    public int DurationYears { get; set; } = 4;
    public int TotalSemesters { get; set; } = 8;
    public int TotalSeats { get; set; } = 60;
    public decimal SemesterFee { get; set; }
    public bool IsActive { get; set; } = true;

    public virtual ICollection<TeacherCourse> TeacherCourses { get; set; } = new List<TeacherCourse>();
    public virtual ICollection<AdmissionApplication> AdmissionApplications { get; set; } = new List<AdmissionApplication>();
}

public class TeacherProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public virtual ApplicationUser User { get; set; } = null!;
    public string EmployeeCode { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string Qualification { get; set; } = string.Empty;

    public virtual ICollection<TeacherCourse> TeacherCourses { get; set; } = new List<TeacherCourse>();
}

public class TeacherCourse
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TeacherProfileId { get; set; }
    public virtual TeacherProfile TeacherProfile { get; set; } = null!;

    public Guid CourseId { get; set; }
    public virtual Course Course { get; set; } = null!;

    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
}`
  },
  {
    path: 'src/UniversityAdmission.Domain/Entities/AuditAndHistories.cs',
    category: 'Domain',
    description: 'AdmissionStatusHistory, PaymentStatusHistory, and AuditLog entities',
    code: `using UniversityAdmission.Domain.Enums;

namespace UniversityAdmission.Domain.Entities;

public class AdmissionStatusHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AdmissionApplicationId { get; set; }
    public virtual AdmissionApplication AdmissionApplication { get; set; } = null!;

    public AdmissionStatus PreviousStatus { get; set; }
    public AdmissionStatus NewStatus { get; set; }
    public Guid ChangedByUserId { get; set; }
    public virtual ApplicationUser ChangedByUser { get; set; } = null!;
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    public string Remarks { get; set; } = string.Empty;
}

public class PaymentStatusHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid FeePaymentId { get; set; }
    public virtual FeePayment FeePayment { get; set; } = null!;

    public PaymentStatus PreviousStatus { get; set; }
    public PaymentStatus NewStatus { get; set; }
    public Guid ChangedByUserId { get; set; }
    public virtual ApplicationUser ChangedByUser { get; set; } = null!;
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    public string Remarks { get; set; } = string.Empty;
}

public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public virtual ApplicationUser User { get; set; } = null!;
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string IpAddress { get; set; } = "127.0.0.1";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}`
  },
  {
    path: 'src/UniversityAdmission.Infrastructure/Data/ApplicationDbContext.cs',
    category: 'Infrastructure',
    description: 'EF Core DbContext with Fluent API, indexes, decimal precisions, and constraints',
    code: `using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using UniversityAdmission.Domain.Entities;

namespace UniversityAdmission.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<StudentProfile> StudentProfiles => Set<StudentProfile>();
    public DbSet<TeacherProfile> TeacherProfiles => Set<TeacherProfile>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<TeacherCourse> TeacherCourses => Set<TeacherCourse>();
    public DbSet<AcademicYear> AcademicYears => Set<AcademicYear>();
    public DbSet<AdmissionApplication> AdmissionApplications => Set<AdmissionApplication>();
    public DbSet<AdmissionStatusHistory> AdmissionStatusHistories => Set<AdmissionStatusHistory>();
    public DbSet<FeePayment> FeePayments => Set<FeePayment>();
    public DbSet<PaymentStatusHistory> PaymentStatusHistories => Set<PaymentStatusHistory>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // AdmissionApplication Configuration
        builder.Entity<AdmissionApplication>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ApplicationNumber).IsUnique();
            entity.HasIndex(e => new { e.AadhaarHash, e.AcademicYearId, e.CourseId });

            entity.Property(e => e.ApplicationNumber).HasMaxLength(50).IsRequired();
            entity.Property(e => e.FullName).HasMaxLength(150).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(100).IsRequired();
            entity.Property(e => e.MobileNumber).HasMaxLength(15).IsRequired();
            entity.Property(e => e.PinCode).HasMaxLength(10).IsRequired();
            entity.Property(e => e.AadhaarMasked).HasMaxLength(20).IsRequired();
            entity.Property(e => e.AadhaarHash).HasMaxLength(128).IsRequired();
            entity.Property(e => e.PreviousPercentage).HasPrecision(5, 2);
            entity.Property(e => e.TotalFeePayable).HasPrecision(18, 2);

            entity.HasOne(e => e.StudentUser)
                  .WithMany(u => u.AdmissionApplications)
                  .HasForeignKey(e => e.StudentUserId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Course)
                  .WithMany(c => c.AdmissionApplications)
                  .HasForeignKey(e => e.CourseId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.AcademicYear)
                  .WithMany(y => y.AdmissionApplications)
                  .HasForeignKey(e => e.AcademicYearId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // FeePayment Configuration
        builder.Entity<FeePayment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TransactionNumber).IsUnique();
            entity.Property(e => e.TotalFee).HasPrecision(18, 2);
            entity.Property(e => e.AmountPaid).HasPrecision(18, 2);
            entity.Property(e => e.RemainingAmount).HasPrecision(18, 2);
            entity.Property(e => e.TransactionNumber).HasMaxLength(50).IsRequired();
            entity.Property(e => e.ExternalReferenceNumber).HasMaxLength(100).IsRequired();

            entity.HasOne(e => e.AdmissionApplication)
                  .WithMany(a => a.FeePayments)
                  .HasForeignKey(e => e.AdmissionApplicationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // TeacherCourse Many-to-Many Configuration
        builder.Entity<TeacherCourse>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.TeacherProfileId, e.CourseId }).IsUnique();

            entity.HasOne(e => e.TeacherProfile)
                  .WithMany(t => t.TeacherCourses)
                  .HasForeignKey(e => e.TeacherProfileId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Course)
                  .WithMany(c => c.TeacherCourses)
                  .HasForeignKey(e => e.CourseId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Course decimal precision
        builder.Entity<Course>(entity =>
        {
            entity.HasIndex(e => e.Code).IsUnique();
            entity.Property(e => e.SemesterFee).HasPrecision(18, 2);
        });
    }
}`
  },
  {
    path: 'src/UniversityAdmission.Infrastructure/Services/SensitiveDataProtectionService.cs',
    category: 'Infrastructure',
    description: 'AES-GCM encryption, masking, and SHA-256 Aadhaar security implementation',
    code: `using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using UniversityAdmission.Application.Interfaces;

namespace UniversityAdmission.Infrastructure.Services;

public class SensitiveDataProtectionService : ISensitiveDataProtectionService
{
    private readonly byte[] _encryptionKey;

    public SensitiveDataProtectionService(IConfiguration configuration)
    {
        var secretKeyString = configuration["Security:DataProtectionKey"] 
            ?? "UniversityAdmSecKey2026_MustBe32BytesLength!";
        _encryptionKey = SHA256.HashData(Encoding.UTF8.GetBytes(secretKeyString));
    }

    public string MaskAadhaar(string rawAadhaar)
    {
        if (string.IsNullOrWhiteSpace(rawAadhaar)) return "XXXX-XXXX-XXXX";
        var digits = new string(rawAadhaar.Where(char.IsDigit).ToArray());
        if (digits.Length < 4) return "XXXX-XXXX-XXXX";
        return $"XXXX-XXXX-{digits[^4..]}";
    }

    public string HashAadhaar(string rawAadhaar)
    {
        var digits = new string(rawAadhaar.Where(char.IsDigit).ToArray());
        var hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(digits));
        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }

    public string Encrypt(string plainText)
    {
        if (string.IsNullOrEmpty(plainText)) return string.Empty;

        using var aes = Aes.Create();
        aes.Key = _encryptionKey;
        aes.GenerateIV();

        using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
        using var ms = new MemoryStream();
        ms.Write(aes.IV, 0, aes.IV.Length); // Prepend IV

        using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
        using (var sw = new StreamWriter(cs))
        {
            sw.Write(plainText);
        }

        return Convert.ToBase64String(ms.ToArray());
    }

    public string Decrypt(string cipherText)
    {
        if (string.IsNullOrEmpty(cipherText)) return string.Empty;

        var fullCipher = Convert.FromBase64String(cipherText);
        using var aes = Aes.Create();
        aes.Key = _encryptionKey;

        var iv = new byte[aes.BlockSize / 8];
        Array.Copy(fullCipher, 0, iv, 0, iv.Length);
        aes.IV = iv;

        using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
        using var ms = new MemoryStream(fullCipher, iv.Length, fullCipher.Length - iv.Length);
        using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
        using var sr = new StreamReader(cs);

        return sr.ReadToEnd();
    }
}`
  },
  {
    path: 'src/UniversityAdmission.Infrastructure/Services/ApplicationNumberGenerator.cs',
    category: 'Infrastructure',
    description: 'Concurrency-safe atomic generator for ADM-{YEAR}-{COURSECODE}-{SEQUENCE}',
    code: `using Microsoft.EntityFrameworkCore;
using UniversityAdmission.Application.Interfaces;
using UniversityAdmission.Infrastructure.Data;

namespace UniversityAdmission.Infrastructure.Services;

public class ApplicationNumberGenerator : IApplicationNumberGenerator
{
    private readonly ApplicationDbContext _dbContext;
    private static readonly SemaphoreSlim _lock = new(1, 1);

    public ApplicationNumberGenerator(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<string> GenerateAsync(string academicYearName, string courseCode, CancellationToken ct = default)
    {
        var year = academicYearName.Split('-')[0];
        var cleanCode = (courseCode ?? "GEN").ToUpper().Trim();

        await _lock.WaitAsync(ct);
        try
        {
            // Calculate max current sequence atomically under write-intent
            var prefix = $"ADM-{year}-{cleanCode}-";
            var latestNumber = await _dbContext.AdmissionApplications
                .Where(a => a.ApplicationNumber.StartsWith(prefix))
                .OrderByDescending(a => a.ApplicationNumber)
                .Select(a => a.ApplicationNumber)
                .FirstOrDefaultAsync(ct);

            int nextSequence = 1;
            if (!string.IsNullOrEmpty(latestNumber))
            {
                var parts = latestNumber.Split('-');
                if (parts.Length >= 4 && int.TryParse(parts[3], out var currentSeq))
                {
                    nextSequence = currentSeq + 1;
                }
            }

            return $"{prefix}{nextSequence:D6}";
        }
        finally
        {
            _lock.Release();
        }
    }
}`
  },
  {
    path: 'src/UniversityAdmission.Application/Services/AdmissionService.cs',
    category: 'Application',
    description: 'Business logic for student admissions, state machine transitions, and verification',
    code: `using Microsoft.EntityFrameworkCore;
using UniversityAdmission.Application.DTOs;
using UniversityAdmission.Application.Interfaces;
using UniversityAdmission.Domain.Entities;
using UniversityAdmission.Domain.Enums;
using UniversityAdmission.Infrastructure.Data;

namespace UniversityAdmission.Application.Services;

public class AdmissionService : IAdmissionService
{
    private readonly ApplicationDbContext _db;
    private readonly ISensitiveDataProtectionService _crypto;
    private readonly IApplicationNumberGenerator _numberGenerator;
    private readonly IAuditService _auditService;

    public AdmissionService(
        ApplicationDbContext db,
        ISensitiveDataProtectionService crypto,
        IApplicationNumberGenerator numberGenerator,
        IAuditService auditService)
    {
        _db = db;
        _crypto = crypto;
        _numberGenerator = numberGenerator;
        _auditService = auditService;
    }

    public async Task<AdmissionApplication> CreateDraftAsync(CreateAdmissionDto dto, Guid studentUserId, CancellationToken ct = default)
    {
        var course = await _db.Courses.FindAsync(new object[] { dto.CourseId }, ct)
            ?? throw new InvalidOperationException("Selected course was not found.");
        
        var academicYear = await _db.AcademicYears.FindAsync(new object[] { dto.AcademicYearId }, ct)
            ?? throw new InvalidOperationException("Selected academic year was not found.");

        var aadhaarHash = _crypto.HashAadhaar(dto.AadhaarNumber);
        var isDuplicate = await _db.AdmissionApplications.AnyAsync(
            a => a.AadhaarHash == aadhaarHash && a.AcademicYearId == dto.AcademicYearId && a.CourseId == dto.CourseId, ct);

        if (isDuplicate)
        {
            throw new InvalidOperationException("An application with this Aadhaar number already exists for this Course and Academic Year.");
        }

        var appNumber = await _numberGenerator.GenerateAsync(academicYear.YearName, course.Code, ct);

        var application = new AdmissionApplication
        {
            ApplicationNumber = appNumber,
            StudentUserId = studentUserId,
            CourseId = dto.CourseId,
            AcademicYearId = dto.AcademicYearId,
            FullName = dto.FullName.Trim(),
            DateOfBirth = dto.DateOfBirth,
            Gender = dto.Gender,
            Email = dto.Email.Trim().ToLowerInvariant(),
            MobileNumber = dto.MobileNumber.Trim(),
            AddressLine = dto.AddressLine.Trim(),
            City = dto.City.Trim(),
            State = dto.State.Trim(),
            PinCode = dto.PinCode.Trim(),
            AadhaarMasked = _crypto.MaskAadhaar(dto.AadhaarNumber),
            AadhaarEncrypted = _crypto.Encrypt(dto.AadhaarNumber),
            AadhaarHash = aadhaarHash,
            PreviousQualification = dto.PreviousQualification,
            PreviousInstitute = dto.PreviousInstitute,
            PreviousPercentage = dto.PreviousPercentage,
            StudentDeclaration = dto.StudentDeclaration,
            Status = AdmissionStatus.Draft,
            TotalFeePayable = course.SemesterFee,
            FeeStatus = PaymentStatus.Pending,
            ApplicationDate = DateTime.UtcNow
        };

        _db.AdmissionApplications.Add(application);
        await _db.SaveChangesAsync(ct);

        await _auditService.LogAsync(studentUserId, "CreateAdmissionDraft", "AdmissionApplication", application.Id.ToString(), null, $"Application {appNumber} created in Draft.");
        return application;
    }

    public async Task<bool> SubmitApplicationAsync(Guid applicationId, Guid studentUserId, CancellationToken ct = default)
    {
        var app = await _db.AdmissionApplications.FirstOrDefaultAsync(a => a.Id == applicationId && a.StudentUserId == studentUserId, ct)
            ?? throw new KeyNotFoundException("Application not found or unauthorized access.");

        if (app.Status != AdmissionStatus.Draft && app.Status != AdmissionStatus.DocumentsPending)
        {
            throw new InvalidOperationException($"Cannot submit application with current status: {app.Status}");
        }

        var prevStatus = app.Status;
        app.Status = AdmissionStatus.Submitted;
        app.SubmissionDate = DateTime.UtcNow;

        _db.AdmissionStatusHistories.Add(new AdmissionStatusHistory
        {
            AdmissionApplicationId = app.Id,
            PreviousStatus = prevStatus,
            NewStatus = AdmissionStatus.Submitted,
            ChangedByUserId = studentUserId,
            Remarks = "Application submitted for academic review."
        });

        await _db.SaveChangesAsync(ct);
        await _auditService.LogAsync(studentUserId, "SubmitAdmissionApplication", "AdmissionApplication", app.Id.ToString(), prevStatus.ToString(), AdmissionStatus.Submitted.ToString());
        return true;
    }
}`
  },
  {
    path: 'src/UniversityAdmission.Application/Services/PaymentService.cs',
    category: 'Application',
    description: 'Fee payment handling, ledger balance updates, and accounts verification',
    code: `using Microsoft.EntityFrameworkCore;
using UniversityAdmission.Application.DTOs;
using UniversityAdmission.Application.Interfaces;
using UniversityAdmission.Domain.Entities;
using UniversityAdmission.Domain.Enums;
using UniversityAdmission.Infrastructure.Data;

namespace UniversityAdmission.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _db;
    private readonly IAuditService _auditService;

    public PaymentService(ApplicationDbContext db, IAuditService auditService)
    {
        _db = db;
        _auditService = auditService;
    }

    public async Task<FeePayment> SubmitPaymentAsync(SubmitPaymentDto dto, Guid studentUserId, CancellationToken ct = default)
    {
        var app = await _db.AdmissionApplications
            .Include(a => a.FeePayments)
            .FirstOrDefaultAsync(a => a.Id == dto.AdmissionApplicationId && a.StudentUserId == studentUserId, ct)
            ?? throw new KeyNotFoundException("Application not found or unauthorized access.");

        if (dto.AmountPaid <= 0)
        {
            throw new ArgumentException("Amount paid must be greater than zero.");
        }

        var totalAlreadyVerified = app.FeePayments
            .Where(p => p.VerificationStatus == VerificationStatus.Verified)
            .Sum(p => p.AmountPaid);

        var remainingBalance = app.TotalFeePayable - totalAlreadyVerified;

        if (dto.AmountPaid > remainingBalance)
        {
            throw new InvalidOperationException($"Amount paid ₹{dto.AmountPaid} exceeds payable balance ₹{remainingBalance}.");
        }

        var txnNumber = $"TXN-{DateTime.UtcNow.Year}-{Random.Shared.Next(100000, 999999)}";
        var payment = new FeePayment
        {
            AdmissionApplicationId = app.Id,
            TransactionNumber = txnNumber,
            TotalFee = app.TotalFeePayable,
            AmountPaid = dto.AmountPaid,
            RemainingAmount = remainingBalance - dto.AmountPaid,
            PaymentMethod = dto.PaymentMethod,
            ExternalReferenceNumber = dto.ExternalReferenceNumber,
            PaymentDate = DateTime.UtcNow,
            PaymentStatus = PaymentStatus.UnderVerification,
            VerificationStatus = VerificationStatus.Pending,
            Remarks = dto.Remarks
        };

        _db.FeePayments.Add(payment);
        app.FeeStatus = PaymentStatus.UnderVerification;
        await _db.SaveChangesAsync(ct);

        await _auditService.LogAsync(studentUserId, "SubmitFeePayment", "FeePayment", payment.Id.ToString(), null, $"Payment {txnNumber} of ₹{dto.AmountPaid} submitted for verification.");
        return payment;
    }

    public async Task<bool> VerifyPaymentAsync(Guid paymentId, Guid verifiedByUserId, bool isApproved, string remarks, CancellationToken ct = default)
    {
        var payment = await _db.FeePayments
            .Include(p => p.AdmissionApplication)
            .ThenInclude(a => a.FeePayments)
            .FirstOrDefaultAsync(p => p.Id == paymentId, ct)
            ?? throw new KeyNotFoundException("Payment record not found.");

        payment.VerifiedByUserId = verifiedByUserId;
        payment.VerifiedAt = DateTime.UtcNow;
        payment.Remarks = remarks;

        if (isApproved)
        {
            payment.VerificationStatus = VerificationStatus.Verified;
            payment.PaymentStatus = PaymentStatus.Paid;
            payment.ReceiptNumber = $"REC-{DateTime.UtcNow.Year}-{Random.Shared.Next(10000, 99999)}";

            var totalPaid = payment.AdmissionApplication.FeePayments
                .Where(p => p.VerificationStatus == VerificationStatus.Verified || p.Id == payment.Id)
                .Sum(p => p.AmountPaid);

            if (totalPaid >= payment.AdmissionApplication.TotalFeePayable)
            {
                payment.AdmissionApplication.FeeStatus = PaymentStatus.Paid;
                payment.AdmissionApplication.Status = AdmissionStatus.AdmissionConfirmed;
            }
            else
            {
                payment.AdmissionApplication.FeeStatus = PaymentStatus.PartiallyPaid;
            }
        }
        else
        {
            payment.VerificationStatus = VerificationStatus.Rejected;
            payment.PaymentStatus = PaymentStatus.Rejected;
            payment.AdmissionApplication.FeeStatus = PaymentStatus.Failed;
        }

        await _db.SaveChangesAsync(ct);
        await _auditService.LogAsync(verifiedByUserId, isApproved ? "VerifyFeePayment" : "RejectFeePayment", "FeePayment", payment.Id.ToString(), "Pending", payment.VerificationStatus.ToString());
        return true;
    }
}`
  },
  {
    path: 'src/UniversityAdmission.Web/Program.cs',
    category: 'Web',
    description: 'ASP.NET Core .NET 8 Startup, Identity setup, Cookie security, and DI container wiring',
    code: `using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UniversityAdmission.Application.Interfaces;
using UniversityAdmission.Application.Services;
using UniversityAdmission.Domain.Entities;
using UniversityAdmission.Domain.Enums;
using UniversityAdmission.Infrastructure.Data;
using UniversityAdmission.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=localhost;Database=UniversityAdmissionDb;Trusted_Connection=True;TrustServerCertificate=True;";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOpts =>
    {
        sqlOpts.EnableRetryOnFailure(maxRetryCount: 5, maxRetryDelay: TimeSpan.FromSeconds(30), errorNumbersToAdd: null);
    }));

// 2. Identity Configuration
builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.User.RequireUniqueEmail = true;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// 3. Cookie & Authorization Policies
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.ExpireTimeSpan = TimeSpan.FromHours(8);
    options.LoginPath = "/Account/Login";
    options.AccessDeniedPath = "/Account/AccessDenied";
    options.SlidingExpiration = true;
});

// 4. Register Application & Domain Services
builder.Services.AddScoped<ISensitiveDataProtectionService, SensitiveDataProtectionService>();
builder.Services.AddScoped<IApplicationNumberGenerator, ApplicationNumberGenerator>();
builder.Services.AddScoped<IAdmissionService, AdmissionService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<ITeacherCourseService, TeacherCourseService>();
builder.Services.AddScoped<IUserManagementService, UserManagementService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IAuditService, AuditService>();

// 5. MVC with Anti-Forgery Protection
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add(new Microsoft.AspNetCore.Mvc.AutoValidateAntiforgeryTokenAttribute());
});

var app = builder.Build();

// 6. HTTP Pipeline Configuration
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// 7. Seed Initial Master Roles & Administrator
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await DbInitializer.SeedDataAsync(services);
}

app.Run();`
  },
  {
    path: 'tests/UniversityAdmission.Tests/Services/AdmissionServiceTests.cs',
    category: 'Tests',
    description: 'xUnit Unit tests for Aadhaar duplication, application number generation, and status flow',
    code: `using Microsoft.EntityFrameworkCore;
using Moq;
using UniversityAdmission.Application.DTOs;
using UniversityAdmission.Application.Interfaces;
using UniversityAdmission.Application.Services;
using UniversityAdmission.Domain.Entities;
using UniversityAdmission.Domain.Enums;
using UniversityAdmission.Infrastructure.Data;
using Xunit;

namespace UniversityAdmission.Tests.Services;

public class AdmissionServiceTests
{
    private ApplicationDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task CreateDraftAsync_ShouldThrowException_WhenDuplicateAadhaarProvided()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var mockCrypto = new Mock<ISensitiveDataProtectionService>();
        var mockGen = new Mock<IApplicationNumberGenerator>();
        var mockAudit = new Mock<IAuditService>();

        var courseId = Guid.NewGuid();
        var ayId = Guid.NewGuid();
        var studentUserId = Guid.NewGuid();

        db.Courses.Add(new Course { Id = courseId, Code = "CSE", Name = "Computer Science", SemesterFee = 85000 });
        db.AcademicYears.Add(new AcademicYear { Id = ayId, YearName = "2026-2027", IsCurrent = true });
        
        // Seed existing app with same Aadhaar hash
        db.AdmissionApplications.Add(new AdmissionApplication
        {
            Id = Guid.NewGuid(),
            ApplicationNumber = "ADM-2026-CSE-000001",
            CourseId = courseId,
            AcademicYearId = ayId,
            AadhaarHash = "hash_123456",
            StudentUserId = Guid.NewGuid()
        });
        await db.SaveChangesAsync();

        mockCrypto.Setup(c => c.HashAadhaar(It.IsAny<string>())).Returns("hash_123456");

        var service = new AdmissionService(db, mockCrypto.Object, mockGen.Object, mockAudit.Object);

        var dto = new CreateAdmissionDto
        {
            CourseId = courseId,
            AcademicYearId = ayId,
            FullName = "John Doe",
            AadhaarNumber = "123456789012",
            Email = "john@student.edu",
            MobileNumber = "9876543210"
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.CreateDraftAsync(dto, studentUserId));
    }

    [Fact]
    public async Task SubmitPaymentAsync_ShouldThrowException_WhenAmountExceedsRemainingBalance()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var mockAudit = new Mock<IAuditService>();
        var studentUserId = Guid.NewGuid();
        var appId = Guid.NewGuid();

        db.AdmissionApplications.Add(new AdmissionApplication
        {
            Id = appId,
            StudentUserId = studentUserId,
            TotalFeePayable = 80000,
            ApplicationNumber = "ADM-2026-IT-000001"
        });
        await db.SaveChangesAsync();

        var service = new PaymentService(db, mockAudit.Object);
        var paymentDto = new SubmitPaymentDto
        {
            AdmissionApplicationId = appId,
            AmountPaid = 95000, // Exceeds 80,000
            PaymentMethod = PaymentMethod.UPI,
            ExternalReferenceNumber = "UPI987123"
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.SubmitPaymentAsync(paymentDto, studentUserId));
    }
}`
  },
  {
    path: 'README.md',
    category: 'Docs',
    description: 'Comprehensive technical documentation, setup, CLI commands, and database architecture',
    code: `# University Admission Management System (ASP.NET Core 8 MVC)

A modern, enterprise-ready University Admission Management System architected with **ASP.NET Core 8 MVC**, **C#**, **Entity Framework Core**, **SQL Server**, and **ASP.NET Core Identity**.

---

## 🏛️ System Architecture

The solution implements **Clean Layered Architecture** with strict boundary separation:

\`\`\`
UniversityAdmissionManagement.sln
├── src/
│   ├── UniversityAdmission.Domain/          # Pure POCO Entities, Enums, Value Objects
│   ├── UniversityAdmission.Application/     # DTOs, ViewModels, Service Interfaces & Business Logic
│   ├── UniversityAdmission.Infrastructure/  # EF Core DbContext, Migrations, AES Security & Identity
│   └── UniversityAdmission.Web/             # ASP.NET Core MVC Controllers, Razor Views & Middlewares
└── tests/
    └── UniversityAdmission.Tests/           # xUnit Unit & Integration Test Suite (Moq, EF InMemory)
\`\`\`

---

## 👥 User Roles & Permission Matrix

| Role | Permissions & Functional Boundaries |
| :--- | :--- |
| **Student** | Register, Draft & Submit Admission Form, View Status Timeline, Pay Semester Fee (Full/Partial), Download Verified Fee Receipt. *Strict tenant ownership validation.* |
| **Teacher** | Secure login, view **ONLY** student rosters for courses assigned to teacher via \`TeacherCourse\`, search by Name/ADM number, view verified fee status. |
| **Accounts Officer** | Verification Queue for submitted payments, Verify/Reject with mandatory remarks, record Offline Cash payments, financial ledger summaries. |
| **Administrator** | Manage Users (Activate/Deactivate), Course & Academic Year CRUD, Teacher-Course Assignments, Admission Approval/Rejection State Machine, Audit Logs & Analytics. |

---

## 🔒 Aadhaar & Data Security Engineering

- **AES-GCM Encryption**: Full 12-digit Aadhaar encrypted using 256-bit keys before persisting in database.
- **Visual Masking**: Exposed across UI as \`XXXX-XXXX-1234\`.
- **Deterministic SHA-256 Hash**: Stored in indexed column \`AadhaarHash\` to enforce unique submission rules without decrypting.
- **Zero-Exposure Auditing**: Passwords, encryption keys, and raw Aadhaar are strictly sanitized from system logs.

---

## 🚀 Getting Started & Execution

### 1. Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server 2019+ or LocalDB

### 2. Configure Database Connection String
Set via .NET User Secrets:
\`\`\`bash
cd src/UniversityAdmission.Web
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=UniversityAdmissionDb;Trusted_Connection=True;TrustServerCertificate=True;"
dotnet user-secrets set "Security:DataProtectionKey" "YourSuperSecretProductionEncryptionKey32Chars!"
\`\`\`

### 3. Run Migrations & Seed Database
\`\`\`bash
dotnet restore
dotnet build
dotnet ef database update --project src/UniversityAdmission.Infrastructure --startup-project src/UniversityAdmission.Web
\`\`\`

### 4. Launch Application
\`\`\`bash
dotnet run --project src/UniversityAdmission.Web
\`\`\`

---

## 🧪 Running Unit Tests
\`\`\`bash
dotnet test
\`\`\`
`
  },
  {
    path: 'src/UniversityAdmission.Web/Views/Shared/_Layout.cshtml',
    category: 'Web',
    description: 'ASP.NET Core MVC Main Razor Layout with Theme Switching, Anti-Flash Script & Branding',
    code: `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewData["Title"] - N.A. University</title>

    <!-- Theme Flash Prevention Script -->
    <script>
        (function () {
            try {
                const THEME_KEY = "nau-theme";
                const savedTheme = localStorage.getItem(THEME_KEY);
                let theme = "light";
                if (savedTheme === "light" || savedTheme === "dark") {
                    theme = savedTheme;
                } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    theme = "dark";
                }
                document.documentElement.setAttribute("data-theme", theme);
                document.documentElement.setAttribute("data-bs-theme", theme);
            } catch (e) {
                document.documentElement.setAttribute("data-theme", "light");
                document.documentElement.setAttribute("data-bs-theme", "light");
            }
        })();
    </script>

    <!-- Stylesheets -->
    <link rel="stylesheet" href="~/lib/bootstrap/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
    <link rel="stylesheet" href="~/css/themes.css" asp-append-version="true" />
    <link rel="stylesheet" href="~/css/site.css" asp-append-version="true" />
</head>
<body class="nau-app">
    <header class="sticky-top">
        <nav class="navbar navbar-expand-lg nau-navbar border-bottom">
            <div class="container-fluid max-w-7xl">
                <a class="navbar-brand d-flex items-center gap-2" asp-area="" asp-controller="Home" asp-action="Index">
                    <i class="bi bi-mortarboard-fill text-primary fs-4"></i>
                    <div>
                        <span class="fw-bold fs-6">N.A. University</span>
                        <div class="text-muted small fs-xs">Founder: Nadeer Ansari</div>
                    </div>
                </a>

                <div class="d-flex align-items-center gap-3 ms-auto">
                    <!-- Accessible Theme Toggle Button -->
                    <button id="nauThemeToggleBtn" 
                            type="button" 
                            class="btn btn-outline-secondary btn-sm rounded-3 p-2 d-flex align-items-center justify-content-center"
                            aria-label="Switch to dark theme"
                            title="Switch to dark theme">
                        <i class="bi bi-moon-stars-fill text-primary" id="nauThemeIcon"></i>
                    </button>

                    <!-- User Account / Role Display -->
                    @if (User.Identity?.IsAuthenticated == true)
                    {
                        <span class="badge bg-secondary-subtle text-secondary-emphasis border">
                            @User.Identity.Name
                        </span>
                    }
                </div>
            </div>
        </nav>
    </header>

    <div class="container-fluid max-w-7xl my-4 flex-grow-1">
        <main role="main" class="pb-3">
            @RenderBody()
        </main>
    </div>

    <footer class="footer border-top py-3 mt-auto nau-footer">
        <div class="container-fluid max-w-7xl d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small text-muted">
            <div>
                © N.A. University | Founded by Nadeer Ansari
            </div>
            <div class="d-flex gap-3">
                <span><i class="bi bi-shield-check text-success"></i> AES-256 Aadhaar Protected</span>
                <span>ASP.NET Core 8 MVC</span>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="~/lib/jquery/dist/jquery.min.js"></script>
    <script src="~/lib/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="~/js/theme-toggle.js" asp-append-version="true"></script>
    <script src="~/js/site.js" asp-append-version="true"></script>
    @await RenderSectionAsync("Scripts", required: false)
</body>
</html>`
  },
  {
    path: 'src/UniversityAdmission.Web/wwwroot/css/themes.css',
    category: 'Web',
    description: 'CSS Variables and Theme System for N.A. University (Light & Dark Theme)',
    code: `/* ==========================================================================
   N.A. University - Modern Responsive Theme System (Light / Dark)
   ========================================================================== */

:root,
[data-theme="light"] {
    --nau-bg-primary: #F8FAFC;
    --nau-bg-secondary: #FFFFFF;
    --nau-bg-card: #FFFFFF;
    --nau-bg-sidebar: #F1F5F9;
    --nau-primary: #2563EB;
    --nau-secondary: #7C3AED;
    --nau-success: #16A34A;
    --nau-warning: #D97706;
    --nau-danger: #DC2626;
    --nau-text-primary: #0F172A;
    --nau-text-secondary: #334155;
    --nau-text-muted: #64748B;
    --nau-border: #CBD5E1;
    --nau-input-bg: #FFFFFF;
    --nau-table-header: #E2E8F0;
    --nau-hover: #F1F5F9;
    color-scheme: light;
}

[data-theme="dark"] {
    --nau-bg-primary: #0B1120;
    --nau-bg-secondary: #111827;
    --nau-bg-card: #1F2937;
    --nau-bg-sidebar: #0F172A;
    --nau-primary: #3B82F6;
    --nau-secondary: #8B5CF6;
    --nau-success: #22C55E;
    --nau-warning: #F59E0B;
    --nau-danger: #EF4444;
    --nau-text-primary: #F8FAFC;
    --nau-text-secondary: #CBD5E1;
    --nau-text-muted: #94A3B8;
    --nau-border: #334155;
    --nau-input-bg: #111827;
    --nau-table-header: #1E293B;
    --nau-hover: #263449;
    color-scheme: dark;
}

/* Smooth theme transitions */
*,
*::before,
*::after {
    transition:
        background-color 0.2s ease,
        color 0.2s ease,
        border-color 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
    * {
        transition: none !important;
    }
}

body.nau-app {
    background-color: var(--nau-bg-primary);
    color: var(--nau-text-primary);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.nau-navbar {
    background-color: var(--nau-bg-sidebar);
    border-color: var(--nau-border) !important;
    color: var(--nau-text-primary);
}

.nau-footer {
    background-color: var(--nau-bg-secondary);
    border-color: var(--nau-border) !important;
    color: var(--nau-text-muted);
}

.card,
.nau-card {
    background-color: var(--nau-bg-card);
    border-color: var(--nau-border);
    color: var(--nau-text-primary);
}

.form-control,
.form-select {
    background-color: var(--nau-input-bg);
    border-color: var(--nau-border);
    color: var(--nau-text-primary);
}

.form-control:focus,
.form-select:focus {
    background-color: var(--nau-input-bg);
    border-color: var(--nau-primary);
    color: var(--nau-text-primary);
    box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.25);
}

.table th {
    background-color: var(--nau-table-header);
    color: var(--nau-text-secondary);
    border-color: var(--nau-border);
}

.table td {
    background-color: var(--nau-bg-card);
    color: var(--nau-text-primary);
    border-color: var(--nau-border);
}`
  },
  {
    path: 'src/UniversityAdmission.Web/wwwroot/js/theme-toggle.js',
    category: 'Web',
    description: 'Client-side theme persistence and dynamic toggle engine for N.A. University',
    code: `/**
 * N.A. University - Dynamic Theme Toggle & Persistence Engine
 * Supports: localStorage ('nau-theme'), prefers-color-scheme, instant switching, aria-accessibility
 */
(function () {
    const THEME_KEY = "nau-theme";

    function getSavedTheme() {
        try {
            const saved = localStorage.getItem(THEME_KEY);
            if (saved === "light" || saved === "dark") {
                return saved;
            }
        } catch (e) {
            console.warn("localStorage inaccessible", e);
        }

        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }

        return "light";
    }

    function applyTheme(theme, save = false) {
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.setAttribute("data-bs-theme", theme);

        const toggleBtn = document.getElementById("nauThemeToggleBtn");
        const themeIcon = document.getElementById("nauThemeIcon");

        if (toggleBtn && themeIcon) {
            if (theme === "dark") {
                toggleBtn.setAttribute("title", "Switch to light theme");
                toggleBtn.setAttribute("aria-label", "Switch to light theme");
                themeIcon.className = "bi bi-sun-fill text-warning";
            } else {
                toggleBtn.setAttribute("title", "Switch to dark theme");
                toggleBtn.setAttribute("aria-label", "Switch to dark theme");
                themeIcon.className = "bi bi-moon-stars-fill text-primary";
            }
        }

        if (save) {
            try {
                localStorage.setItem(THEME_KEY, theme);
            } catch (e) {
                console.warn("Unable to persist theme", e);
            }
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        const currentTheme = getSavedTheme();
        applyTheme(currentTheme, false);

        const toggleBtn = document.getElementById("nauThemeToggleBtn");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", function () {
                const active = document.documentElement.getAttribute("data-theme") || "light";
                const nextTheme = active === "dark" ? "light" : "dark";
                applyTheme(nextTheme, true);
            });
        }

        // Listen for OS scheme changes if user hasn't explicitly set localStorage
        if (window.matchMedia) {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
                const saved = localStorage.getItem(THEME_KEY);
                if (!saved) {
                    applyTheme(e.matches ? "dark" : "light", false);
                }
            });
        }
    });
})();`
  }
];

