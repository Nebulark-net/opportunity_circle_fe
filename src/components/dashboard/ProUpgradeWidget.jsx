import React from 'react';

const ProUpgradeWidget = () => {
  return (
    <div className="rounded-xl bg-gradient-to-br from-primary to-blue-700 p-5 text-white shadow-lg shadow-primary/10">
      <p className="text-sm font-bold mb-2">Upgrade to Pro</p>
      <p className="text-xs text-white/80 leading-relaxed mb-4">
        Get early access to exclusive scholarships and 1-on-1 career coaching.
      </p>
      <button className="w-full py-2 bg-white text-primary text-xs font-black rounded-lg hover:bg-slate-50 transition-colors">
        Go Premium
      </button>
    </div>
  );
};

export default ProUpgradeWidget;
