import React from 'react';
import { GraduationCap, Briefcase, Globe } from 'lucide-react';
import MaxContainer from '../../../components/layout/MaxContainer';

const ValueProps = () => {
  const features = [
    {
      icon: <GraduationCap size={24} />,
      title: "Scholarships",
      description: "Find funded programs to support your education and research goals at top universities."
    },
    {
      icon: <Briefcase size={24} />,
      title: "Internships",
      description: "Gain hands-on experience at top organizations worldwide to jumpstart your career."
    },
    {
      icon: <Globe size={24} />,
      title: "Global Reach",
      description: "Access opportunities from over 50 countries tailored to your specific field of study."
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-surface-dark/50 border-y border-slate-100 dark:border-border-dark/50">
      <MaxContainer>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Empowering the Next Generation</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Opportunity Circle connects ambitious talent with world-class opportunities across the globe. We simplify the search so you can focus on applying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-card bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-border-dark hover:shadow-md transition-shadow">
              <div className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
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

export default ValueProps;
