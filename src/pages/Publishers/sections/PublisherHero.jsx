import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, BarChart3, ArrowRight } from 'lucide-react';
import MaxContainer from '../../../components/layout/MaxContainer';

const PublisherHero = () => {
  return (
    <section className="pt-16 pb-20 bg-slate-900 text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <MaxContainer className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary text-xs font-bold uppercase tracking-wider border border-white/10 w-fit">
              <Building2 size={14} />
              <span>For Organizations</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Reach the World's Most <span className="text-primary">Ambitious</span> Talent
            </h1>
            
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Post your scholarships, internships, and fellowships to a global audience of students and early-career professionals. Streamline your application process today.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/signup?role=publisher" 
                className="btn-primary px-8 py-3 text-base flex items-center gap-2"
              >
                Create Publisher Account
                <ArrowRight size={18} />
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-3 rounded-button font-semibold text-white border border-white/20 hover:bg-white/5 transition-colors"
              >
                Talk to Sales
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-white/10 mt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">50k+</span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Active Users</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">100+</span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Partner Orgs</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">150+</span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Countries</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="aspect-square bg-slate-800 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="grid grid-cols-2 gap-4 p-8 w-full h-full">
                   <div className="bg-slate-700/50 rounded-xl border border-white/5 p-4 flex flex-col justify-end gap-2 animate-pulse">
                      <div className="size-8 rounded-lg bg-primary/20" />
                      <div className="h-2 w-3/4 bg-slate-600 rounded" />
                   </div>
                   <div className="bg-slate-700/50 rounded-xl border border-white/5 p-4 flex flex-col justify-end gap-2 animate-pulse delay-75">
                      <div className="size-8 rounded-lg bg-accent-teal/20" />
                      <div className="h-2 w-1/2 bg-slate-600 rounded" />
                   </div>
                   <div className="col-span-2 bg-slate-700/50 rounded-xl border border-white/5 p-4 flex flex-col justify-end gap-2 animate-pulse delay-150">
                      <div className="h-4 w-1/4 bg-primary/30 rounded mb-2" />
                      <div className="h-2 w-full bg-slate-600 rounded" />
                      <div className="h-2 w-2/3 bg-slate-600 rounded" />
                   </div>
                </div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-2xl border border-slate-100 flex items-center gap-4 text-slate-900">
               <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                 <Users size={20} />
               </div>
               <div>
                 <p className="text-xs font-bold">+124% Engagement</p>
                 <p className="text-[10px] text-slate-500">vs last month</p>
               </div>
            </div>
          </div>
        </div>
      </MaxContainer>
    </section>
  );
};

export default PublisherHero;
