import React from 'react';
import ReactDOM from 'react-dom';

export default function Toast({ toastAlert, onClose }) {
  if (!toastAlert) return null;

  return ReactDOM.createPortal(
    <div 
      style={{
        position: 'fixed',
        top: '64px',
        left: '24px',
        zIndex: 9999999,
        width: '320px',
        display: 'block',
        pointerEvents: 'auto'
      }}
    >
      <div 
        style={{ padding: '12px', borderRadius: '0.75rem', borderWidth: '1px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
        className={`backdrop-blur-md transition-all duration-300 ${
          toastAlert.type === 'error' ? 'bg-red-950/95 border-red-500 text-red-200' :
          toastAlert.type === 'success' ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200' :
          'bg-slate-950/95 border-amber-500 text-amber-200'
        }`}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
          <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', tracking: '0.1em', opacity: 0.6 }}>System Notification</span>
          <button onClick={onClose} className="text-[8px] font-black bg-white/10 hover:bg-white/20 px-1.5 py-0.5 rounded cursor-pointer transition text-slate-300">
            DISMISS
          </button>
        </div>
        <div style={{ fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.25' }}>{toastAlert.message}</div>
      </div>
    </div>,
    document.body
  );
}
