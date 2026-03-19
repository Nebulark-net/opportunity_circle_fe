import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import Feed from '../../pages/dashboard/Feed';
import TrendingWidget from '../../components/dashboard/TrendingWidget';
import UpcomingWidget from '../../components/dashboard/UpcomingWidget';
import ProUpgradeWidget from '../../components/dashboard/ProUpgradeWidget';
import { useAuthStore } from '../../stores/authStore';

const SeekerDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
      {/* Sidebar (Categories & Filters) */}
      <Sidebar />
      
      {/* Main Content (Feed) */}
      <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark relative">
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

      {/* Right Panel (Trending & Pro) */}
      <aside className="w-80 border-l border-border-dark bg-background-dark p-6 overflow-y-auto hidden xl:flex flex-col gap-8">
        {/* Trending Section */}
        <TrendingWidget />

        <div className="h-px bg-border-dark"></div>

        {/* Upcoming Deadlines Section */}
        <UpcomingWidget />

        {/* Upgrade to Pro Section */}
        <div className="mt-auto pt-6">
          <ProUpgradeWidget />
        </div>
      </aside>
    </div>
  );
};

export default SeekerDashboard;
