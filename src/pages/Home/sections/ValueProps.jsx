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
    <section className="border-y border-border-dark/60 bg-surface_container_low/70 py-16">
      <MaxContainer>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="mb-4 text-3xl font-bold text-off-white">Empowering the Next Generation</h2>
          <p className="leading-relaxed text-accent-muted">
            Opportunity Circle connects ambitious talent with world-class opportunities across the globe. We simplify the search so you can focus on applying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="rounded-card border border-border-dark bg-surface-dark p-6 shadow-hfas-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-hfas-lg">
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-off-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-accent-muted">
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
