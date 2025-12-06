import React, { useState, useEffect } from 'react';
import { BaziReading, DailyLuckResult } from '../types';
import { generateDailyLuck } from '../services/geminiService';
import { Calendar, Moon, Sun, Clock, Compass, Loader2, Lock } from 'lucide-react';

interface DailyLuckProps {
  reading: BaziReading;
  isUnlocked: boolean;
}

export const DailyLuck: React.FC<DailyLuckProps> = ({ reading, isUnlocked }) => {
  const [data, setData] = useState<DailyLuckResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isUnlocked && !data && !loading) {
      setLoading(true);
      generateDailyLuck(reading)
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isUnlocked, reading]);

  if (!isUnlocked) {
    return (
      <div className="bg-stone-100 rounded-xl p-6 border-2 border-black border-dashed relative overflow-hidden flex flex-col items-center justify-center h-full min-h-[200px] text-center">
         <div className="z-20 flex flex-col items-center">
            <div className="bg-stone-300 p-3 rounded-full mb-3 text-stone-600 border-2 border-stone-400">
                <Lock size={24} />
            </div>
            <h3 className="font-bold text-lg text-stone-800 mb-1">Forecast Locked</h3>
            <p className="text-xs font-bold text-stone-500 max-w-[200px] mb-3">Upgrade to Harmony Plan to see your daily stats.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-full">
      <h3 className="font-black text-xl text-black mb-4 flex items-center gap-2 uppercase">
        <Calendar className="text-black" size={20} />
        Forecast
      </h3>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-stone-400">
            <Loader2 className="animate-spin mb-2 text-black" />
            <span className="text-xs font-bold">Loading vibes...</span>
        </div>
      ) : data ? (
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-black">
            <div className="flex items-center gap-2 text-black font-black mb-1 text-sm uppercase">
                <Sun size={16} /> Today
            </div>
            <p className="text-stone-800 text-sm font-medium">{data.daily}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border-2 border-black">
             <div className="flex items-center gap-2 text-black font-black mb-1 text-sm uppercase">
                <Moon size={16} /> Month
            </div>
            <p className="text-stone-800 text-sm font-medium">{data.monthly}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="bg-white p-3 rounded-lg border-2 border-black text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-center text-stone-400 mb-1"><Clock size={16} className="text-black"/></div>
                <div className="text-[10px] uppercase font-black text-stone-500">Peak Time</div>
                <div className="text-black font-bold text-sm">{data.luckyTime}</div>
             </div>
             <div className="bg-white p-3 rounded-lg border-2 border-black text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-center text-stone-400 mb-1"><Compass size={16} className="text-black"/></div>
                <div className="text-[10px] uppercase font-black text-stone-500">Direction</div>
                <div className="text-black font-bold text-sm">{data.direction}</div>
             </div>
          </div>
        </div>
      ) : (
        <div className="text-stone-400 text-center py-8 font-bold">Failed to load.</div>
      )}
    </div>
  );
};