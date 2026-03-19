import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useAuthStore } from '../../stores/authStore';

const Preferences = ({ onBack }) => {
    const navigate = useNavigate();
    const { data, updateData, syncStep3, resetOnboarding } = useOnboardingStore();
    const { user, updateProfile } = useAuthStore();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            fieldOfStudy: data.preferences?.fieldOfStudy || '',
            targetLocations: data.preferences?.targetLocations?.join(', ') || '',
        }
    });

    const onSubmit = async (formData) => {
        try {
            const preferences = {
                fieldOfStudy: formData.fieldOfStudy,
                targetLocations: formData.targetLocations.split(',').map(l => l.trim()).filter(l => l),
            };

            await syncStep3(preferences);
            updateData({ preferences });

            updateProfile({ onboardingCompleted: true });
            resetOnboarding();

            toast.success('Onboarding complete! Welcome to Opportunity Circle.');

            const target = user?.role === 'PUBLISHER' ? '/publisher/dashboard' : '/dashboard';
            navigate(target);
        } catch (error) {
            console.error('Onboarding Error:', error);
            toast.error('Failed to complete onboarding. Please try again.');
        }
    };

    return (
        <div className="card w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-off-white mb-2 uppercase tracking-tighter">Final Setup</h1>
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest">Step 3 of 3 • Optimization</p>
                </div>
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-light-gray text-[10px] font-black uppercase tracking-widest opacity-60">Ready to Launch</span>
                        <span className="text-primary text-[10px] font-black uppercase tracking-widest">100%</span>
                    </div>
                    <div className="w-full bg-background-dark h-1.5 rounded-full overflow-hidden border border-border-dark/30">
                        <div className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(0,167,149,0.5)]" style={{ width: "100%" }}></div>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex flex-col gap-2.5">
                        <label className="text-off-white text-xs font-black uppercase tracking-widest ml-1" htmlFor="fieldOfStudy">Field of Study</label>
                        <div className="relative">
                            <select 
                                {...register('fieldOfStudy', { required: 'Field of study is required' })} 
                                className={`input-field h-12 text-base font-bold appearance-none ${errors.fieldOfStudy ? 'border-error ring-1 ring-error/20' : ''}`} 
                                id="fieldOfStudy"
                            >
                                <option value="" disabled>e.g., Computer Science, Arts</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Arts & Humanities">Arts & Humanities</option>
                                <option value="Business & Finance">Business & Finance</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Sciences">Sciences</option>
                                <option value="Other">Other</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-light-gray">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                        {errors.fieldOfStudy && <p className="text-error text-[10px] font-black uppercase tracking-widest ml-1 mt-1">{errors.fieldOfStudy.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <label className="text-off-white text-xs font-black uppercase tracking-widest ml-1" htmlFor="targetLocations">Target Locations</label>
                        <input 
                            {...register('targetLocations', { required: 'Target locations are required' })} 
                            className={`input-field h-12 text-base font-bold ${errors.targetLocations ? 'border-error ring-1 ring-error/20' : ''}`} 
                            id="targetLocations" 
                            placeholder="e.g., San Francisco, Remote" 
                            type="text" 
                        />
                        {errors.targetLocations && <p className="text-error text-[10px] font-black uppercase tracking-widest ml-1 mt-1">{errors.targetLocations.message}</p>}
                    </div>
                    <div className="pt-4 flex flex-col gap-4">
                        <button 
                            disabled={isSubmitting} 
                            className="w-full btn-primary h-14 text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 group" 
                            type="submit"
                        >
                            {isSubmitting ? 'Finalizing Profile...' : 'Complete & Enter'}
                            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform duration-300">rocket_launch</span>
                        </button>
                        <button 
                            type="button" 
                            onClick={onBack} 
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-light-gray hover:text-primary transition-colors text-center py-2"
                        >
                            Go Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Preferences;
