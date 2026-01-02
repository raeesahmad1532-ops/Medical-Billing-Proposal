
import React, { useState, useMemo } from 'react';
import { PracticeInfo, ProposalSettings, ServiceType, BillingModel } from '../types';

interface Props {
  practice: PracticeInfo;
  setPractice: (p: PracticeInfo) => void;
  settings: ProposalSettings;
  setSettings: (s: ProposalSettings) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const DEFAULT_PAYERS = [
  'Medicare', 'Medicaid', 'Blue Cross Blue Shield (BCBS)', 'Aetna', 'Cigna', 
  'UnitedHealthcare (UHC)', 'Humana', 'Tricare', 'MultiPlan', 
  'Kaiser Permanente', 'Ambetter', 'Molina', 'Oscar', 'Oxford', 'VA Community Care'
];

const ProposalForm: React.FC<Props> = ({ 
  practice, 
  setPractice, 
  settings, 
  setSettings, 
  onGenerate, 
  isLoading 
}) => {
  const [payerSearch, setPayerSearch] = useState('');
  const [customPayer, setCustomPayer] = useState('');
  const [availablePayers, setAvailablePayers] = useState(DEFAULT_PAYERS);

  const handlePracticeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setPractice({ ...practice, [e.target.name]: value });
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings({ 
      ...settings, 
      [name]: (name === 'commissionPercentage' || name === 'flatMonthlyFee') ? parseFloat(value) : value 
    });
  };

  const togglePayer = (payer: string) => {
    const isSelected = settings.selectedPayers.includes(payer);
    const newSelected = isSelected 
      ? settings.selectedPayers.filter(p => p !== payer)
      : [...settings.selectedPayers, payer];
    setSettings({ ...settings, selectedPayers: newSelected });
  };

  const isBilling = settings.serviceType === 'Medical Billing Only' || settings.serviceType === 'Both Services';
  const isCred = settings.serviceType === 'Credentialing Only' || settings.serviceType === 'Both Services';

  const payerCount = settings.selectedPayers.length;
  const { credPrice, packageApplied } = useMemo(() => {
    if (!isCred || payerCount === 0) return { credPrice: 0, packageApplied: null };
    if (payerCount < 10) return { credPrice: payerCount * 120, packageApplied: '1-9 Payers: $120/ea' };
    if (payerCount < 25) return { credPrice: 1000, packageApplied: 'Standard Pack (10-24 Payers)' };
    return { credPrice: 2000, packageApplied: 'Growth Pack (25+ Payers)' };
  }, [payerCount, isCred]);

  // Validation
  const isPayerSelectionMissing = isCred && payerCount === 0;
  const isGenerateDisabled = isLoading || !practice.practiceName || isPayerSelectionMissing;

  // New Aggressive Calculation: 50% Boost
  const potentialMonthlyGain = practice.monthlyVolume * 0.50;

  const filteredPayers = availablePayers.filter(p => 
    p.toLowerCase().includes(payerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Service Modes Toggle */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex gap-1 no-print">
        {(['Medical Billing Only', 'Credentialing Only', 'Both Services'] as ServiceType[]).map((type) => (
          <button
            key={type}
            onClick={() => setSettings({ ...settings, serviceType: type })}
            className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${
              settings.serviceType === type 
                ? 'bg-primary text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Practice Intake
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Practice Name</label>
              <input type="text" name="practiceName" value={practice.practiceName} onChange={handlePracticeChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. City Health Medical Group" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Provider Name</label>
              <input type="text" name="providerName" value={practice.providerName} onChange={handlePracticeChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Dr. John Doe" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Email</label>
              <input type="email" name="email" value={practice.email} onChange={handlePracticeChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. j.doe@clinic.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specialty</label>
              <input type="text" name="specialty" value={practice.specialty} onChange={handlePracticeChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Pediatrics" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monthly Revenue ($)</label>
              <input type="number" name="monthlyVolume" value={practice.monthlyVolume} onChange={handlePracticeChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>
          
          {isBilling && (
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase">Revenue Recovery Target</p>
                <p className="text-[11px] font-bold text-emerald-800">90% Denial Reduction</p>
              </div>
              <p className="text-xl font-black text-emerald-600">+${potentialMonthlyGain.toLocaleString()}/mo</p>
            </div>
          )}
        </div>

        {/* Billing Pricing Options */}
        {isBilling && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              Billing Pricing Model
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex gap-2">
                {(['Percentage of Collections', 'Flat Monthly Fee'] as BillingModel[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setSettings({ ...settings, billingModel: m })}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                      settings.billingModel === m ? 'bg-secondary text-white border-secondary' : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {settings.billingModel === 'Percentage of Collections' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Commission Rate: <span className="text-primary">{settings.commissionPercentage}%</span></label>
                  <input type="range" name="commissionPercentage" min="3" max="10" step="0.5" value={settings.commissionPercentage} onChange={handleSettingsChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monthly Fee ($)</label>
                  <input type="number" name="flatMonthlyFee" value={settings.flatMonthlyFee} onChange={handleSettingsChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Smart Payer Selector */}
        {isCred && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Payer Credentialing
              </h2>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">1-Year Maintenance Included</span>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Search major payers..." 
                  value={payerSearch} 
                  onChange={(e) => setPayerSearch(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {filteredPayers.map(payer => {
                  const isSelected = settings.selectedPayers.includes(payer);
                  return (
                    <button
                      key={payer}
                      onClick={() => togglePayer(payer)}
                      className={`px-3 py-2 rounded-lg text-left text-[11px] font-bold transition-all border ${
                        isSelected 
                          ? 'bg-secondary text-white border-secondary' 
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {payer}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-xl p-4 text-white">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-400">Credentialing Fee:</span>
                <span className="text-xl font-black text-primary">${credPrice.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{packageApplied || 'Select Payers to Calculate'}</p>
            </div>

            {isPayerSelectionMissing && (
              <p className="text-xs text-red-500 font-bold animate-pulse">
                * Please select at least one insurance payer for credentialing.
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={onGenerate}
            disabled={isGenerateDisabled}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
              isGenerateDisabled ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-[#522437]'
            }`}
          >
            {isLoading ? 'Processing AI Data...' : 'Generate Clinical Proposal'}
          </button>
          
          {isGenerateDisabled && !isLoading && (
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">
              {!practice.practiceName ? 'Practice Name Required' : isPayerSelectionMissing ? 'Payer Selection Required' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalForm;
