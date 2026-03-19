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
import authService from '../services/auth.service';

const MainLayout = () => {
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      toggleSidebar();
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      logout();
    }
  };

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
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-border-dark transform transition-transform duration-300 lg:hidden
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
                  onClick={toggleSidebar}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-border-dark space-y-2">
            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-button hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={toggleSidebar}>
              <User size={20} />
              <span>Profile</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-button text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Header (Top Navigation) */}
      <header className="h-16 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-border-dark sticky top-0 z-30">
        <MaxContainer className="h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 text-primary">
              <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
                <Home size={20} />
              </div>
              <h2 className="text-xl font-black tracking-tight hidden sm:block">OPPORTUNITY CIRCLE</h2>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      text-sm font-semibold transition-colors
                      ${isActive 
                        ? 'text-primary border-b-2 border-primary pb-1' 
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}
                    `}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-600 dark:text-slate-400" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            
            <NotificationCenter />
            
            <div className="h-8 w-px bg-slate-200 dark:bg-border-dark mx-1 hidden sm:block"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold truncate max-w-[150px]">{user?.fullName}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <Link to="/profile" className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black overflow-hidden hover:opacity-80 transition-opacity">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  user?.fullName?.charAt(0).toUpperCase()
                )}
              </Link>
            </div>
          </div>
        </MaxContainer>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* We remove padding here to allow full-width dashboards; Pages should control their container */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
