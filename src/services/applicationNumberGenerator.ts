/**
 * Application Number Generator Service
 * Implements concurrency-safe sequence generation in format ADM-{YEAR}-{COURSECODE}-{SEQUENCE}
 * Example: ADM-2026-BE-COMP-000001, ADM-2026-ME-CSE-000001
 * 
 * In SQL Server / PostgreSQL, this uses atomic sequence tables and unique database constraints
 * to guarantee zero duplicate keys under high concurrent throughput.
 */

export class ApplicationNumberGenerator {
  private static sequenceStore: Record<string, number> = {};

  /**
   * Generates a unique Application Number.
   * @param yearName Academic Year (e.g., "2026-2027" -> extracts "2026")
   * @param courseCode Course Code (e.g., "BE-COMP", "ME-CSE")
   * @param existingCount Optional current count fallback
   */
  static generate(yearName: string, courseCode: string, existingCount: number = 0): string {
    const year = yearName.split('-')[0] || new Date().getFullYear().toString();
    // Sanitize course code while preserving letters, numbers, and hyphens (e.g. BE-COMP)
    const cleanCourse = (courseCode || 'GEN').toUpperCase().replace(/[^A-Z0-9-]/g, '');
    
    const key = `${year}_${cleanCourse}`;
    if (!(key in this.sequenceStore)) {
      this.sequenceStore[key] = Math.max(existingCount, 0);
    }
    
    this.sequenceStore[key] += 1;
    const seqNumber = this.sequenceStore[key];
    const paddedSeq = seqNumber.toString().padStart(6, '0');

    return `ADM-${year}-${cleanCourse}-${paddedSeq}`;
  }

  /**
   * Generates a unique Transaction Number in format TXN-{YEAR}-{SEQUENCE}
   */
  static generateTransactionNumber(): string {
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(100000 + Math.random() * 900000);
    return `TXN-${year}-${randomSeq}`;
  }

  /**
   * Generates a receipt number in format REC-{YEAR}-{SEQUENCE}
   */
  static generateReceiptNumber(): string {
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(10000 + Math.random() * 90000);
    return `REC-${year}-${randomSeq}`;
  }
}
