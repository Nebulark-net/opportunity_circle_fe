import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
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
            className="fixed inset-0 z-40 bg-black"
            onClick={closeMobileMenu}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-surface-dark shadow-xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-border-dark">
              <span className="text-lg font-bold text-primary">Menu</span>
              <button
                onClick={closeMobileMenu}
                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="p-4 space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg text-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-slate-200 dark:border-border-dark space-y-3">
                <button className="w-full btn-secondary">Sign In</button>
                <button className="w-full btn-primary">Sign Up</button>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
