import React from 'react';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';

const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Contact Us</h1>
      <p className="text-slate-600 dark:text-accent-muted mb-12">
        Have questions? We're here to help. Send us a message and we'll get back to you as soon as possible.
      </p>
      
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-surface-dark p-8 rounded-xl border border-slate-100 dark:border-border-dark shadow-lg">
        <Input label="Full Name" placeholder="John Doe" />
        <Input label="Email Address" placeholder="john@example.com" type="email" />
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
          <textarea 
            className="w-full bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-button px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none transition-all dark:text-white min-h-[150px]"
            placeholder="How can we help you?"
          ></textarea>
        </div>
        <Button className="md:col-span-2 py-3 font-bold">Send Message</Button>
      </form>
    </div>
  );
};

export default Contact;
