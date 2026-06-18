import React from 'react';

export default function Card({ card, faceDown, onPlayATK, onPlayDEF, interactive, onClick, isAttacking, isTargeted }) {
  if (!card) {
    return (
      <div 
        onClick={onClick}
        className={`w-20 h-28 border-2 border-dashed rounded-lg flex items-center justify-center text-[10px] text-slate-600 transition duration-200 select-none bg-slate-950 ${
          onClick ? 'hover:border-amber-500/40 hover:bg-slate-900/40 cursor-pointer' : 'border-slate-800'
        }`}
      >
        Empty
      </div>
    );
  }

  let specializedBorderClass = "border-amber-700";
  let dynamicTransformClass = "hover:scale-110 hover:-translate-y-1 hover:shadow-xl hover:z-20";

  if (isAttacking) {
    specializedBorderClass = "border-red-500 ring-4 ring-red-600/60 animate-pulse";
    dynamicTransformClass = "-translate-y-2 scale-105 z-10 shadow-red-900/50 shadow-lg";
  } else if (isTargeted) {
    specializedBorderClass = "border-orange-500 ring-4 ring-orange-500/80 animate-bounce";
    dynamicTransformClass = "scale-105 z-10 shadow-orange-900/50 shadow-lg";
  }

  if (faceDown) {
    return (
      <div 
        onClick={onClick}
        className={`w-20 h-28 bg-gradient-to-br from-red-800 to-red-950 border-2 rounded-lg flex items-center justify-center shadow-lg transition duration-200 transform cursor-pointer ${specializedBorderClass} ${dynamicTransformClass}`}
      >
        <div className="text-amber-400/90 text-[10px] font-black tracking-wider uppercase select-none">BACK</div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`w-20 h-28 bg-amber-50 border-2 rounded-lg p-1 flex flex-col justify-between shadow-md relative group text-slate-900 transition duration-200 transform cursor-pointer ${specializedBorderClass} ${dynamicTransformClass}`}
    >
      <div className="flex flex-col gap-0.5">
        <div className="truncate text-[10px] font-black uppercase leading-tight">{card.name}</div>
        <div className="text-[9px] text-amber-600 font-bold leading-none">⭐ Lvl {card.level}</div>
      </div>
      
      <div className="bg-amber-200/40 h-10 w-full rounded flex items-center justify-center text-[8px] italic text-slate-400 select-none">
        No Art
      </div>
      
      <div className="text-[9px] font-mono font-bold bg-slate-200 p-0.5 rounded flex justify-between leading-none">
        <span className="text-red-700">⚔️{card.atk}</span>
        <span className="text-blue-700">🛡️{card.def}</span>
      </div>

      {interactive && (
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col items-center justify-center gap-1.5 rounded-lg p-1.5 z-30">
          <button onClick={(e) => { e.stopPropagation(); onPlayATK(); }} className="w-full bg-red-600 text-white text-[9px] py-0.5 font-bold rounded hover:bg-red-500 cursor-pointer transition">ATK</button>
          <button onClick={(e) => { e.stopPropagation(); onPlayDEF(); }} className="w-full bg-blue-600 text-white text-[9px] py-0.5 font-bold rounded hover:bg-blue-500 cursor-pointer transition">DEF</button>
        </div>
      )}
    </div>
  );
}
