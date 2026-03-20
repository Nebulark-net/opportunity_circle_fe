import React from 'react';
import Header from '../components/dashboard/Header';
import PublisherSidebar from '../components/dashboard/PublisherSidebar';
import { Outlet } from 'react-router-dom';

const PublisherLayout = () => {
    return (
        <div className="relative flex h-screen w-full flex-col overflow-x-hidden bg-zinc-950 text-zinc-100 font-sans">
            <Header />
            <div className="flex flex-1 overflow-hidden relative">
                <PublisherSidebar />
                <main className="flex-1 overflow-y-auto bg-zinc-950">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PublisherLayout;
