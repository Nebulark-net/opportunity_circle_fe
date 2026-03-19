import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-white">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
                            <span className="material-symbols-outlined text-lg">auto_awesome</span>
                        </div>
                        <h2 className="text-lg font-bold">Opportunity Circle</h2>
                    </div>
                    <p className="max-w-sm leading-relaxed">
                        Bridging the gap between ambitious talent and world-class opportunities. Our platform ensures that the best career paths are accessible to everyone, everywhere.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-bold">Platform</h4>
                    <nav className="flex flex-col gap-2">
                        <Link className="hover:text-primary transition-colors" to="/explore?type=scholarship">Scholarships</Link>
                        <Link className="hover:text-primary transition-colors" to="/explore?type=internship">Internships</Link>
                        <Link className="hover:text-primary transition-colors" to="/explore?type=fellowship">Fellowships</Link>
                        <Link className="hover:text-primary transition-colors" to="/pricing">Pricing</Link>
                    </nav>
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-bold">Support</h4>
                    <nav className="flex flex-col gap-2">
                        <Link className="hover:text-primary transition-colors" to="/contact">Help Center</Link>
                        <Link className="hover:text-primary transition-colors" to="/contact">Contact Us</Link>
                        <Link className="hover:text-primary transition-colors" to="/privacy">Privacy Policy</Link>
                        <Link className="hover:text-primary transition-colors" to="/terms">Terms of Service</Link>
                    </nav>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
                © {new Date().getFullYear()} Opportunity Circle. Empowering the next generation of professionals.
            </div>
        </footer>
    );
};

export default Footer;
