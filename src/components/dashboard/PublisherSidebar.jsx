import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const PublisherSidebar = () => {
  const { isSidebarOpen, closeSidebar } = useUIStore();
  const { user } = useAuthStore();

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
      {/* Identity Profile Section */}
      <div className="flex flex-col items-center gap-4 py-4 border-b border-zinc-800/50">
        <div className="size-20 rounded-2xl bg-zinc-800 border-2 border-primary/20 bg-clip-padding p-[2px] shadow-lg">
           <div className="size-full rounded-[14px] overflow-hidden bg-zinc-900 flex items-center justify-center text-zinc-600">
             {user?.profilePhotoUrl ? (
                <img src={user.profilePhotoUrl} alt="Organization Logo" className="w-full h-full object-cover" crossOrigin="anonymous" referrerPolicy="no-referrer" />
             ) : (
                <span className="material-symbols-outlined text-[32px]">corporate_fare</span>
             )}
           </div>
        </div>
        <div className="text-center px-4">
           <h3 className="text-sm font-black text-zinc-100 uppercase tracking-tighter line-clamp-1">{user?.organizationName || user?.fullName || 'Publisher'}</h3>
           <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{user?.industry || 'Organization'}</p>
        </div>
      </div>
      {sections.map((section, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">{section.title}</p>
          <div className="flex flex-col gap-1">
            {section.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-zinc-800 text-primary shadow-lg scale-[1.02] border border-zinc-700/50'
                      : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-100'
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
        <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined text-4xl text-white">bolt</span>
          </div>
          <p className="text-[10px] font-black text-primary uppercase tracking-widest">Portal Health</p>
          <div className="mt-3 flex items-end justify-between">
            <h4 className="text-xl font-black text-zinc-100">98%</h4>
            <span className="text-[10px] font-bold text-emerald-400">+2.4%</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[98%] rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
          </div>
          <p className="mt-3 text-[10px] text-zinc-500 font-medium whitespace-nowrap">All systems operational</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="w-72 border-r border-zinc-900 bg-zinc-900/40 hidden lg:flex flex-col p-6 shrink-0 overflow-y-auto">
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
              className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-zinc-900 border-r border-zinc-800 p-8 z-[70] lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-primary text-[24px]">explore</span>
                  </div>
                  <h2 className="text-zinc-100 text-[13px] font-black tracking-[0.1em] uppercase">OpportunityCircle</h2>
                </div>
                <button onClick={closeSidebar} className="size-10 rounded-xl flex items-center justify-center text-zinc-500 hover:bg-zinc-800 transition-all border border-zinc-800">
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
