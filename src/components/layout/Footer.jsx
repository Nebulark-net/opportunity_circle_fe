import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Twitter, Linkedin, Github } from 'lucide-react';
import MaxContainer from './MaxContainer';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-border-dark py-12">
      <MaxContainer>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white mb-4">
              <div className="p-1.5 bg-primary rounded-lg text-white">
                <Rocket size={20} />
              </div>
              <span>Saas</span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Connecting ambitious talent with world-changing opportunities. Launch your career today.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/explore" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm">Browse Opportunities</Link></li>
              <li><Link to="/publishers" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm">For Publishers</Link></li>
              <li><Link to="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm">About Us</Link></li>
              <li><Link to="/careers" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm">Careers</Link></li>
              <li><Link to="/blog" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-border-dark flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} Saas Inc. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><Github size={20} /></a>
          </div>
        </div>
      </MaxContainer>
    </footer>
  );
};

export default Footer;
