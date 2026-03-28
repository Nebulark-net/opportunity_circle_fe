import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileNav from '../components/layout/MobileNav';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background-dark text-off-white">
      <Header />
      <MobileNav />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
