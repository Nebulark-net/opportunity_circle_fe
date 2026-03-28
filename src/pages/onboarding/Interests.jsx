import React, { useState } from 'react';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { toast } from 'sonner';

const INTEREST_TYPES = [
    { id: 'SCHOLARSHIP', label: 'Scholarships', icon: 'school' },
    { id: 'INTERNSHIP', label: 'Internships', icon: 'work' },
    { id: 'FELLOWSHIP', label: 'Fellowships', icon: 'workspace_premium' },
    { id: 'EVENT', label: 'Events', icon: 'event' },
    { id: 'WORKSHOP', label: 'Workshops', icon: 'groups' },
    { id: 'GRANT', label: 'Grants', icon: 'monetization_on' },
    { id: 'MENTORSHIP', label: 'Mentorship', icon: 'psychology' },
];

const Interests = ({ onContinue, onBack }) => {
    const { data, updateData, syncStep2 } = useOnboardingStore();
    const [selectedTypes, setSelectedTypes] = useState(data.interests || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleType = (typeId) => {
        setSelectedTypes(prev =>
            prev.includes(typeId)
                ? prev.filter(t => t !== typeId)
                : [...prev, typeId]
        );
    };

    const onNext = async () => {
        if (selectedTypes.length === 0) {
            toast.error('Please select at least one interest');
            return;
        }

        setIsSubmitting(true);
        try {
            await syncStep2(selectedTypes);
            updateData({ interests: selectedTypes });
            toast.success('Interests saved!');
            onContinue();
        } catch {
            toast.error('Failed to save progress. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 p-0">
            <div 
                className="h-48 bg-cover bg-center relative flex flex-col justify-end p-8"
                style={{backgroundImage: "linear-gradient(to top, rgba(26,26,26,1), rgba(26,26,26,0.4)), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')"}}
            >
                <h1 className="text-3xl font-black text-off-white relative z-10 uppercase tracking-tighter">Interests</h1>
                <p className="text-primary font-black text-xs uppercase tracking-widest relative z-10">Tailor your experience</p>
            </div>

            <div className="p-8 flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <span className="text-primary text-xs font-black uppercase tracking-widest">Step 2 of 3</span>
                        <span className="text-light-gray text-[10px] font-black uppercase tracking-widest opacity-60">66% Complete</span>
                    </div>
                    <div className="w-full bg-background-dark h-1.5 rounded-full overflow-hidden border border-border-dark/30">
                        <div className="bg-primary h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,167,149,0.5)]" style={{width: "66%"}}></div>
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <div>
                        <h2 className="text-off-white text-lg font-black uppercase tracking-tight mb-1">What are you looking for?</h2>
                        <p className="text-light-gray text-sm font-medium opacity-80">Select the categories that align with your career goals.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {INTEREST_TYPES.map((type) => {
                            const isActive = selectedTypes.includes(type.id);
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => toggleType(type.id)}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all font-black uppercase tracking-tighter text-[11px] ${
                                        isActive
                                            ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,167,149,0.1)]'
                                            : 'border-border-dark bg-background-dark/50 text-light-gray hover:border-primary/50 hover:text-off-white'
                                    }`}
                                >
                                    <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-primary' : 'text-light-gray'}`}>{type.icon}</span>
                                    {type.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                    <button 
                        onClick={onNext} 
                        disabled={selectedTypes.length === 0 || isSubmitting} 
                        className="w-full btn-primary h-14 text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 group"
                    >
                        {isSubmitting ? 'Saving Progress...' : 'Continue to Preferences'}
                        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                    </button>
                    <button 
                        onClick={onBack} 
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-light-gray hover:text-primary transition-colors text-center py-2"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Interests;
