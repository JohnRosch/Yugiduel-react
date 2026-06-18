import React from 'react';
import ReactDOM from 'react-dom';

export default function GameOverModal({ winner, onRestart }) {
  if (!winner) return null;

  return ReactDOM.createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'block'
      }}
    >
      {/* Absolute dead-center box wrapper using primitive auto-margins */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: 'auto',
          width: '320px',
          height: '340px',
          zIndex: 100000
        }}
      >
        <div className="bg-slate-950 border-2 border-amber-500 rounded-2xl p-8 text-center shadow-2xl animate-fade-toast h-full flex flex-col justify-between select-none">
          <div>
            <div className="text-amber-500 font-black text-2xl tracking-widest uppercase mb-1">DUEL RESOLVED</div>
            <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-4">Match Complete</div>
          </div>
          
          <div className="text-lg font-bold font-mono text-emerald-400 my-4 bg-emerald-950/40 p-4 border border-emerald-500/20 rounded-xl">
            {winner === 'DRAW MATCH' ? "🤝 IT'S A TIE!" : `🏆 WINNER: ${winner}`}
          </div>

          <button 
            onClick={onRestart} 
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 py-3 rounded-xl font-black tracking-wide shadow-lg transform active:scale-95 transition cursor-pointer"
          >
            🔄 PLAY AGAIN
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
