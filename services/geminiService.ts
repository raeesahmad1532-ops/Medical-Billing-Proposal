
import { GoogleGenAI, Type } from "@google/genai";
import { PracticeInfo, ProposalSettings } from "../types";

export const generateProposalContent = async (
  practice: PracticeInfo,
  settings: ProposalSettings
) => {
  // Correctly initialize GoogleGenAI with the required named parameter and environment variable.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const isBilling = settings.serviceType === 'Medical Billing Only' || settings.serviceType === 'Both Services';
  const isCred = settings.serviceType === 'Credentialing Only' || settings.serviceType === 'Both Services';

  const billingPricing = settings.billingModel === 'Percentage of Collections' 
    ? `${settings.commissionPercentage}% of Collections`
    : `$${settings.flatMonthlyFee.toLocaleString()} Flat Monthly Fee`;

  // Aggressive logic: 50% revenue unlock
  const potentialGain = practice.monthlyVolume * 0.50;

  const prompt = `You are a world-class RCM (Revenue Cycle Management) Strategist. 
  Generate a professional, highly-organized clinical business proposal for ${practice.practiceName}.
  
  CORE SALES THESIS: By reducing current denials by 90%, we unlock a 50% revenue boost ($${potentialGain.toLocaleString()} monthly optimization).
  Target KPIs: 98% Clean Claim Rate, Reduction of Days in A/R to <35 days.
  Security: 256-bit HIPAA encryption.
  
  Service Mode: ${settings.serviceType}

  CRITICAL FORMATTING RULES:
  - Use very short paragraphs (1-3 sentences maximum).
  - Use punchy, professional clinical language.
  - Break text into scannable, modular sections.

  REQUIRED SECTIONS IN JSON:
  1. executiveSummary: Persuasive, modular strategy summary. Focus on the 50% revenue recovery transition.
  2. scopeOfServices: Detailed clinical and administrative workflows.
  3. valueProps: Array of 4 high-impact benefit statements including the 90% denial reduction goal.
  4. hipaaCompliance: Details on security and data integrity protocols.
  5. expectedKPIs: Specific performance benchmarks.
  6. investmentBreakdown: Final cost summary for ${billingPricing}.
  7. operationalExcellence: A section describing how you handle technology and human audits.
  8. clientSuccessStory: A short, anonymous vignette of a similar success.
  9. onboardingTimeline: Exactly 4 phases titled: "Discovery (Days 1-3)", "Integration (Week 1)", "Validation (Week 2)", and "Go-Live (Day 15-30)". 
     For each phase, provide:
     - phase: Title
     - duration: Specific duration string
     - description: High-level overview (2 sentences)
     - milestones: Array of 3-4 granular, specific tasks.
  10. payerList: If credentialing is involved, list how we approach ${settings.selectedPayers.join(', ')}.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          scopeOfServices: { type: Type.STRING },
          valueProps: { type: Type.ARRAY, items: { type: Type.STRING } },
          hipaaCompliance: { type: Type.STRING },
          expectedKPIs: { type: Type.STRING },
          investmentBreakdown: { type: Type.STRING },
          operationalExcellence: { type: Type.STRING },
          clientSuccessStory: { type: Type.STRING },
          payerList: { type: Type.STRING },
          onboardingTimeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                duration: { type: Type.STRING },
                description: { type: Type.STRING },
                milestones: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["phase", "duration", "description", "milestones"]
            }
          }
        },
        required: ["executiveSummary", "scopeOfServices", "valueProps", "hipaaCompliance", "expectedKPIs", "investmentBreakdown", "onboardingTimeline"]
      },
    },
  });

  const jsonStr = response.text?.trim();
  if (!jsonStr) {
    throw new Error("No response content generated from the model.");
  }
  return JSON.parse(jsonStr);
};
