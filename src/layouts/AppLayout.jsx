import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const AppLayout = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default AppLayout;
