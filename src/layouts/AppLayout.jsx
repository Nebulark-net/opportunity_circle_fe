import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const AppLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background-dark font-display text-off-white antialiased">
            <Header />
            <main className="flex-1 flex">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default AppLayout;
