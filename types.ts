
export type ServiceType = 'Medical Billing Only' | 'Credentialing Only' | 'Both Services';
export type BillingModel = 'Percentage of Collections' | 'Flat Monthly Fee';

export interface PracticeInfo {
  practiceName: string;
  providerName: string;
  email: string;
  specialty: string;
  monthlyVolume: number;
  currentDenialRate: number;
}

export interface ProposalSettings {
  serviceType: ServiceType;
  billingModel: BillingModel;
  commissionPercentage: number;
  flatMonthlyFee: number;
  selectedPayers: string[];
}

export interface OnboardingStep {
  phase: string;
  duration: string;
  description: string;
  milestones: string[];
}

export interface GeneratedProposal {
  executiveSummary: string;
  scopeOfServices: string;
  hipaaCompliance: string;
  expectedKPIs: string;
  investmentBreakdown: string;
  payerList: string;
  onboardingTimeline: OnboardingStep[];
  valueProps: string[];
  operationalExcellence: string;
  clientSuccessStory: string;
}
