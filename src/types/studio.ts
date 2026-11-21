export type RoutePath =
  | '/'
  | '/services'
  | '/portfolio'
  | '/packages'
  | '/about'
  | '/contact'
  | '/book-consultation'
  | '/ask-question'
  | '/demo-studio';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  requirementKey: string;
  description: string;
  deliverables: string[];
  estimatedDuration: string;
  illustrativeStarting: string;
  image: string;
  imageAlt: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  location: string;
  society: string;
  category:
    | 'Living & Dining'
    | 'Modular Kitchen'
    | 'Complete Home Interiors'
    | 'Bedroom & Wardrobe'
    | 'Custom Furniture';
  areaSqFt: string;
  projectTypeLabel: string;
  budgetBand: string;
  summary: string;
  materials: string[];
  designHighlight: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
  isIllustrativeSample: boolean;
}

export interface PackageTier {
  id: string;
  name: string;
  tagline: string;
  idealFor: string;
  illustrativePrice: string;
  budgetBandValue: string;
  estimatedTimelineNote: string;
  highlighted?: boolean;
  includes: string[];
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface MaterialSwatch {
  id: string;
  name: string;
  origin: string;
  finish: string;
  application: string;
  swatchHex: string;
  grainNote: string;
}

export interface FloorPlanHotspot {
  id: string;
  xPercent: number;
  yPercent: number;
  zone: string;
  title: string;
  dimensions: string;
  specification: string;
  materialNote: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  residence: string;
  projectType: string;
  challenge: string;
  approach: string;
  quote: string;
  isIllustrativeSample: boolean;
}

export interface EnquiryPrefill {
  service?: string;
  budget?: string;
  packageName?: string;
}

export interface EnquiryPayload {
  customerName: string;
  mobileNumber: string;
  email?: string;
  propertyType: string;
  propertyLocation: string;
  propertyStatus: string;
  requirements: string[];
  selectedPackage?: string;
  estimatedBudget: string;
  expectedStartDate: string;
  preferredConsultDate: string;
  preferredConsultTime: string;
  consultationMode: string;
  additionalRequirements: string;
  contactConsent: boolean;
  mode: 'live' | 'demo';
  honeypot?: string;
}

export interface EnquirySubmissionResponse {
  ok: boolean;
  leadId?: string;
  storageStatus: 'google_sheets_live' | 'google_sheets_demo' | 'unconfigured_preview';
  persistedToGoogleSheets: boolean;
  emailAutomationStatus: 'triggered' | 'disabled_in_demo' | 'not_configured' | 'skipped';
  submittedAt: string;
  message: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export interface QueryPayload {
  customerName: string;
  contactDetails: string;
  queryCategory: string;
  question: string;
  contactConsent: boolean;
  mode: 'live' | 'demo';
  honeypot?: string;
}

export interface QuerySubmissionResponse {
  ok: boolean;
  queryId?: string;
  storageStatus: 'google_sheets_live' | 'google_sheets_demo' | 'unconfigured_preview';
  persistedToGoogleSheets: boolean;
  emailAutomationStatus: 'triggered' | 'disabled_in_demo' | 'not_configured' | 'skipped';
  submittedAt: string;
  message: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export type LeadStatus =
  | 'New Lead'
  | 'Contacted'
  | 'Consultation Scheduled'
  | 'Site Visit Done'
  | 'Quotation Shared'
  | 'Negotiation'
  | 'Converted'
  | 'Lost';

export type QueryStatus = 'Pending' | 'In Review' | 'Resolved';

export interface DemoLeadRecord {
  leadId: string;
  submittedDate: string;
  customerName: string;
  mobileMasked: string;
  emailMasked: string;
  propertyType: string;
  locationSociety: string;
  propertyStatus: string;
  requirements: string[];
  budgetBand: string;
  estimatedValueInr: number;
  actualConvertedInr: number;
  leadStatus: LeadStatus;
  followUpDate: string;
  assignedDesigner: string;
  ownerRemarks: string;
  isSynthetic: true;
}

export interface DemoQueryRecord {
  queryId: string;
  submittedDate: string;
  customerName: string;
  contactMasked: string;
  category: string;
  question: string;
  status: QueryStatus;
  assignedPerson: string;
  resolutionNotes: string;
  isSynthetic: true;
}
