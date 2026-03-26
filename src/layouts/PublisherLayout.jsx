import React from 'react';
import Header from '../components/dashboard/Header';
import PublisherSidebar from '../components/dashboard/PublisherSidebar';
import { Outlet } from 'react-router-dom';
import { useUIStore } from '../stores/uiStore';

const PublisherLayout = () => {
    const { isSidebarOpen, toggleSidebar, closeSidebar } = useUIStore();

    return (
        <div className="relative flex h-screen w-full flex-col overflow-x-hidden bg-zinc-950 text-zinc-100 font-sans">
            <Header onMenuToggle={toggleSidebar} />
            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile Sidebar Backdrop */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
                        onClick={closeSidebar}
                    />
                )}
                
                <PublisherSidebar />
                <main className="flex-1 overflow-y-auto bg-zinc-950">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PublisherLayout;
