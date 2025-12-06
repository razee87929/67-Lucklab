import React, { useState } from 'react';
import { SubscriptionTier } from '../types';
import { Users, Coins, Check, Zap, Crown } from 'lucide-react';

interface PricingSectionProps {
  currentTier: SubscriptionTier;
  onUpgrade: (tier: SubscriptionTier) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ currentTier, onUpgrade }) => {
  const [processing, setProcessing] = useState<SubscriptionTier | null>(null);

  const handleSubscribe = (tier: SubscriptionTier) => {
    setProcessing(tier);
    setTimeout(() => {
      onUpgrade(tier);
      setProcessing(null);
    }, 1500);
  };

  const isCurrent = (tier: SubscriptionTier) => currentTier === tier;
  const isBetter = (tier: SubscriptionTier) => {
      if (currentTier === 'pro') return false;
      if (currentTier === 'basic' && tier === 'basic') return false;
      return true;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch max-w-4xl mx-auto">
        
        {/* Basic Tier */}
        <div className={`flex-1 bg-lime-200 rounded-xl p-6 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all relative ${isCurrent('basic') ? 'ring-4 ring-black ring-offset-2' : 'hover:-translate-y-1'}`}>
          {isCurrent('basic') && <div className="absolute top-0 right-0 bg-black text-lime-400 text-[10px] font-black px-3 py-1 border-l-2 border-b-2 border-black">ACTIVE</div>}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-black text-lime-400 rounded-lg border-2 border-black">
                <Users size={24} />
            </div>
            <div>
                <h3 className="text-xl font-black text-black uppercase">Harmony</h3>
                <div className="text-sm font-bold text-stone-800">$4.99 / mo</div>
            </div>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2 text-sm font-bold text-black">
                <Check size={18} className="text-black stroke-[3]" />
                <span>Daily & Monthly Luck</span>
            </li>
            <li className="flex items-start gap-2 text-sm font-bold text-black">
                <Check size={18} className="text-black stroke-[3]" />
                <span>Partner Match (Love/Biz)</span>
            </li>
             <li className="flex items-start gap-2 text-sm font-bold text-black">
                <Check size={18} className="text-black stroke-[3]" />
                <span>Conflict Cures</span>
            </li>
          </ul>

          <button
            onClick={() => handleSubscribe('basic')}
            disabled={!isBetter('basic') || processing === 'basic'}
            className={`w-full py-3 rounded-lg font-black text-sm uppercase border-2 border-black transition-all ${
                isCurrent('basic') 
                ? 'bg-white text-black opacity-50 cursor-default' 
                : 'bg-white text-black hover:bg-black hover:text-lime-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5'
            }`}
          >
            {processing === 'basic' ? 'Loading...' : isCurrent('basic') ? 'Active Plan' : 'Subscribe $4.99'}
          </button>
        </div>

        {/* Pro Tier */}
        <div className={`flex-1 bg-violet-300 rounded-xl p-6 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all relative ${isCurrent('pro') ? 'ring-4 ring-black ring-offset-2' : 'hover:-translate-y-1'}`}>
          {isCurrent('pro') && <div className="absolute top-0 right-0 bg-black text-violet-300 text-[10px] font-black px-3 py-1 border-l-2 border-b-2 border-black">ACTIVE</div>}
          {!isCurrent('pro') && <div className="absolute -top-4 -right-2 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 transform rotate-3"><Crown size={12} fill="black" /> MVP</div>}
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-black text-violet-300 rounded-lg border-2 border-black">
                <Coins size={24} />
            </div>
            <div>
                <h3 className="text-xl font-black text-black uppercase">Destiny Master</h3>
                <div className="text-sm font-bold text-stone-800">$7.99 / mo</div>
            </div>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2 text-sm font-bold text-black">
                <Check size={18} className="text-black stroke-[3]" />
                <span>Everything in Harmony</span>
            </li>
            <li className="flex items-start gap-2 text-sm font-bold text-black">
                <Check size={18} className="text-black stroke-[3]" />
                <span>Liuyao (LuckyToss)</span>
            </li>
             <li className="flex items-start gap-2 text-sm font-bold text-black">
                <Check size={18} className="text-black stroke-[3]" />
                <span>Event Outcome Predictions</span>
            </li>
          </ul>

          <button
             onClick={() => handleSubscribe('pro')}
             disabled={isCurrent('pro') || processing === 'pro'}
             className={`w-full py-3 rounded-lg font-black text-sm uppercase border-2 border-black transition-all ${
                isCurrent('pro')
                ? 'bg-white text-black opacity-50 cursor-default'
                : 'bg-black text-white hover:bg-violet-600 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-none hover:translate-y-0.5'
             }`}
          >
             {processing === 'pro' ? 'Loading...' : isCurrent('pro') ? 'Active Plan' : 'Subscribe $7.99'}
          </button>
        </div>

      </div>
    </div>
  );
};