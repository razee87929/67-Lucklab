import React, { useState } from 'react';
import { interpretLiuyao } from '../services/geminiService';
import { LiuyaoResult } from '../types';
import { Coins, Loader2, Lock, HelpCircle, Repeat } from 'lucide-react';

interface LiuyaoTossProps {
  isUnlocked: boolean;
}

export const LiuyaoToss: React.FC<LiuyaoTossProps> = ({ isUnlocked }) => {
  const [question, setQuestion] = useState('');
  const [lines, setLines] = useState<number[]>([]);
  const [isTossing, setIsTossing] = useState(false);
  const [result, setResult] = useState<LiuyaoResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToss = () => {
    if (!question.trim()) {
        alert("Please focus on a question first.");
        return;
    }
    
    setIsTossing(true);
    
    // Simulate 6 tosses with animation delay
    let currentLines: number[] = [];
    let count = 0;
    
    const interval = setInterval(() => {
        // Random toss logic: 3 coins. Heads=3, Tails=2. Sum ranges 6-9.
        const tossSum = 
            (Math.random() > 0.5 ? 3 : 2) + 
            (Math.random() > 0.5 ? 3 : 2) + 
            (Math.random() > 0.5 ? 3 : 2);
        
        currentLines.push(tossSum);
        setLines([...currentLines]);
        count++;

        if (count >= 6) {
            clearInterval(interval);
            setIsTossing(false);
            analyzeHexagram(currentLines);
        }
    }, 800);
  };

  const analyzeHexagram = async (finalLines: number[]) => {
    setLoading(true);
    try {
        const data = await interpretLiuyao(question, finalLines);
        setResult(data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const reset = () => {
    setLines([]);
    setResult(null);
    setQuestion('');
  };

  const getLineVisual = (val: number) => {
    // 6=Old Yin (X - -), 7=Young Yang (---), 8=Young Yin (- -), 9=Old Yang (O ---)
    const isYang = val % 2 !== 0;
    const isMoving = val === 6 || val === 9;
    
    return (
        <div className={`w-full h-4 my-1 flex items-center justify-center relative ${isMoving ? 'animate-pulse' : ''}`}>
             <div className={`h-full bg-amber-400 ${isYang ? 'w-full' : 'w-[45%]'} border border-black`}></div>
             {!isYang && <div className="w-[10%]"></div>}
             {!isYang && <div className="h-full bg-amber-400 w-[45%] border border-black"></div>}
             
             {isMoving && (
                <div className="absolute right-[-20px] text-white text-xs font-bold">
                    {val === 9 ? 'O' : 'X'}
                </div>
             )}
        </div>
    );
  };

  if (!isUnlocked) {
     return (
        <div className="bg-black rounded-xl p-6 border-2 border-black relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] text-center text-stone-400">
             <div className="bg-stone-800 p-3 rounded-full mb-3 text-amber-500 border-2 border-amber-500">
                <Lock size={24} />
            </div>
            <h3 className="font-bold text-lg text-white mb-2 uppercase">LuckyToss Locked</h3>
            <p className="text-xs font-bold text-stone-500 max-w-xs mb-4">
                Unlock Destiny Master to predict outcomes.
            </p>
        </div>
    );
  }

  return (
    <div className="bg-black rounded-xl p-6 border-2 border-black text-stone-200 shadow-[6px_6px_0px_0px_rgba(124,58,237,1)]">
      <h3 className="font-black text-xl text-amber-400 mb-6 flex items-center gap-2 uppercase">
        <Coins size={24} className="fill-amber-400 text-black" />
        LuckyToss Oracle
      </h3>

      {!result && !loading ? (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-black text-stone-400 uppercase mb-2">What is your question?</label>
                <input 
                    type="text" 
                    className="w-full bg-stone-900 border-2 border-stone-700 rounded-lg px-4 py-3 text-white focus:border-amber-400 outline-none font-medium"
                    placeholder="e.g., Should I move to a new city?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={lines.length > 0}
                />
            </div>

            <div className="bg-stone-900 rounded-xl p-8 min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-stone-800">
                {lines.length === 0 && !isTossing && (
                    <div className="text-center text-stone-600">
                        <HelpCircle size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-bold">Focus. Then cast.</p>
                    </div>
                )}
                
                <div className="w-full max-w-[200px] flex flex-col-reverse">
                    {lines.map((val, idx) => (
                        <div key={idx} className="animate-fade-in">{getLineVisual(val)}</div>
                    ))}
                </div>

                {isTossing && <div className="mt-4 text-amber-400 text-sm font-bold animate-bounce">Flipping...</div>}
            </div>

            {lines.length < 6 && (
                <button 
                    onClick={handleToss}
                    disabled={isTossing || !question}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                >
                    {isTossing ? 'Divining...' : 'Cast Coins'}
                </button>
            )}
        </div>
      ) : (
        <div className="animate-fade-in space-y-6">
            {loading ? (
                 <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="animate-spin text-amber-400 mb-4" size={32} />
                    <p className="text-stone-400 text-sm font-bold">Decoding Hexagram...</p>
                 </div>
            ) : result && (
                <>
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-[120px] flex flex-col-reverse mb-4 opacity-80">
                             {lines.map((val, idx) => <div key={idx}>{getLineVisual(val)}</div>)}
                        </div>
                        <h4 className="text-2xl font-black text-white uppercase">{result.hexagramName}</h4>
                        <div className="text-amber-400 font-bold mt-1 text-lg">{result.outcome}</div>
                    </div>

                    <div className="bg-stone-900 p-6 rounded-lg border-2 border-stone-800">
                        <p className="text-stone-300 leading-relaxed text-sm font-medium">
                            {result.interpretation}
                        </p>
                    </div>

                    <button onClick={reset} className="w-full py-3 text-stone-500 hover:text-white flex items-center justify-center gap-2 transition-colors font-bold uppercase text-xs">
                        <Repeat size={16} /> Ask Another Question
                    </button>
                </>
            )}
        </div>
      )}
    </div>
  );
};