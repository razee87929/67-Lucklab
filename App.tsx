import React, { useState, useRef, useEffect } from 'react';
import { UserInput, BaziReading, SubscriptionTier } from './types';
import { generateBaziReading } from './services/geminiService';
import { PillarCard } from './components/PillarCard';
import { ElementChart } from './components/ElementChart';
import { AnalysisSection } from './components/AnalysisSection';
import { PremiumConsultation } from './components/PremiumConsultation';
import { PricingSection } from './components/PricingSection';
import { DailyLuck } from './components/DailyLuck';
import { PartnerMatch } from './components/PartnerMatch';
import { LiuyaoToss } from './components/LiuyaoToss';
import { Loader2, Sparkles, ArrowRight, Zap, Star } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BaziReading | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionTier>('free');
  const [input, setInput] = useState<UserInput>({
    name: '',
    birthDate: '',
    birthTime: '',
    gender: 'male',
  });
  
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.birthDate || !input.name) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await generateBaziReading(input);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate reading. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
      setResult(null);
      setInput({ name: '', birthDate: '', birthTime: '', gender: 'male' });
  };

  return (
    <div className="min-h-screen bg-yellow-50 text-black selection:bg-lime-300 pb-20 font-sans">
      
      {/* Header */}
      <header className="pt-12 pb-8 px-4 text-center border-b-2 border-black bg-white">
        <div className="inline-block bg-black text-white px-4 py-1 transform -rotate-2 mb-2 font-bold uppercase tracking-widest text-xs">
            The Future is Ancient
        </div>
        <h1 className="font-bold text-6xl md:text-7xl mb-2 tracking-tighter">
          67 <span className="text-violet-600 underline decoration-4 decoration-lime-400">Lucklab</span>
        </h1>
        <p className="text-stone-600 max-w-md mx-auto font-medium">
          Gen Z Bazi. Decode your destiny, match with partners, and hack your luck.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        
        {/* Input Form Section (FREE - Prioritized) */}
        {!result && !loading && (
          <div className="mt-12 mb-20">
             <div className="max-w-xl mx-auto relative">
                {/* Decorative element */}
                <div className="absolute -top-4 -right-4 bg-lime-400 text-black font-bold px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 transform rotate-6 flex items-center gap-2">
                    <Star size={16} fill="black" /> 100% FREE BAZI
                </div>

                <div className="bg-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                    <h2 className="text-3xl font-bold text-center mb-6">Drop Your Info</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold mb-1 uppercase tracking-wider">Name</label>
                        <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-black bg-stone-50 focus:bg-white focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all outline-none"
                        placeholder="What do we call you?"
                        value={input.name}
                        onChange={(e) => setInput({ ...input, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-bold mb-1 uppercase tracking-wider">Gender</label>
                        <div className="flex bg-stone-50 p-1 rounded-lg border-2 border-black">
                            <button
                            type="button"
                            onClick={() => setInput({...input, gender: 'male'})}
                            className={`flex-1 py-2 rounded text-sm font-bold transition-all border-2 ${input.gender === 'male' ? 'bg-black text-white border-black' : 'border-transparent text-stone-500 hover:text-black'}`}
                            >
                            Male
                            </button>
                            <button
                            type="button"
                            onClick={() => setInput({...input, gender: 'female'})}
                            className={`flex-1 py-2 rounded text-sm font-bold transition-all border-2 ${input.gender === 'female' ? 'bg-black text-white border-black' : 'border-transparent text-stone-500 hover:text-black'}`}
                            >
                            Female
                            </button>
                        </div>
                        </div>
                        <div>
                        <label className="block text-sm font-bold mb-1 uppercase tracking-wider">Time (Optional)</label>
                        <input
                            type="time"
                            className="w-full px-4 py-3 rounded-lg border-2 border-black bg-stone-50 focus:bg-white focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all outline-none"
                            value={input.birthTime}
                            onChange={(e) => setInput({ ...input, birthTime: e.target.value })}
                        />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1 uppercase tracking-wider">Date of Birth</label>
                        <input
                        type="date"
                        required
                        className="w-full px-4 py-3 rounded-lg border-2 border-black bg-stone-50 focus:bg-white focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all outline-none"
                        value={input.birthDate}
                        onChange={(e) => setInput({ ...input, birthDate: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-lg font-black text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 group mt-4"
                    >
                        READ MY CHART
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    </form>
                </div>
             </div>
             
             {/* Pricing Section underneath (Upsell) */}
             <div className="mt-20">
                <h3 className="text-center font-bold text-2xl mb-8 flex items-center justify-center gap-2">
                    <Zap size={24} className="text-black fill-yellow-400" /> Unlock God Mode
                </h3>
                <PricingSection 
                    currentTier={subscription} 
                    onUpgrade={setSubscription} 
                />
             </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-md mx-auto mt-20 text-center">
            <div className="inline-block relative">
                <Loader2 size={64} className="animate-spin text-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={24} className="text-violet-600 animate-pulse fill-violet-600" />
                </div>
            </div>
            <h3 className="text-2xl font-bold mt-6 text-black">Downloading the Cosmos...</h3>
            <p className="text-stone-500 mt-2 font-medium animate-pulse">Running ancient algorithms.</p>
          </div>
        )}

        {/* Results View */}
        {result && (
          <div ref={resultsRef} className="space-y-12 animate-fade-in mt-10">
            {/* Chart Section */}
            <div>
              <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b-2 border-black pb-4">
                  <div>
                    <h2 className="text-4xl font-black text-black tracking-tight uppercase">Your Blueprint</h2>
                    <p className="text-stone-600 font-medium mt-1">Bazi Chart for {input.name}</p>
                  </div>
                   <button 
                    onClick={handleReset}
                    className="text-sm font-bold underline hover:text-violet-600 transition-colors mt-4 md:mt-0 uppercase tracking-wide"
                  >
                    Start Over
                  </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <PillarCard title="Year" data={result.chart.year} />
                <PillarCard title="Month" data={result.chart.month} />
                <PillarCard title="Day" data={result.chart.day} />
                <PillarCard title="Hour" data={result.chart.hour} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Visuals */}
              <div className="lg:col-span-1 space-y-6">
                <ElementChart data={result.elements} />
                
                {/* Premium Features: Daily Luck (Basic Tier) */}
                <div className="h-auto">
                    <DailyLuck 
                        reading={result} 
                        isUnlocked={subscription === 'basic' || subscription === 'pro'} 
                    />
                </div>
              </div>

              {/* Right Column: Text Analysis & Tools */}
              <div className="lg:col-span-2 space-y-8">
                <AnalysisSection data={result.analysis} />
                
                {/* Premium Features: Partner Match (Basic Tier) */}
                <PartnerMatch 
                    userReading={result} 
                    isUnlocked={subscription === 'basic' || subscription === 'pro'} 
                />

                {/* Premium Features: Liuyao (Pro Tier) */}
                <LiuyaoToss 
                    isUnlocked={subscription === 'pro'} 
                />
              </div>
            </div>
            
            {/* Premium Expert Consultation (One-time purchase) */}
            <div className="pt-8 border-t-2 border-black">
                <PremiumConsultation reading={result} />
            </div>

            <footer className="text-center pt-12 pb-8 text-xs font-bold uppercase tracking-widest text-stone-400">
                <p>67 Lucklab © {new Date().getFullYear()} // No cap // Entertainment Only</p>
            </footer>
          </div>
        )}
      </main>
      
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;