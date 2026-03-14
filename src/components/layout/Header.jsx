import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Rocket } from 'lucide-react';
import useLayoutStore from '../../stores/layoutStore';
import MaxContainer from './MaxContainer';
import AuthButtons from './AuthButtons';

const Header = () => {
  const { openMobileMenu } = useLayoutStore();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'For Publishers', path: '/publishers' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-border-dark">
      <MaxContainer className="h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
          <div className="p-1.5 bg-primary rounded-lg text-white shadow-sm">
            <Rocket size={20} />
          </div>
          <span className="tracking-tight uppercase font-black">Saas</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-bold transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-300'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <AuthButtons />
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={openMobileMenu}
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </MaxContainer>
    </header>
  );
};

export default Header;
