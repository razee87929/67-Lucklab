import React from 'react';
import { BaziReading } from '../types';
import { Sparkles, Heart, Briefcase, DollarSign, Activity, AlertCircle, Zap } from 'lucide-react';

interface AnalysisSectionProps {
  data: BaziReading['analysis'];
}

const Card: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = "" }) => (
  <div className={`bg-white rounded-xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${className}`}>
    <div className="flex items-center gap-3 mb-4 border-b-2 border-stone-100 pb-2">
      <div className="p-2 bg-black text-white rounded-lg border-2 border-transparent">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-black uppercase tracking-tight">{title}</h3>
    </div>
    <div className="text-stone-800 leading-relaxed text-sm md:text-base font-medium">
      {children}
    </div>
  </div>
);

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      
      {/* Hero Card - Day Master */}
      <div className="bg-black text-white rounded-xl p-8 border-2 border-black shadow-[6px_6px_0px_0px_rgba(124,58,237,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
          <div className="flex-1">
             <div className="text-lime-400 text-xs uppercase font-black tracking-widest mb-2 flex items-center gap-2"><Zap size={12} fill="currentColor"/> Day Master</div>
             <h2 className="text-4xl font-bold text-white mb-4">{data.mainElement}</h2>
             <p className="text-stone-300 leading-relaxed text-lg font-medium">{data.personality}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Career" icon={<Briefcase size={20} />}>
          {data.career}
        </Card>
        
        <Card title="Wealth" icon={<DollarSign size={20} />}>
          {data.wealth}
        </Card>

        <Card title="Love" icon={<Heart size={20} />}>
          {data.relationships}
        </Card>

        <Card title="Health" icon={<Activity size={20} />}>
          <p className="mb-4">{data.health}</p>
          <div className="flex items-start gap-2 text-xs font-bold text-black bg-yellow-300 p-3 rounded border-2 border-black">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{data.health_disclaimer}</span>
          </div>
        </Card>
      </div>

      {/* Luck Tokens */}
      <div className="bg-violet-100 rounded-xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-center font-bold text-black mb-6 flex items-center justify-center gap-2 uppercase tracking-wide">
            <Sparkles size={20} className="text-violet-600 fill-violet-600"/> 
            Cheat Codes 
            <Sparkles size={20} className="text-violet-600 fill-violet-600"/>
        </h3>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <div className="text-center">
                <span className="text-xs uppercase text-stone-500 font-black tracking-wider block mb-3">Power Colors</span>
                <div className="flex gap-2 justify-center flex-wrap">
                    {data.luckyColors.map((color, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white border-2 border-black rounded-lg text-sm font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {color}
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="w-full h-px md:w-px md:h-12 bg-black opacity-20"></div>
            
            <div className="text-center">
                <span className="text-xs uppercase text-stone-500 font-black tracking-wider block mb-3">Lucky Numbers</span>
                <div className="flex gap-2 justify-center">
                    {data.luckyNumbers.map((num, idx) => (
                         <span key={idx} className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-lg border-2 border-black text-lg font-bold shadow-[2px_2px_0px_0px_rgba(139,92,246,1)]">
                         {num}
                     </span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};