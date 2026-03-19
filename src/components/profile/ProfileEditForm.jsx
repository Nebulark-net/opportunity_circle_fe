import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuthStore } from '../../stores/authStore';
import { uploadProfilePhoto } from '../../utils/cloudinaryUpload';
import Button from '../shared/Button';
import Input from '../shared/Input';
import api from '../../lib/api';

const ProfileEditForm = ({ initialData, onCancel, onSuccess }) => {
  const { updateProfile } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(initialData?.profilePhotoUrl || '');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      fullName: initialData?.fullName || '',
      bio: initialData?.bio || '',
      country: initialData?.country || '',
      education: initialData?.education || '',
      fieldOfStudy: initialData?.fieldOfStudy || '',
    }
  });

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      const photoUrl = await uploadProfilePhoto(file);
      updateProfile({ profilePhotoUrl: photoUrl });
      toast.success('Profile photo updated!');
    } catch (error) {
      toast.error('Failed to upload photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const response = await api.patch('/seekers/profile', formData);
      if (response.data.success) {
        updateProfile(response.data.data);
        toast.success('Profile updated successfully!');
        onSuccess && onSuccess();
      }
    } catch (error) {
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div className="bg-surface-dark border border-border-dark rounded-xl p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">Edit Professional Profile</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo Upload */}
        <div className="flex flex-col items-center sm:flex-row sm:gap-8 pb-6 border-b border-border-dark">
          <div className="size-24 rounded-full bg-border-dark border-2 border-primary/30 overflow-hidden flex-shrink-0 relative group">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-slate-500 flex items-center justify-center h-full">person</span>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
              </div>
            )}
          </div>
          
          <div className="mt-4 sm:mt-0">
            <label className="block text-sm font-medium text-slate-300 mb-2">Profile Photo</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoChange}
              className="hidden" 
              id="photo-upload"
            />
            <label 
              htmlFor="photo-upload"
              className="cursor-pointer px-4 py-2 bg-border-dark hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors inline-block"
            >
              Choose New Image
            </label>
            <p className="text-[10px] text-slate-500 mt-2">JPG, PNG or WEBP. Max 5MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            {...register('fullName', { required: 'Name is required' })}
            error={errors.fullName?.message}
          />
          <Input
            label="Country"
            {...register('country')}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Professional Bio</label>
          <textarea
            {...register('bio')}
            rows={4}
            className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            placeholder="Tell recruiters about yourself..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Current Institution"
            {...register('education')}
          />
          <Input
            label="Field of Study"
            {...register('fieldOfStudy')}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button 
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-slate-400 hover:text-white text-sm font-bold transition-colors"
          >
            Cancel
          </button>
          <Button 
            type="submit"
            isLoading={isSubmitting}
            className="px-8 py-2 bg-primary text-[#101c22] text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
