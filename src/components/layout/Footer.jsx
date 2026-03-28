import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative mt-auto border-t border-border-dark/70 bg-background-dark px-6 py-14 text-light-gray">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 md:grid-cols-4">
                <div className="col-span-1 flex flex-col gap-6 md:col-span-2">
                    <div className="flex items-center gap-3 text-off-white">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-hfas-teal-sm">
                            <span className="material-symbols-outlined text-lg">auto_awesome</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-light-gray">Midnight Obsidian</span>
                            <h2 className="text-lg font-black text-off-white">Opportunity Circle</h2>
                        </div>
                    </div>
                    <p className="max-w-md text-sm leading-7 text-accent-muted">
                        Bridging the gap between ambitious talent and world-class opportunities. Our platform ensures that the best career paths are accessible to everyone, everywhere.
                    </p>
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-primary">
                        <span className="material-symbols-outlined text-sm">bolt</span>
                        Editorial Opportunity Feed
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.22em] text-off-white">Platform</h4>
                    <nav className="flex flex-col gap-2">
                        <Link className="hover:text-primary transition-colors" to="/explore?type=scholarship">Scholarships</Link>
                        <Link className="hover:text-primary transition-colors" to="/explore?type=internship">Internships</Link>
                        <Link className="hover:text-primary transition-colors" to="/explore?type=fellowship">Fellowships</Link>
                        <Link className="hover:text-primary transition-colors" to="/pricing">Pricing</Link>
                    </nav>
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.22em] text-off-white">Support</h4>
                    <nav className="flex flex-col gap-2">
                        <Link className="hover:text-primary transition-colors" to="/contact">Help Center</Link>
                        <Link className="hover:text-primary transition-colors" to="/contact">Contact Us</Link>
                        <Link className="hover:text-primary transition-colors" to="/privacy">Privacy Policy</Link>
                        <Link className="hover:text-primary transition-colors" to="/terms">Terms of Service</Link>
                    </nav>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border-dark/70 text-center text-xs text-light-gray">
                © {new Date().getFullYear()} Opportunity Circle. Empowering the next generation of professionals.
            </div>
        </footer>
    );
};

export default Footer;
