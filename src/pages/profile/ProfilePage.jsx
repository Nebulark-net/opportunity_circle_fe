import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import ProfileEditForm from '../../components/profile/ProfileEditForm';
import Sidebar from '../../components/dashboard/Sidebar';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background-dark">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {isEditing ? (
            <ProfileEditForm 
              initialData={user} 
              onCancel={() => setIsEditing(false)} 
              onSuccess={() => setIsEditing(false)}
            />
          ) : (
            <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl">
              {/* Profile Header */}
              <div className="h-32 bg-gradient-to-r from-primary/20 to-blue-600/20 border-b border-border-dark relative">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute top-6 right-8 px-4 py-2 bg-border-dark hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Edit Profile
                </button>
              </div>
              
              <div className="px-8 pb-8">
                <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-12 mb-8">
                  <div className="size-24 rounded-2xl bg-border-dark border-4 border-surface-dark overflow-hidden shadow-xl">
                    {user?.profilePhotoUrl ? (
                      <img src={user.profilePhotoUrl} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-4xl">person</span>
                      </div>
                    )}
                  </div>
                  <div className="pb-2">
                    <h1 className="text-3xl font-black text-white">{user?.fullName}</h1>
                    <p className="text-slate-400 font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column: Bio & Info */}
                  <div className="md:col-span-2 space-y-8">
                    <section>
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">About</h3>
                      <p className="text-slate-300 leading-relaxed bg-background-dark/50 p-4 rounded-xl border border-border-dark">
                        {user?.bio || "No bio added yet. Tell recruiters about your professional journey."}
                      </p>
                    </section>

                    <section>
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Education</h3>
                      <div className="flex items-start gap-4 bg-background-dark/50 p-4 rounded-xl border border-border-dark">
                        <span className="material-symbols-outlined text-primary">school</span>
                        <div>
                          <p className="text-white font-bold">{user?.education || "Institution not specified"}</p>
                          <p className="text-slate-400 text-sm">{user?.fieldOfStudy} • {user?.degreeLevel || "Degree not specified"}</p>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Sidebar Info */}
                  <div className="space-y-6">
                    <div className="bg-background-dark/50 p-6 rounded-xl border border-border-dark">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Details</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-300">
                          <span className="material-symbols-outlined text-sm text-slate-500">public</span>
                          <span className="text-sm">{user?.country || "Earth"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                          <span className="material-symbols-outlined text-sm text-slate-500">verified_user</span>
                          <span className="text-sm">Verified Seeker</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                      <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Account Type</h3>
                      <p className="text-white font-bold mb-4">Free Plan</p>
                      <button className="w-full py-2 bg-primary text-[#101c22] text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">
                        Upgrade to Pro
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
