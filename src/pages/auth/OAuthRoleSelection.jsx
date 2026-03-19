import { motion } from 'framer-motion';

const OAuthRoleSelection = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState('SEEKER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.patch('/auth/me/role', { role: selectedRole });
      const updatedUser = response.data.data;
      
      updateProfile(updatedUser);
      toast.success(`Welcome aboard! You are now set as a ${selectedRole.toLowerCase()}.`);

      if (selectedRole === 'SEEKER') {
        navigate('/onboarding');
      } else {
        navigate('/publisher/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to finalize setup');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center p-6">
        {/* Background Decoration */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
            <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[120px]"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px]"></div>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-10 w-full max-w-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-10 rounded-[32px] shadow-2xl backdrop-blur-xl text-center"
        >
            <div className="mb-10">
                <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-primary text-4xl">verified_user</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-3">One Last Step</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
                    Identify your role to help us customize your workspace protocol.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
                <button
                    type="button"
                    onClick={() => setSelectedRole('SEEKER')}
                    className={`flex flex-col gap-4 p-6 rounded-2xl border-2 transition-all duration-300 ${
                        selectedRole === 'SEEKER' 
                            ? 'border-primary bg-primary/5 text-primary shadow-xl shadow-primary/10' 
                            : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200'
                    }`}
                >
                    <div className={`size-12 rounded-xl flex items-center justify-center ${selectedRole === 'SEEKER' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                        <span className="material-symbols-outlined text-2xl">search</span>
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase tracking-tighter mb-1">I am a Seeker</p>
                        <p className="text-xs font-medium opacity-70">Looking for scholarships, internships & career growth.</p>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => setSelectedRole('PUBLISHER')}
                    className={`flex flex-col gap-4 p-6 rounded-2xl border-2 transition-all duration-300 ${
                        selectedRole === 'PUBLISHER' 
                            ? 'border-primary bg-primary/5 text-primary shadow-xl shadow-primary/10' 
                            : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200'
                    }`}
                >
                    <div className={`size-12 rounded-xl flex items-center justify-center ${selectedRole === 'PUBLISHER' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                        <span className="material-symbols-outlined text-2xl">campaign</span>
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase tracking-tighter mb-1">I am a Publisher</p>
                        <p className="text-xs font-medium opacity-70">Post opportunities and manage high-quality talent pools.</p>
                    </div>
                </button>
            </div>

            <button
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 px-8 rounded-2xl shadow-2xl shadow-primary/30 transition-all transform active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-sm"
            >
                {isSubmitting ? 'Initalizing Environment...' : 'Finish Environment Setup'}
            </button>
        </motion.div>
    </div>
  );
};

export default OAuthRoleSelection;
