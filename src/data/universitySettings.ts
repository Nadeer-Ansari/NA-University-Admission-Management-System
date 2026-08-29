import { UniversitySettings } from '../types';

/**
 * Global University Settings Configuration
 * Configured for N.A. University founded by Nadeer Ansari.
 * Fields like establishedYear, address, contact email, and phone number are configurable.
 */
export const UNIVERSITY_SETTINGS: UniversitySettings = {
  universityName: 'N.A. University',
  founderName: 'Nadeer Ansari',
  administratorDisplayName: 'Nadeer Ansari',
  universityShortName: 'NAU',
  establishedYear: '', // Configurable - no unsupported claims
  address: 'University Campus, Higher Education Zone', // Configurable
  contactEmail: 'admissions@nauniversity.edu', // Configurable
  contactNumber: '+91 98765 43210', // Configurable
  websiteUrl: 'https://nauniversity.edu', // Configurable
  logoPath: '/images/na-university-logo.png',
};
