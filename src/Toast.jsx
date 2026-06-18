import React from 'react';

export default function Toast({ toastAlert, onClose }) {
  if (!toastAlert) return null;
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full animate-fade-toast">
      <div className={`p-3 rounded-xl border flex flex-col gap-2 shadow-2xl backdrop-blur-md transition-all duration-300 ${
        toastAlert.type === 'error' ? 'bg-red-950/90 border-red-500 text-red-200 shadow-red-950/50' :
        toastAlert.type === 'success' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-emerald-950/50' :
        'bg-slate-950/90 border-amber-500 text-amber-200 shadow-amber-500/50'
      }`}>
        <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">System Notification</div>
        <div className="text-xs font-mono">{toastAlert.message}</div>
        <button onClick={onClose} className="self-end text-[9px] font-black bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded cursor-pointer transition">
          DISMISS
        </button>
      </div>
    </div>
  );
}
