
import React, { useState } from 'react';
import { PracticeInfo, ProposalSettings, GeneratedProposal } from './types';
import ProposalForm from './components/ProposalForm';
import ProposalPreview from './components/ProposalPreview';
import { generateProposalContent } from './services/geminiService';

const App: React.FC = () => {
  const [practice, setPractice] = useState<PracticeInfo>({
    practiceName: '',
    providerName: '',
    email: '',
    specialty: 'Internal Medicine',
    monthlyVolume: 100000,
    currentDenialRate: 8.5
  });

  const [settings, setSettings] = useState<ProposalSettings>({
    serviceType: 'Medical Billing Only',
    billingModel: 'Percentage of Collections',
    commissionPercentage: 6.0,
    flatMonthlyFee: 2500,
    selectedPayers: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [proposal, setProposal] = useState<GeneratedProposal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateProposalContent(practice, settings);
      setProposal(result);
      setTimeout(() => {
        document.getElementById('proposal-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError('System Error: Proposal generation failed. Verify API configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50 no-print shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary p-2 rounded-lg shadow-sm group-hover:bg-secondary transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight italic">Urgent <span className="text-primary not-italic">RCM</span></span>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> HIPAA Compliant</span>
                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> 256-Bit Security</span>
             </div>
             <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all">Client Portal</button>
          </div>
        </div>
      </nav>

      <header className="bg-white py-12 px-6 no-print border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Revenue Performance <span className="text-primary">Optimized.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Medical Billing and Payer Credentialing solutions engineered for peak clinical performance.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 mb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6 no-print sticky top-24">
            <ProposalForm practice={practice} setPractice={setPractice} settings={settings} setSettings={setSettings} onGenerate={handleGenerate} isLoading={isLoading} />
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 flex gap-2 items-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}
            <div className="p-4 bg-slate-900 rounded-2xl text-white">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Service Guarantee</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">All Urgent RCM agreements include dedicated account managers and weekly performance benchmarking reports.</p>
            </div>
          </div>

          <div className="lg:col-span-7 h-full" id="proposal-result">
            {proposal ? (
              <ProposalPreview proposal={proposal} practice={practice} settings={settings} />
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px] no-print">
                <div className="bg-slate-50 p-8 rounded-full text-slate-300">
                   <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Ready for Analysis</h3>
                  <p className="text-slate-500 max-w-sm mx-auto text-sm mt-2">Enter the practice data and select your service requirements to generate a complete RCM service proposal.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-auto bg-slate-900 py-12 px-6 no-print text-white">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
               <span className="text-xl font-black tracking-tight italic">Urgent <span className="text-primary not-italic">RCM</span></span>
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Next-Gen Revenue Logistics</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Benchmarks</a>
              <a href="#" className="hover:text-white transition-colors">Compliance</a>
              <a href="#" className="hover:text-white transition-colors">Client Support</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;
