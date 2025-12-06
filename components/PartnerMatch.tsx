import React, { useState } from 'react';
import { BaziReading, UserInput, CompatibilityResult } from '../types';
import { generateCompatibility } from '../services/geminiService';
import { Heart, Briefcase, Users, Loader2, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface PartnerMatchProps {
  userReading: BaziReading;
  isUnlocked: boolean;
}

export const PartnerMatch: React.FC<PartnerMatchProps> = ({ userReading, isUnlocked }) => {
  const [partner, setPartner] = useState<UserInput>({ name: '', birthDate: '', birthTime: '', gender: 'female' });
  const [relationType, setRelationType] = useState('Couple');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner.name || !partner.birthDate) return;
    
    setLoading(true);
    try {
        const data = await generateCompatibility(userReading, partner, relationType);
        setResult(data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  if (!isUnlocked) {
    return (
        <div className="bg-stone-100 rounded-xl p-6 border-2 border-black border-dashed relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] text-center">
             <div className="bg-stone-300 p-3 rounded-full mb-3 text-stone-600 border-2 border-stone-400">
                <Lock size={24} />
            </div>
            <h3 className="font-bold text-lg text-stone-700 mb-2">Partner Match Locked</h3>
            <p className="text-xs font-bold text-stone-500 max-w-xs mb-4">
                Unlock Harmony Plan to sync charts with friends or partners.
            </p>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="font-black text-xl text-black mb-6 flex items-center gap-2 uppercase">
        <Users className="text-lime-500 fill-black" size={24} />
        Vibe Check
      </h3>

      {!result ? (
        <form onSubmit={handleCheck} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-black text-black uppercase mb-1">Partner's Name</label>
                <input 
                    type="text" 
                    className="w-full p-2 rounded-lg border-2 border-black bg-white focus:bg-lime-50 outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    value={partner.name}
                    onChange={(e) => setPartner({...partner, name: e.target.value})}
                    required
                />
            </div>
            <div>
                <label className="block text-xs font-black text-black uppercase mb-1">Relationship</label>
                <select 
                    className="w-full p-2 rounded-lg border-2 border-black bg-white focus:bg-lime-50 outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    value={relationType}
                    onChange={(e) => setRelationType(e.target.value)}
                >
                    <option value="Couple">Romantic</option>
                    <option value="Business">Business</option>
                    <option value="Friend">Bestie</option>
                </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-black text-black uppercase mb-1">DOB</label>
                <input 
                    type="date" 
                    className="w-full p-2 rounded-lg border-2 border-black bg-white focus:bg-lime-50 outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    value={partner.birthDate}
                    onChange={(e) => setPartner({...partner, birthDate: e.target.value})}
                    required
                />
             </div>
             <div>
                <label className="block text-xs font-black text-black uppercase mb-1">Gender</label>
                <div className="flex bg-stone-50 rounded-lg p-1 border-2 border-black">
                    <button type="button" onClick={() => setPartner({...partner, gender: 'male'})} className={`flex-1 text-xs font-bold py-1.5 rounded ${partner.gender === 'male' ? 'bg-black text-white' : 'text-stone-500'}`}>M</button>
                    <button type="button" onClick={() => setPartner({...partner, gender: 'female'})} className={`flex-1 text-xs font-bold py-1.5 rounded ${partner.gender === 'female' ? 'bg-black text-white' : 'text-stone-500'}`}>F</button>
                </div>
             </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-lime-400 hover:bg-lime-300 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 py-3 rounded-lg font-black uppercase transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Check Compatibility <ArrowRight size={18} /></>}
          </button>
        </form>
      ) : (
        <div className="animate-fade-in">
           <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${result.score > 70 ? 'bg-emerald-400 text-black' : 'bg-rose-400 text-black'}`}>
                        {relationType === 'Business' ? <Briefcase size={20} /> : <Heart size={20} fill="black" />}
                    </div>
                    <div>
                        <div className="text-3xl font-black">{result.score}%</div>
                        <div className="text-xs font-bold uppercase tracking-wider">Match Score</div>
                    </div>
                </div>
                <button onClick={() => setResult(null)} className="text-xs font-bold underline hover:text-violet-600 uppercase">New Check</button>
           </div>

           <div className="bg-stone-50 p-4 rounded-lg border-2 border-black mb-4">
             <h4 className="font-black text-black mb-1 text-lg uppercase">{result.verdict}</h4>
             <p className="text-sm text-stone-800 font-medium leading-relaxed">{result.analysis}</p>
           </div>

           {result.remedy && (
             <div className="bg-yellow-50 p-4 rounded-lg border-2 border-black flex gap-3">
                <ShieldCheck className="text-black shrink-0" size={20} />
                <div>
                    <h4 className="font-bold text-black text-sm mb-1 uppercase">Metaphysical Fix</h4>
                    <p className="text-sm text-stone-800 font-medium leading-relaxed">{result.remedy}</p>
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};