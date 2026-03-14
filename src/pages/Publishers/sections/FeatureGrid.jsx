import React from 'react';
import { LayoutDashboard, Users2, LineChart, ShieldCheck } from 'lucide-react';
import MaxContainer from '../../../components/layout/MaxContainer';

const FeatureGrid = () => {
  const features = [
    {
      icon: <LayoutDashboard className="text-primary" />,
      title: "Powerful Dashboard",
      description: "Manage all your listings, applications, and team members from one intuitive interface."
    },
    {
      icon: <Users2 className="text-primary" />,
      title: "Applicant Tracking",
      description: "Filter, sort, and manage candidates easily. Communicate directly through our platform."
    },
    {
      icon: <LineChart className="text-primary" />,
      title: "Advanced Analytics",
      description: "Track views, application rates, and engagement metrics to optimize your reach."
    },
    {
      icon: <ShieldCheck className="text-primary" />,
      title: "Verified Identity",
      description: "Build trust with candidates through our organization verification and secure platform."
    }
  ];

  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <MaxContainer>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Everything you need to manage opportunities</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Stop juggling spreadsheets and emails. Our platform provides the tools you need to reach and manage top talent efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col gap-4">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </MaxContainer>
    </section>
  );
};

export default FeatureGrid;
