import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const PublisherSidebar = () => {
  const { isSidebarOpen, closeSidebar } = useUIStore();

  const sections = [
    {
      title: 'Management',
      items: [
        { name: 'Dashboard', icon: 'dashboard', path: '/publisher/dashboard' },
        { name: 'My Listings', icon: 'list_alt', path: '/publisher/listings' },
        { name: 'Create New', icon: 'add_circle', path: '/publisher/create' },
      ]
    },
    {
      title: 'Analytics & Account',
      items: [
        { name: 'Insights', icon: 'analytics', path: '/publisher/insights' },
        { name: 'Organization', icon: 'corporate_fare', path: '/publisher/profile' },
        { name: 'Portal Settings', icon: 'settings', path: '/publisher/settings' },
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full gap-8">
      {sections.map((section, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">{section.title}</p>
          <div className="flex flex-col gap-1">
            {section.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                <span className="text-sm font-bold tracking-tight">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-auto">
        <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined text-4xl text-white">bolt</span>
          </div>
          <p className="text-[10px] font-black text-primary uppercase tracking-widest">Portal Health</p>
          <div className="mt-3 flex items-end justify-between">
            <h4 className="text-xl font-black text-white">98%</h4>
            <span className="text-[10px] font-bold text-emerald-400">+2.4%</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[98%] rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
          </div>
          <p className="mt-3 text-[10px] text-slate-400 font-medium">All systems operational</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark hidden lg:flex flex-col p-6 shrink-0 overflow-y-auto">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 p-8 z-[70] lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-white text-[24px]">rocket_launch</span>
                  </div>
                  <h2 className="text-slate-900 dark:text-white text-xl font-black tracking-tighter uppercase">Publisher</h2>
                </div>
                <button onClick={closeSidebar} className="size-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PublisherSidebar;
