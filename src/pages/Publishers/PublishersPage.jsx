import React from 'react';
import { Link } from 'react-router-dom';

const PublishersPage = () => {
  return (
    <div className="w-full h-full block flex-col bg-background-light dark:bg-background-dark font-display text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <main className="flex-1 w-full flex flex-col">
        {/* Hero Section */}
        <section className="px-6 md:px-10 lg:px-40 py-16 md:py-24">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <span className="text-primary font-bold tracking-widest uppercase text-xs">For Publishers & Employers</span>
                  <h1 className="text-zinc-900 dark:text-zinc-100 text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                    Empower Future Talent with Opportunity Circle
                  </h1>
                  <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl font-normal leading-relaxed max-w-xl">
                    Streamline your listing process and reach the right candidates effortlessly. Connect with the next generation of global leaders and top-tier talent.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register?role=PUBLISHER" className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    Sign Up as Publisher
                  </Link>
                  <Link to="/contact" className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 border border-zinc-700 dark:border-zinc-800/20 text-zinc-900 dark:text-white text-base font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800/20 transition-colors">
                    View Demo
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800/20 border border-zinc-300 dark:border-zinc-800/20 shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
                  <div
                    className="w-full h-full bg-cover bg-center opacity-80"
                    title="Modern office space with team collaborating on tech projects"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDnCBy-7UL78SgGVpVT8dykd7gNmPw28yu-VKqEX1KAKcFocH7jv61jOa0r_203PR22_rIlezkGj0MZdIAuFPLcGzcfIHQdeJdc1rPAvtR_U-htWmKlRL9xYHqMOYRkmG3kuWLYciOz20mTyrIoUVk5GtyQVsV6-VhxEapWz2LdkpYP-8swGQ0hDqYEHMOybL-YqxbrM9Z3J3kHPfhbYqedLfz1wZ6KHUtggu0Hb71IxmTht5RoshJ7XL-JmO4MRM_EY8iKtom7-9E")' }}
                  ></div>
                  <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800/20 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-primary/20 text-primary">
                        <span className="material-symbols-outlined">trending_up</span>
                      </div>
                      <div>
                        <p className="text-zinc-900 dark:text-white font-bold text-sm">+124% Engagement</p>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs">Compared to traditional job boards</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="px-6 md:px-10 lg:px-40 py-20 bg-slate-50 dark:bg-zinc-900/50">
          <div className="mx-auto max-w-[1200px]">
            <div className="text-center mb-16">
              <h2 className="text-zinc-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight mb-4">Why Publish with Us?</h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">Our platform is designed to make listing and managing opportunities seamless, providing you with the tools to find the perfect fit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Easy Listing */}
              <div className="group flex flex-col gap-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/20 bg-zinc-800/50 dark:bg-slate-custom-900 p-8 hover:border-primary/50 transition-all duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">edit_note</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-zinc-900 dark:text-white text-xl font-bold">Easy Listing</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Post opportunities in minutes with our intuitive structured interface. Auto-formatting ensures your listings always look professional.</p>
                </div>
              </div>

              {/* Verified Reach */}
              <div className="group flex flex-col gap-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/20 bg-zinc-800/50 dark:bg-slate-custom-900 p-8 hover:border-primary/50 transition-all duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">verified_user</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-zinc-900 dark:text-white text-xl font-bold">Verified Reach</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Access a targeted audience of early-career talent and verified candidates across 150+ countries and top universities.</p>
                </div>
              </div>

              {/* Actionable Analytics */}
              <div className="group flex flex-col gap-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/20 bg-zinc-800/50 dark:bg-slate-custom-900 p-8 hover:border-primary/50 transition-all duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">insights</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-zinc-900 dark:text-white text-xl font-bold">Actionable Analytics</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">Track views, saves, and clicks with real-time performance data. Optimization suggestions powered by AI to boost applicant quality.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="px-6 md:px-10 lg:px-40 py-24">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/2 order-2 lg:order-1">
                <div className="bg-zinc-800/50 dark:bg-slate-custom-900 rounded-2xl border border-zinc-200 dark:border-zinc-800/20 p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-8 border-b border-zinc-200 dark:border-zinc-800/20 pb-4">
                    <h4 className="text-zinc-900 dark:text-white font-bold">Publisher Dashboard Preview</h4>
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
                      <div className="h-3 w-3 rounded-full bg-amber-500/50"></div>
                      <div className="h-3 w-3 rounded-full bg-emerald-500/50"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-background-dark border border-zinc-200 dark:border-zinc-800/20">
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">Total Views</p>
                      <p className="text-zinc-900 dark:text-white text-2xl font-black">24.8k</p>
                      <p className="text-emerald-500 text-[10px] font-bold mt-1">&#8593; 12%</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-background-dark border border-zinc-200 dark:border-zinc-800/20">
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">Applicants</p>
                      <p className="text-zinc-900 dark:text-white text-2xl font-black">1,402</p>
                      <p className="text-emerald-500 text-[10px] font-bold mt-1">&#8593; 8%</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-background-dark border border-zinc-200 dark:border-zinc-800/20">
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-1">Conversion</p>
                      <p className="text-zinc-900 dark:text-white text-2xl font-black">5.6%</p>
                      <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold mt-1">Stable</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-32 w-full bg-slate-50 dark:bg-background-dark rounded-xl relative overflow-hidden flex items-end px-2 gap-1">
                      <div className="flex-1 bg-primary/20 h-[40%] rounded-t-sm"></div>
                      <div className="flex-1 bg-primary/30 h-[60%] rounded-t-sm"></div>
                      <div className="flex-1 bg-primary/40 h-[45%] rounded-t-sm"></div>
                      <div className="flex-1 bg-primary/50 h-[80%] rounded-t-sm"></div>
                      <div className="flex-1 bg-primary/60 h-[55%] rounded-t-sm"></div>
                      <div className="flex-1 bg-primary h-[95%] rounded-t-sm"></div>
                      <div className="flex-1 bg-primary/80 h-[70%] rounded-t-sm"></div>
                      <div className="flex-1 bg-primary/60 h-[40%] rounded-t-sm"></div>
                      <div className="flex-1 bg-primary/40 h-[65%] rounded-t-sm"></div>
                      <div className="flex-1 bg-primary/30 h-[50%] rounded-t-sm"></div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-zinc-400 dark:text-zinc-500">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 flex flex-col gap-6 order-1 lg:order-2">
                <h2 className="text-zinc-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">Master your metrics.</h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                  Our dashboard gives you a complete overview of how your opportunities are performing. Identify trends, manage applicants, and optimize your outreach strategy in one centralized location.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span className="text-zinc-700 dark:text-zinc-300">Real-time geographic breakdown of interested talent.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span className="text-zinc-700 dark:text-zinc-300">Automated candidate matching and screening alerts.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span className="text-zinc-700 dark:text-zinc-300">Exportable reports for internal stakeholder reviews.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 md:px-10 lg:px-40 py-24 bg-primary">
          <div className="mx-auto max-w-[800px] text-center flex flex-col items-center gap-8">
            <h2 className="text-white text-4xl md:text-5xl font-black leading-tight">Ready to share your opportunities?</h2>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl">
              Join thousands of organizations finding world-class talent every day. Start your first listing in under 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/register?role=PUBLISHER" className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-white text-primary text-base font-bold shadow-xl hover:bg-slate-50 transition-all">
                Get Started Now
              </Link>
              <Link to="/contact" className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 border-2 border-white/30 bg-white/10 text-white text-base font-bold hover:bg-white/20 transition-all">
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PublishersPage;
