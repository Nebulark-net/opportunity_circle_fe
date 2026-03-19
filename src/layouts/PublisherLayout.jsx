import React from 'react';
import Header from '../components/dashboard/Header';
import PublisherSidebar from '../components/dashboard/PublisherSidebar';
import { Outlet } from 'react-router-dom';

const PublisherLayout = () => {
    return (
        <div className="relative flex h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            <Header />
            <div className="flex flex-1 overflow-hidden relative">
                <PublisherSidebar />
                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark/50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PublisherLayout;
