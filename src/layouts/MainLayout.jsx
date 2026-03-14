import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, Search, Bookmark, Briefcase, 
  Bell, User, LogOut, Menu, 
  ShieldCheck, PlusCircle 
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import NotificationCenter from '../components/layout/NotificationCenter';
import MaxContainer from '../components/layout/MaxContainer';

const MainLayout = () => {
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['seeker', 'publisher', 'admin'] },
    { name: 'Explore', href: '/explore', icon: Search, roles: ['seeker'] },
    { name: 'Saved', href: '/saved', icon: Bookmark, roles: ['seeker'] },
    { name: 'Applications', href: '/applications', icon: Briefcase, roles: ['seeker'] },
    { name: 'Dashboard', href: '/publisher/dashboard', icon: Home, roles: ['publisher'] },
    { name: 'My Listings', href: '/publisher/listings', icon: Briefcase, roles: ['publisher'] },
    { name: 'Applicants', href: '/publisher/applicants', icon: User, roles: ['publisher'] },
    { name: 'Post Opportunity', href: '/publisher/create', icon: PlusCircle, roles: ['publisher'] },
    { name: 'Moderation', href: '/admin/moderation', icon: ShieldCheck, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar - Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-border-dark transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6">
            <h1 className="text-xl font-black text-primary tracking-tight">OPPORTUNITY CIRCLE</h1>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-button transition-colors
                    ${isActive 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}
                  `}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-border-dark space-y-2">
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-button hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <User size={20} />
              <span>Profile</span>
            </Link>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-button text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-16 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-border-dark sticky top-0 z-30">
          <MaxContainer className="h-full flex items-center justify-between">
            <button className="lg:hidden p-2 text-slate-600 dark:text-slate-400" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>

            <div className="flex-1 flex justify-end items-center gap-4">
              <NotificationCenter />
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-border-dark">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold truncate max-w-[150px]">{user?.fullName}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </MaxContainer>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <MaxContainer className="py-4 lg:py-8">
            <Outlet />
          </MaxContainer>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
