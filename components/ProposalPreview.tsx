import React, { useState } from 'react';
import { GeneratedProposal, PracticeInfo, ProposalSettings } from '../types';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface Props {
  proposal: GeneratedProposal;
  practice: PracticeInfo;
  settings: ProposalSettings;
}

const ProposalPreview: React.FC<Props> = ({ proposal, practice, settings }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const isBilling = settings.serviceType === 'Medical Billing Only' || settings.serviceType === 'Both Services';
  const isCred = settings.serviceType === 'Credentialing Only' || settings.serviceType === 'Both Services';

  // New aggressive calculations: 50% revenue boost
  const monthlyRevenue = practice.monthlyVolume;
  const optimizationLift = 0.50; // 50% boost
  const optimizedMonthly = monthlyRevenue * (1 + optimizationLift);
  const annualGain = (optimizedMonthly - monthlyRevenue) * 12;

  const handleDownload = async () => {
    const element = document.getElementById('proposal-printable-content');
    if (!element) return;
    setIsDownloading(true);
    const options = {
      margin: 0,
      filename: `UrgentRCM_Proposal_${practice.practiceName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg' as const, quality: 1.0 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 1200 },
      jsPDF: { unit: 'pt' as const, format: 'a4' as const, orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    try {
      await html2pdf().set(options).from(element).save();
    } catch (err) {
      alert('PDF Generation failed. Please try Print.');
    } finally {
      setIsDownloading(false);
    }
  };

  const SectionHeader = ({ title, subtitle, icon }: { title: string, subtitle?: string, icon?: React.ReactNode }) => (
    <div className="mb-10 space-y-4">
      <div className="flex items-center gap-4">
        {icon && <div className="text-primary transform scale-110">{icon}</div>}
        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{title}</h3>
      </div>
      {subtitle && <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{subtitle}</p>}
    </div>
  );

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 flex flex-col max-h-[850px]">
      {/* Control Bar */}
      <div className="no-print bg-white border-b border-slate-100 p-5 flex justify-end gap-3 shrink-0 z-50">
        <button 
          onClick={handleDownload} 
          disabled={isDownloading}
          className="px-6 py-2.5 bg-secondary text-white rounded-xl font-bold text-xs shadow-md hover:brightness-110 transition-all disabled:opacity-50"
        >
          {isDownloading ? 'PREPARING PDF...' : 'DOWNLOAD PDF'}
        </button>
        <button 
          onClick={() => window.print()} 
          className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-xs shadow-md hover:brightness-110 transition-all"
        >
          PRINT
        </button>
      </div>

      <div className="overflow-y-auto overflow-x-hidden scroll-smooth flex-1 bg-white">
        {/* Main Proposal Container with updated generous padding */}
        <div id="proposal-printable-content" className="bg-white min-h-full p-6 md:pt-16 md:px-12 md:pb-12 relative">
          <div className="absolute top-0 left-0 h-2 bg-primary w-full"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-slate-100 rounded text-[10px] font-black tracking-widest text-slate-500 uppercase">
                Official Service Proposal
              </div>
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.8] text-slate-900">
                Urgent RCM
              </h1>
              <p className="text-lg font-bold text-primary italic tracking-tight">Financial & Operational Logistics</p>
            </div>
            <div className="md:text-right border-l-4 md:border-l-0 md:border-r-4 border-slate-100 pl-6 md:pl-0 md:pr-6 py-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Practice Partner</p>
              <p className="text-2xl font-black text-slate-900 break-words max-w-[250px]">{practice.practiceName}</p>
              <p className="text-xs font-bold text-secondary mt-1">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="space-y-12">
            {/* REVENUE RECOVERY ENGINE section */}
            <section className="border-b border-slate-100 pb-12 space-y-8">
              <SectionHeader 
                title="Executive Strategy" 
                subtitle="Aggressive Revenue Optimization" 
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
              />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-6 space-y-6">
                  <div className="whitespace-pre-wrap break-words text-gray-700 leading-relaxed font-medium text-base normal-case">
                    {proposal.executiveSummary}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {proposal.valueProps.map((prop, i) => (
                      <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 h-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded flex items-center justify-center font-black text-xs shrink-0">✓</div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Performance Value</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800 normal-case leading-snug">{prop}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-6">
                  {/* Revenue Recovery Engine Card */}
                  <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl space-y-8 h-auto break-words overflow-hidden w-full border border-white/5">
                    <div className="space-y-2">
                      <p className="text-[12px] font-black text-primary uppercase tracking-[0.4em]">REVENUE RECOVERY ENGINE</p>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed break-words">
                        By reducing your current denial rate by 90%, we can unlock up to 50% more revenue from your existing volume.
                      </p>
                    </div>
                    
                    <div className="space-y-6 pt-6 border-t border-white/10">
                      <div className="flex flex-col gap-1 opacity-70">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Baseline Monthly Revenue</span>
                        <span className="text-lg font-black text-white whitespace-nowrap">${monthlyRevenue.toLocaleString()}</span>
                      </div>
                      
                      <div className="bg-emerald-500/10 p-6 rounded-[1.5rem] border border-emerald-500/20 flex flex-col gap-2">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Optimized Monthly Potential</p>
                        <p className="text-4xl font-black text-emerald-400 tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">
                          ${optimizedMonthly.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded">UP 50%</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 pt-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Projected Annual Impact</span>
                        <span className="text-2xl font-black text-white whitespace-nowrap tracking-tighter">
                          +${annualGain.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Scope of Work */}
            <section className="border-b border-slate-100 pb-12 space-y-6">
              <SectionHeader title="Operational Scope" subtitle="End-to-End Clinical Lifecycle" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/20 pb-3">Service Deliverables</h4>
                  <div className="whitespace-normal break-words text-gray-600 leading-relaxed text-sm normal-case">
                    {proposal.scopeOfServices}
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-xs font-black text-secondary uppercase tracking-widest border-b border-secondary/20 pb-3">Security & Compliance</h4>
                  <div className="whitespace-normal break-words text-gray-600 leading-relaxed text-sm normal-case">
                    {proposal.hipaaCompliance}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <div className="flex-1 flex flex-col bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                      <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Encryption</span>
                      <span className="text-xs font-black text-slate-900">256-BIT SSL</span>
                    </div>
                    <div className="flex-1 flex flex-col bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                      <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Standard</span>
                      <span className="text-xs font-black text-slate-900">HIPAA CERT</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* KPI Benchmarks */}
            <section className="border-b border-slate-100 pb-12 space-y-6">
              <SectionHeader title="KPI Benchmarks" subtitle="Guaranteed Outcomes" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary p-6 rounded-[1.5rem] text-white shadow-lg flex flex-col gap-6">
                  <div className="whitespace-pre-wrap break-words italic text-white/90 font-bold text-sm leading-relaxed mb-2">
                    {proposal.expectedKPIs}
                  </div>
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">First-Pass Rate</span>
                      <span className="text-2xl font-black text-white whitespace-nowrap">98.2%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Days in A/R</span>
                      <span className="text-2xl font-black text-white whitespace-nowrap">&lt; 35</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-200 flex flex-col justify-center gap-4">
                   <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Case Validation</h4>
                   <div className="whitespace-normal break-words italic text-slate-700 leading-relaxed font-semibold text-sm border-l-4 border-primary pl-6">
                      "{proposal.clientSuccessStory}"
                   </div>
                </div>
              </div>
            </section>

            {/* Onboarding Timeline */}
            <section className="border-b border-slate-100 pb-12 space-y-8">
              <SectionHeader title="Onboarding Timeline" subtitle="Implementation Roadmap" />
              <div className="border-l-4 border-secondary ml-4 pl-6 space-y-8">
                {proposal.onboardingTimeline.map((step, idx) => (
                  <div key={idx} className="mb-6">
                    <h4 className="text-lg font-black text-slate-900 break-words whitespace-normal uppercase leading-tight mb-2">
                      {step.phase}
                    </h4>
                    <p className="text-sm font-medium text-slate-500 break-words whitespace-normal leading-relaxed mb-3">
                      {step.description}
                    </p>
                    {step.milestones && step.milestones.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {step.milestones.map((m, mIdx) => (
                          <span key={mIdx} className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-600 rounded uppercase tracking-tighter">
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Investment */}
            <section className="pb-12 space-y-6">
              <SectionHeader title="Investment" subtitle="Value-Based Pricing" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/10 flex flex-col gap-6 h-auto overflow-hidden w-full">
                  <div className="whitespace-pre-wrap break-words text-slate-900 text-sm font-bold leading-relaxed italic normal-case">
                    {proposal.investmentBreakdown}
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-primary/20 flex flex-col shadow-sm gap-1 break-words">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Strategy</span>
                    <span className="text-lg md:text-xl font-black text-primary uppercase leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                      {settings.billingModel === 'Percentage of Collections' ? `${settings.commissionPercentage}% Commission` : 'Fixed Monthly Fee'}
                    </span>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Performance Partner Model</p>
                  </div>
                </div>
                {isCred && (
                  <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4 flex flex-col h-auto overflow-hidden w-full">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <h4 className="text-xs font-black text-primary uppercase tracking-widest">Payer Network</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {settings.selectedPayers.map(p => (
                        <span key={p} className="px-2 py-1 bg-white/10 rounded text-[9px] font-black uppercase tracking-wider border border-white/10 whitespace-nowrap">{p}</span>
                      ))}
                    </div>
                    <div className="whitespace-normal break-words text-slate-300 text-xs leading-relaxed font-medium normal-case">
                      {proposal.payerList}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="bg-slate-900 p-10 text-center text-white rounded-t-[2rem] mt-12 relative overflow-hidden">
            <div className="max-w-xl mx-auto space-y-4 relative z-10">
              <h4 className="text-3xl font-black tracking-tighter italic uppercase leading-none">
                Urgent <span className="text-primary not-italic">RCM</span>
              </h4>
              <div className="h-0.5 w-10 bg-primary mx-auto"></div>
              <p className="text-slate-400 text-sm italic leading-relaxed font-medium">
                Optimized Financial Logistics for Modern Healthcare.
              </p>
              <div className="flex justify-center flex-wrap gap-6 opacity-40 text-[9px] font-black uppercase tracking-widest pt-2">
                <span>CMS Verified</span>
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalPreview;