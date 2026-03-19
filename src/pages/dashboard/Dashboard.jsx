import React from 'react';
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/Sidebar';
import RightSidebar from '../../components/dashboard/RightSidebar';
import { Outlet, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
    const location = useLocation();
    
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
        <div className="relative flex h-screen w-full flex-col overflow-hidden text-slate-900 dark:text-slate-100 bg-background-light dark:bg-background-dark font-display antialiased">
            <Header />
            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar />
                <main className={`flex-1 overflow-y-auto bg-background-light dark:bg-background-dark custom-scrollbar ${isCenteredPage ? 'flex flex-col' : ''}`}>
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
