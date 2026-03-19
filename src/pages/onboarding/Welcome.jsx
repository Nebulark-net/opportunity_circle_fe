import React from 'react';
import { useForm } from 'react-hook-form';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'sonner';

const Welcome = ({ onContinue }) => {
  const { data, updateData, syncStep1 } = useOnboardingStore();
  const { user, updateProfile } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      fullName: data.fullName || user?.fullName || '',
      country: data.country || user?.country || '',
    }
  });

  const onSubmit = async (formData) => {
    try {
      await syncStep1(formData);
      updateData(formData);
      updateProfile(formData);
      toast.success('Profile info saved!');
      onContinue();
    } catch (error) {
      toast.error('Failed to save progress. Please try again.');
    }
  };

  return (
    <div className="card w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col gap-3 p-6 pb-4 border-b border-border-dark/50 bg-background-dark/30">
            <div className="flex justify-between items-center">
                <p className="text-primary text-xs font-black uppercase tracking-widest">Step 1 of 3</p>
                <p className="text-light-gray text-[10px] font-black uppercase tracking-widest opacity-60">Onboarding</p>
            </div>
            <div className="rounded-full bg-background-dark h-1.5 overflow-hidden border border-border-dark/30">
                <div className="h-full rounded-full bg-primary shadow-[0_0_10px_rgba(0,167,149,0.5)] transition-all duration-700 ease-out" style={{width: "33%"}}></div>
            </div>
        </div>
        <div className="p-8">
            <div className="flex flex-col gap-2 mb-10">
                <h1 className="text-off-white text-3xl font-black leading-tight tracking-tighter uppercase">Welcome</h1>
                <p className="text-light-gray text-sm font-medium leading-relaxed opacity-80">Let's build your professional identity. This helps us curate the most relevant opportunities for your career path.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2.5">
                    <label className="text-off-white text-xs font-black uppercase tracking-widest ml-1" htmlFor="fullName">Full Name</label>
                    <input 
                      {...register('fullName', { required: 'Full name is required' })} 
                      className={`input-field h-12 text-base font-bold ${errors.fullName ? 'border-error ring-1 ring-error/20' : ''}`} 
                      id="fullName" 
                      placeholder="e.g. Jane Doe" 
                      type="text"
                    />
                    {errors.fullName && <p className="text-error text-[10px] font-black uppercase tracking-widest ml-1 mt-1">{errors.fullName.message}</p>}
                </div>
                <div className="flex flex-col gap-2.5">
                    <label className="text-off-white text-xs font-black uppercase tracking-widest ml-1" htmlFor="country">Country</label>
                    <div className="relative">
                        <select 
                          {...register('country', { required: 'Country is required' })} 
                          className={`input-field h-12 text-base font-bold appearance-none bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.2em_1.2em] ${errors.country ? 'border-error ring-1 ring-error/20' : ''}`} 
                          id="country"
                        >
                            <option value="" disabled>Select your country</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                            <option value="IN">India</option>
                            <option value="PK">Pakistan</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-light-gray">
                            <span className="material-symbols-outlined">expand_more</span>
                        </div>
                    </div>
                    {errors.country && <p className="text-error text-[10px] font-black uppercase tracking-widest ml-1 mt-1">{errors.country.message}</p>}
                </div>
                <div className="mt-8">
                    <button 
                      disabled={isSubmitting} 
                      className="w-full btn-primary h-14 text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group" 
                      type="submit"
                    >
                        {isSubmitting ? 'Saving Progress...' : 'Continue to Interests'}
                        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default Welcome;
