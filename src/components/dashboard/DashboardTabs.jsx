import React from 'react';
import { motion } from 'framer-motion';

const DashboardTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-slate-200 dark:border-border-dark mb-8 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap
              ${isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
            `}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default DashboardTabs;
