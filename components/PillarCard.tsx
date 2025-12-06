import React from 'react';
import { PillarData, ElementType } from '../types';

interface PillarCardProps {
  title: string;
  data: PillarData;
}

const getElementColor = (element: ElementType) => {
  switch (element) {
    case ElementType.Wood: return 'bg-emerald-100 text-emerald-900 border-emerald-900';
    case ElementType.Fire: return 'bg-rose-100 text-rose-900 border-rose-900';
    case ElementType.Earth: return 'bg-amber-100 text-amber-900 border-amber-900';
    case ElementType.Metal: return 'bg-slate-200 text-slate-900 border-slate-900';
    case ElementType.Water: return 'bg-blue-100 text-blue-900 border-blue-900';
    default: return 'bg-gray-100 text-gray-900 border-gray-900';
  }
};

const getElementBadge = (element: ElementType) => {
  switch (element) {
    case ElementType.Wood: return 'bg-emerald-600';
    case ElementType.Fire: return 'bg-rose-600';
    case ElementType.Earth: return 'bg-amber-600';
    case ElementType.Metal: return 'bg-slate-600';
    case ElementType.Water: return 'bg-blue-600';
    default: return 'bg-gray-600';
  }
};

export const PillarCard: React.FC<PillarCardProps> = ({ title, data }) => {
  const stemStyle = getElementColor(data.stem.element);
  const branchStyle = getElementColor(data.branch.element);
  const stemBadge = getElementBadge(data.stem.element);
  const branchBadge = getElementBadge(data.branch.element);

  return (
    <div className="flex flex-col items-center w-full max-w-[140px] mx-auto">
      <h3 className="text-xs uppercase font-black tracking-widest text-black mb-2 bg-white px-2 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{title}</h3>
      
      <div className="w-full flex flex-col gap-2">
        {/* Heavenly Stem */}
        <div className={`relative border-2 rounded-lg p-4 flex flex-col items-center justify-center h-32 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${stemStyle}`}>
           <span className={`absolute top-0 right-0 text-[10px] text-white px-1.5 py-0.5 border-l-2 border-b-2 border-black font-bold ${stemBadge}`}>
            {data.stem.element}
          </span>
          <div className="font-chinese text-5xl mb-1 font-bold">{data.stem.char}</div>
          <div className="text-xs font-bold uppercase">{data.stem.pinyin}</div>
          <div className="text-[9px] uppercase font-black mt-1 tracking-wider opacity-60">Stem</div>
        </div>

        {/* Earthly Branch */}
        <div className={`relative border-2 rounded-lg p-4 flex flex-col items-center justify-center h-32 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${branchStyle}`}>
           <span className={`absolute top-0 right-0 text-[10px] text-white px-1.5 py-0.5 border-l-2 border-b-2 border-black font-bold ${branchBadge}`}>
            {data.branch.element}
          </span>
          <div className="font-chinese text-5xl mb-1 font-bold">{data.branch.char}</div>
          <div className="text-xs font-bold uppercase">{data.branch.animal}</div>
          <div className="text-[9px] uppercase font-black mt-1 tracking-wider opacity-60">Branch</div>
        </div>
      </div>
    </div>
  );
};