import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import useLayoutStore from '../../stores/layoutStore';

const MobileNav = () => {
  const { isMobileMenuOpen, closeMobileMenu } = useLayoutStore();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'For Publishers', path: '/publishers' },
    // Add Login/Signup later if needed, or keep it simple
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-72 border-l border-border-dark bg-surface-dark/95 shadow-hfas-lg backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-border-dark/70 p-5">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-light-gray">Navigation</span>
                <span className="text-lg font-black text-off-white">Menu</span>
              </div>
              <button
                onClick={closeMobileMenu}
                className="rounded-xl border border-border-dark bg-background-dark p-2 text-light-gray hover:border-primary/35 hover:text-off-white"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="space-y-4 p-5">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-black uppercase tracking-[0.18em] transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-light-gray hover:bg-background-dark/60 hover:text-off-white'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="space-y-3 border-t border-border-dark/70 pt-4">
                <Link to="/login" onClick={closeMobileMenu} className="w-full btn-secondary">
                  Sign In
                </Link>
                <Link to="/register" onClick={closeMobileMenu} className="w-full btn-primary">
                  Sign Up
                </Link>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
