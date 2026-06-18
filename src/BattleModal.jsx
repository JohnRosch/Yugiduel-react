import React from 'react';
import Card from './Card';

export default function BattleModal({ battleModal, onProceed }) {
  if (!battleModal) return null;
  return (
    <div className="absolute inset-0 bg-black/95 z-40 flex flex-col items-center justify-center p-4 backdrop-blur-md">
      <div className="text-amber-400 text-sm font-black tracking-widest uppercase mb-4 animate-pulse">Battle Phase Clash</div>
      <div className="flex items-center gap-12 my-6">
        <div className={`flex flex-col items-center gap-2 ${battleModal.result === 'LOSE' ? 'animate-shake' : ''}`}>
          <div className="text-[10px] text-red-500 font-bold tracking-wider">ATTACKER</div>
          <Card card={battleModal.attacker} faceDown={false} />
          <div className="text-xs font-mono text-red-400 font-bold">⚔️ {battleModal.attacker.atk}</div>
        </div>
        <div className="text-xl font-black text-slate-600 italic">VS</div>
        <div className={`flex flex-col items-center gap-2 ${battleModal.result === 'WIN' && battleModal.defender ? 'animate-shake' : ''}`}>
          <div className="text-[10px] text-blue-500 font-bold tracking-wider">DEFENDER ({battleModal.defenderPos})</div>
          {battleModal.defender ? (
            <Card card={battleModal.defender} faceDown={battleModal.defenderPos === 'DEF'} />
          ) : (
            <div className="w-20 h-28 border border-dashed border-red-500/40 rounded-lg flex items-center justify-center text-red-500 text-xs font-bold bg-red-950/20 uppercase tracking-widest">DIRECT</div>
          )}
          <div className="text-xs font-mono text-blue-400 font-bold">
            {battleModal.defender ? (battleModal.defenderPos === 'ATK' ? `⚔️ ${battleModal.defender.atk}` : `🛡️ ${battleModal.defender.def}`) : '❤️ LP'}
          </div>
        </div>
      </div>
      <div className="max-w-md text-center bg-slate-950 p-4 border border-slate-800 rounded-lg shadow-2xl">
        <p className="text-xs font-mono text-amber-200">{battleModal.logText}</p>
        <button onClick={onProceed} className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-6 py-1.5 rounded font-bold transition cursor-pointer">
          PROCEED ➔
        </button>
      </div>
    </div>
  );
}
