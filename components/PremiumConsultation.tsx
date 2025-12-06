import React, { useState } from 'react';
import { BaziReading } from '../types';
import { askBaziExpert } from '../services/geminiService';
import { Lock, Unlock, Loader2, Sparkles, MessageCircle, CheckCircle2, CreditCard } from 'lucide-react';

interface PremiumConsultationProps {
  reading: BaziReading;
}

type Status = 'locked' | 'processing_payment' | 'unlocked' | 'analyzing' | 'complete';

export const PremiumConsultation: React.FC<PremiumConsultationProps> = ({ reading }) => {
  const [status, setStatus] = useState<Status>('locked');
  const [questions, setQuestions] = useState<string[]>(['', '', '']);
  const [answers, setAnswers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = () => {
    setStatus('processing_payment');
    setTimeout(() => {
      setStatus('unlocked');
    }, 2000);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleSubmitQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.some(q => !q.trim())) {
      setError("Please fill in all 3 questions.");
      return;
    }
    setError(null);
    setStatus('analyzing');

    try {
      const results = await askBaziExpert(reading, questions);
      setAnswers(results);
      setStatus('complete');
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the Bazi Master. Please try again.");
      setStatus('unlocked');
    }
  };

  if (status === 'locked' || status === 'processing_payment') {
    return (
      <div className="relative overflow-hidden rounded-xl border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-8 md:p-12 flex flex-col items-center text-center">
          <div className="bg-black text-white p-4 rounded-lg mb-6 shadow-[4px_4px_0px_0px_rgba(124,58,237,1)] border-2 border-black">
            {status === 'processing_payment' ? (
                <Loader2 size={32} className="animate-spin" />
            ) : (
                <Lock size={32} />
            )}
          </div>
          
          <h2 className="text-4xl font-black text-black mb-3 uppercase tracking-tighter">Ask the Oracle</h2>
          <p className="text-stone-600 max-w-lg mb-8 font-medium">
            3 custom questions. Deep dive. <span className="font-black text-black">One-time purchase.</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 w-full max-w-lg">
             <div className="bg-stone-50 p-4 rounded-lg border-2 border-black flex items-center gap-3">
                <div className="p-2 bg-black text-white rounded border border-black">
                    <MessageCircle size={20} />
                </div>
                <div className="text-left">
                    <div className="text-sm font-bold text-black">3 Questions</div>
                    <div className="text-xs font-bold text-stone-500">Personalized</div>
                </div>
             </div>
             <div className="bg-stone-50 p-4 rounded-lg border-2 border-black flex items-center gap-3">
                 <div className="p-2 bg-black text-white rounded border border-black">
                    <Sparkles size={20} />
                </div>
                <div className="text-left">
                    <div className="text-sm font-bold text-black">Deep Analysis</div>
                    <div className="text-xs font-bold text-stone-500">AI Master</div>
                </div>
             </div>
          </div>

          <button
            onClick={handleUnlock}
            disabled={status === 'processing_payment'}
            className="w-full max-w-sm bg-black text-white hover:bg-violet-600 py-4 rounded-lg font-black uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(124,58,237,1)] hover:shadow-none hover:translate-y-1 transition-all flex items-center justify-center gap-2 group disabled:opacity-80"
          >
            {status === 'processing_payment' ? (
                <>Processing...</>
            ) : (
                <>
                    <Unlock size={18} />
                    Unlock for $19.99
                </>
            )}
          </button>
          
          <p className="mt-4 text-[10px] uppercase font-bold tracking-wider text-stone-400 flex items-center gap-1.5">
             <CreditCard size={14} /> Mock Payment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="bg-black p-6 text-white flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="bg-violet-600 p-2 rounded border-2 border-white text-white">
                <Sparkles size={24} fill="white" />
            </div>
            <div>
                <h3 className="font-black text-xl uppercase">Oracle Access</h3>
                <p className="text-stone-400 text-sm font-bold">Session Active</p>
            </div>
         </div>
         <span className="bg-lime-400 text-black border-2 border-black text-[10px] uppercase font-black px-3 py-1 rounded tracking-wider">PREMIUM</span>
      </div>

      <div className="p-6 md:p-8">
        {status === 'complete' ? (
          <div className="space-y-8 animate-fade-in">
             <div className="bg-lime-100 text-black p-4 rounded-lg flex items-center gap-3 mb-6 border-2 border-black">
                <CheckCircle2 size={24} className="text-black" />
                <div>
                    <div className="font-black uppercase">Consultation Complete</div>
                </div>
             </div>
             
             {questions.map((q, idx) => (
               <div key={idx} className="bg-white rounded-lg p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-start gap-3 mb-4 border-b-2 border-stone-100 pb-3">
                    <span className="bg-black text-white w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{idx + 1}</span>
                    <h4 className="font-bold text-black text-lg leading-tight">{q}</h4>
                  </div>
                  <div className="pl-9 text-stone-800 leading-relaxed space-y-2 font-medium">
                     {answers[idx]}
                  </div>
               </div>
             ))}
             
             <button 
                onClick={() => setStatus('unlocked')}
                className="w-full mt-8 py-3 text-stone-500 hover:text-black text-sm font-black uppercase tracking-wide transition-colors"
             >
                Reset Session
             </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitQuestions} className="space-y-6">
            <div className="bg-violet-50 border-2 border-black rounded-lg p-4 text-black text-sm font-bold mb-6">
                Ask 3 specific questions. Be real with it.
            </div>
            
            {[0, 1, 2].map((idx) => (
              <div key={idx}>
                <label className="block text-sm font-black text-black uppercase mb-2">Question {idx + 1}</label>
                <textarea
                  required
                  rows={2}
                  value={questions[idx]}
                  onChange={(e) => handleQuestionChange(idx, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-black bg-stone-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none resize-none"
                  placeholder={idx === 0 ? "e.g., Should I quit my job for a startup?" : "Ask..."}
                />
              </div>
            ))}

            {error && <p className="text-rose-600 text-sm font-bold border-2 border-rose-600 bg-rose-50 p-2 rounded">{error}</p>}

            <button
              type="submit"
              disabled={status === 'analyzing'}
              className="w-full bg-black hover:bg-stone-800 text-white py-4 rounded-lg font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {status === 'analyzing' ? (
                <>
                  <Loader2 size={20} className="animate-spin text-lime-400" />
                  READING SIGNALS...
                </>
              ) : (
                <>SEND TO ORACLE</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};