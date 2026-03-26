import React, { useState } from 'react';
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/Sidebar';
import RightSidebar from '../../components/dashboard/RightSidebar';
import { Outlet, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Pages that should show the Right Sidebar (3-column layout)
    const showRightSidebar = location.pathname.includes('/feed') || 
                            location.pathname.includes('/internships') || 
                            location.pathname.includes('/scholarships') || 
                            location.pathname.includes('/fellowships') || 
                            location.pathname.includes('/workshops') ||
                            location.pathname === '/dashboard'; // default feed

    // Pages that should be centered with a max-width (Profile, Settings, Resources)
    const isCenteredPage = location.pathname.includes('/profile') || 
                            location.pathname.includes('/settings') || 
                            location.pathname.includes('/resources');

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden text-zinc-100 bg-zinc-950 font-display antialiased">
            <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile Sidebar Backdrop */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
                
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                
                <main className={`flex-1 overflow-y-auto bg-zinc-950 custom-scrollbar ${isCenteredPage ? 'flex flex-col' : ''}`}>
                    <div className={isCenteredPage ? "w-full max-w-7xl mx-auto" : "w-full"}>
                        <Outlet />
                    </div>
                </main>
                {showRightSidebar && <RightSidebar />}
            </div>
        </div>
    );
};

export default DashboardLayout;
