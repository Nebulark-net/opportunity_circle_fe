import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: 'How do I apply for an opportunity?',
      answer: 'Once you find an opportunity you like, click on the "View Details" button. On the detail page, you will find an "Apply" button that will either guide you through our internal application process or redirect you to the publisher\'s website.'
    },
    {
      question: 'Is Opportunity Circle free for students?',
      answer: 'Yes! Opportunity Circle is completely free for students and early-career professionals to search and apply for opportunities.'
    },
    {
      question: 'How can I post an opportunity as a publisher?',
      answer: 'To post an opportunity, you need to register as a "Publisher". Once logged in, you can access your dashboard and click on "Create Opportunity" to fill out the listing details.'
    },
    {
      question: 'What types of opportunities are available?',
      answer: 'We host a wide range of opportunities including scholarships, internships, fellowships, grants, and competitions from global organizations and educational institutions.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 text-center">Frequently Asked Questions</h1>
      <p className="text-slate-600 dark:text-accent-muted mb-12 text-center">
        Everything you need to know about using Opportunity Circle.
      </p>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="p-6 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-border-dark shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h3>
            <p className="text-slate-600 dark:text-accent-muted">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
