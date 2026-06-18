import React from 'react';
import ReactDOM from 'react-dom';
import Card from './Card';

export default function GYModal({ isOpen, ownerName, cards, onClose }) {
  if (!isOpen) return null;

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
        zIndex: 999999,
        backgroundColor: 'transparent',
        display: 'block',
        pointerEvents: 'none'
      }}
    >
      {/* Absolute dead center box wrapper layout calculation using auto margins */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: 'auto',
          width: '560px',
          height: '420px',
          backgroundColor: '#020617', // bg-slate-950 hex value
          border: '2px solid #1e293b',  // border-slate-800 hex value
          borderRadius: '1rem',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          pointerEvents: 'auto'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '12px', marginBottom: '16px' }}>
          <div>
            <h3 className="text-amber-500 font-black tracking-wider uppercase text-sm" style={{ margin: 0 }}>{ownerName}'s Graveyard</h3>
            <p className="text-[10px] text-slate-500 font-mono" style={{ margin: '2px 0 0 0' }}>Fallen Cards Count: {cards?.length || 0}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 font-bold px-3 py-1 rounded-lg text-xs cursor-pointer transition"
          >
            CLOSE
          </button>
        </div>

        {/* Modal Body / Graveyard List Grid */}
        <div className="overflow-y-auto flex-grow pr-1">
          {!cards || cards.length === 0 ? (
            <div className="text-center py-12 text-slate-600 text-xs italic font-mono uppercase tracking-widest border border-dashed border-slate-900 rounded-xl bg-slate-950/40">
              The Graveyard is empty...
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3 justify-items-center p-2 bg-slate-900/30 rounded-xl border border-slate-900/50">
              {cards.map((card, idx) => (
                /* FIXED DUPLICATION: Applied a math random tracking key so identical cards render side-by-side as individual unique elements */
                <div key={`${card?.id || idx}-card-gy-${idx}-${Math.random()}`} className="flex flex-col items-center gap-1">
                  <Card card={card} faceDown={false} interactive={false} />
                  <span className="text-[8px] font-mono text-slate-600 font-bold uppercase tracking-tight">#{idx + 1}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}
