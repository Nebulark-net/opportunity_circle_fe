import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import Feed from './Feed';
import { useAuthStore } from '../../stores/authStore';

const SeekerDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Routes>
          <Route path="/" element={<Feed type="all" />} />
          <Route path="/internships" element={<Feed type="INTERNSHIP" />} />
          <Route path="/scholarships" element={<Feed type="SCHOLARSHIP" />} />
          <Route path="/fellowships" element={<Feed type="FELLOWSHIP" />} />
          <Route path="/workshops" element={<Feed type="WORKSHOP" />} />
          <Route path="/events" element={<Feed type="EVENT" />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {/* Quick View / Right Panel (Static placeholders for Pro) */}
      <aside className="w-80 border-l border-border-dark bg-background-dark p-6 overflow-y-auto hidden xl:flex flex-col gap-8">
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Trending This Week</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-border-dark transition-colors cursor-pointer border border-transparent">
              <div className="bg-blue-500/20 text-blue-400 rounded-lg p-2 shrink-0">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <div>
                <p className="text-xs font-bold text-white mb-0.5">Global Fellowships 2025</p>
                <p className="text-[10px] text-slate-400">High match for your skill set</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-border-dark"></div>

        <div className="mt-auto pt-6">
          <div className="rounded-xl bg-gradient-to-br from-primary to-blue-700 p-5 text-white shadow-lg shadow-primary/10">
            <p className="text-sm font-bold mb-2">Upgrade to Pro</p>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              Get early access to exclusive scholarships and 1-on-1 career coaching.
            </p>
            <button className="w-full py-2 bg-white text-primary text-xs font-black rounded-lg hover:bg-slate-50 transition-colors">
              Go Premium
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SeekerDashboard;
