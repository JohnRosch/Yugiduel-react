import React from 'react';

export default function Card({ card, faceDown, onPlayATK, onPlayDEF, interactive, onClick, isAttacking, isTargeted, isHandCard, isDestroying }) {
  
  // 1. Empty Zone Frame Structure
  if (!card) {
    return (
      <div 
        onClick={onClick}
        className={`border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center text-[10px] text-slate-600 transition duration-200 select-none bg-slate-950/40 ${
          isHandCard ? 'w-28 h-36' : 'w-20 h-28'
        } ${onClick ? 'hover:border-amber-500/40 hover:bg-slate-900/20 cursor-pointer' : ''}`}
      >
        Empty
      </div>
    );
  }

  // Calculate sizing layouts dynamically
  const cardSizingClasses = isHandCard ? 'w-28 h-36 p-1.5' : 'w-20 h-28 p-1';
  let specializedBorderClass = "border-amber-700";
  let dynamicTransformClass = "hover:scale-110 hover:-translate-y-1 hover:shadow-xl hover:z-20";

  if (isAttacking) {
    specializedBorderClass = "border-red-500 ring-4 ring-red-600/60";
    dynamicTransformClass = "-translate-y-2 scale-105 z-10 shadow-red-900/50 shadow-lg";
  } else if (isTargeted) {
    specializedBorderClass = "border-orange-500 ring-4 ring-orange-500/80";
    dynamicTransformClass = "scale-105 z-10 shadow-orange-900/50 shadow-lg";
  } else if (isDestroying) {
    specializedBorderClass = "border-red-800 ring-2 ring-red-900/50";
    dynamicTransformClass = "animate-card-break pointer-events-none z-30";
  }

  // 2. Card Face Down Render Template
  if (faceDown) {
    return (
      <div 
        onClick={onClick}
        className={`bg-gradient-to-br from-red-800 to-red-950 border-2 rounded-lg flex items-center justify-center shadow-lg transition duration-200 transform cursor-pointer ${cardSizingClasses} ${specializedBorderClass} ${dynamicTransformClass}`}
      >
        <div className="text-amber-400/90 text-[10px] font-black tracking-wider uppercase select-none">BACK</div>
      </div>
    );
  }

  // 3. Card Face Up Render Template
  return (
    <div 
      onClick={onClick}
      className={`bg-amber-50 border-2 rounded-lg flex flex-col justify-between shadow-md relative group text-slate-900 transition duration-200 transform cursor-pointer overflow-hidden ${cardSizingClasses} ${specializedBorderClass} ${dynamicTransformClass}`}
    >
      {/* ⚔️ Violent Defeat Cross-Out Stroke Line Effect Overlay */}
      {isDestroying && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[140%] h-1.5 bg-red-600 rotate-45 shadow-lg shadow-black" />
          <div className="absolute w-[140%] h-1.5 bg-red-600 -rotate-45 shadow-lg shadow-black" />
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        <div className={`font-black uppercase leading-tight text-slate-950 truncate ${isHandCard ? 'text-[11px]' : 'text-[9px]'}`}>{card.name}</div>
        <div className="text-[8px] text-amber-600 font-bold leading-none">⭐ Lvl {card.level}</div>
      </div>
      
      <div className="bg-amber-200/30 w-full rounded flex items-center justify-center italic text-slate-400 select-none flex-grow my-1 text-[8px]">
        No Art
      </div>
      
      <div className="text-[9px] font-mono font-bold bg-slate-200 p-0.5 rounded flex justify-between leading-none">
        <span className="text-red-700">⚔️{card.atk}</span>
        <span className="text-blue-700">🛡️{card.def}</span>
      </div>

      {/* Hand Play Options Button Overlay (Clean transparent backing box) */}
      {interactive && (
        <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col items-center justify-center gap-1.5 p-1.5 z-30 backdrop-blur-[1px]">
          <button onClick={(e) => { e.stopPropagation(); onPlayATK(); }} className="w-full bg-red-600 text-white text-[9px] py-1 font-bold rounded shadow-md hover:bg-red-500 cursor-pointer transition">ATK</button>
          <button onClick={(e) => { e.stopPropagation(); onPlayDEF(); }} className="w-full bg-blue-600 text-white text-[9px] py-1 font-bold rounded shadow-md hover:bg-blue-500 cursor-pointer transition">DEF</button>
        </div>
      )}
    </div>
  );
}
