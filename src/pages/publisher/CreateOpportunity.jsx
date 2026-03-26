import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { publisherService } from '../../services/publisher.service';
import { opportunitiesService } from '../../services/opportunities.service';
import { 
  Info, 
  Verified, 
  CalendarDays, 
  ChevronRight, 
  Image as ImageIcon,
  MapPin,
  Link as LinkIcon,
  AlertCircle,
  Bold,
  Italic,
  List,
  Send
} from 'lucide-react';

const opportunitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  type: z.string(),
  company: z.string().min(2, 'Organization name required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(2, 'Location required'),
  educationLevel: z.string(),
  specificRequirements: z.string().optional(),
  deadline: z.string().min(1, 'Deadline required'),
  applyUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  salary: z.string().optional(),
  fundingType: z.string().optional(),
});

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(opportunitySchema),
    defaultValues: JSON.parse(localStorage.getItem('opportunity_draft') || '{}'),
  });

  const { data: existingOpp } = useQuery({
    queryKey: ['publisher-opportunity', id],
    queryFn: () => opportunitiesService.getOne(id),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (existingOpp?.data) {
      const opp = existingOpp.data;
      reset({
        title: opp.title?.en || opp.title,
        company: opp.organizationName,
        type: opp.type?.toLowerCase().replace('_', '-'),
        location: opp.location,
        educationLevel: opp.educationLevel?.toLowerCase().replace('_', ' ') || 'Any',
        specificRequirements: opp.specificRequirements?.en || opp.specificRequirements || '',
        deadline: opp.deadline ? new Date(opp.deadline).toISOString().split('T')[0] : '',
        description: opp.description?.en || opp.description,
        applyUrl: opp.applyUrl || '',
        salary: opp.salary || '',
        fundingType: opp.fundingType || 'N/A',
      });
      if (opp.imageUrl) {
        setImagePreview(opp.imageUrl);
      }
    }
  }, [existingOpp, reset]);

  const formData = watch();

  useEffect(() => {
    if (!isEditMode) {
      localStorage.setItem('opportunity_draft', JSON.stringify(formData));
    }
  }, [formData, isEditMode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      let uploadedImageUrl = existingOpp?.data?.imageUrl || null;
      
      // Upload image if a new one was selected
      if (imageFile) {
        const imgData = new FormData();
        imgData.append('image', imageFile);
        
        const uploadRes = await publisherService.uploadOpportunityImage(imgData);
        uploadedImageUrl = uploadRes.data.imageUrl;
      }

      const payload = {
        type: data.type.toUpperCase().replace('-', '_'),
        title: { en: data.title },
        organizationName: data.company,
        description: { en: data.description },
        location: data.location,
        deadline: new Date(data.deadline).toISOString(),
        educationLevel: data.educationLevel.toUpperCase().replace(' ', '_'),
        ...(data.specificRequirements && { specificRequirements: { en: data.specificRequirements } }),
        ...(data.applyUrl && { applyUrl: data.applyUrl }),
        ...(uploadedImageUrl && { imageUrl: uploadedImageUrl }),
        ...(data.salary && { salary: data.salary }),
        ...(data.fundingType && data.fundingType !== 'N/A' && { fundingType: data.fundingType }),
      };
      
      if (isEditMode) {
        return publisherService.updateOpportunity(id, payload);
      } else {
        return publisherService.createOpportunity(payload);
      }
    },
    onSuccess: () => {
      toast.success(isEditMode ? 'Opportunity successfully updated!' : 'Opportunity successfully created!');
      localStorage.removeItem('opportunity_draft');
      reset();
      setImageFile(null);
      setImagePreview(null);
      navigate('/publisher/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Operation failed. System error.');
    },
  });

  const onSubmit = async (data) => {
    try {
      await mutation.mutateAsync(data);
    } catch (e) {
      // Error is handled in onError of mutation
    }
  };

  return (
    <main className="flex flex-1 justify-center py-8 px-4 bg-background-light dark:bg-background-dark min-h-screen font-display">
      <div className="layout-content-container flex flex-col max-w-[800px] flex-1">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 mb-6">
          <Link to="/publisher/dashboard" className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="text-slate-400 size-4" />
          <span className="text-slate-900 dark:text-white text-sm font-semibold">
            {isEditMode ? 'Edit Listing' : 'New Listing'}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight mb-2">
            {isEditMode ? 'Edit Opportunity' : 'Create New Opportunity'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Provide the essential details to help students and early-career professionals find your program.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          
          {/* Section: Basic Information */}
          <section className="bg-white dark:bg-slate-900/50 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Info className="size-5" />
              </div>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              
              {/* Opportunity Image */}
              <label className="flex flex-col gap-2">
                <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Opportunity Cover Image</span>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors p-6 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden flex items-center justify-center bg-black/5">
                      <img src={imagePreview} alt="Preview" className="max-w-full max-h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-semibold flex items-center gap-2">
                          <ImageIcon className="size-5" /> Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                      <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <ImageIcon className="size-6 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-slate-600 dark:text-slate-300">Click to upload or drag and drop</p>
                        <p className="text-sm">SVG, PNG, JPG or GIF (max. 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Opportunity Title</span>
                <input 
                  {...register('title')}
                  className="form-input w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base" 
                  placeholder="e.g. Summer Software Engineering Internship 2025" 
                  type="text"
                />
                <span className="text-xs text-slate-400">Make it descriptive and concise.</span>
                {errors.title && <p className="text-xs text-red-500 font-bold">{errors.title.message}</p>}
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Type</span>
                  <select 
                    {...register('type')}
                    className="form-select w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4"
                  >
                    <option value="Scholarship">Scholarship</option>
                    <option value="Internship">Internship</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Grant">Grant</option>
                    <option value="Competition">Competition</option>
                  </select>
                </label>
                
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Organization Name</span>
                  <input 
                    {...register('company')}
                    className="form-input w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4" 
                    placeholder="e.g. Google, UNICEF, University of Oxford" 
                    type="text"
                  />
                  {errors.company && <p className="text-xs text-red-500 font-bold">{errors.company.message}</p>}
                </label>
              </div>
              
              <label className="flex flex-col gap-2">
                <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Description</span>
                <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                  <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <button className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-white rounded transition-colors" type="button">
                      <Bold className="size-4" />
                    </button>
                    <button className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-white rounded transition-colors" type="button">
                      <Italic className="size-4" />
                    </button>
                    <button className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-white rounded transition-colors" type="button">
                      <List className="size-4" />
                    </button>
                  </div>
                  <textarea 
                    {...register('description')}
                    className="form-textarea w-full border-none bg-transparent focus:ring-0 text-slate-900 dark:text-white p-4 min-h-[160px] resize-y" 
                    placeholder="Outline the responsibilities, goals, and culture of the opportunity..."
                  />
                </div>
                {errors.description && <p className="text-xs text-red-500 font-bold">{errors.description.message}</p>}
              </label>
            </div>
          </section>

          {/* Section: Eligibility & Requirements */}
          <section className="bg-white dark:bg-slate-900/50 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Verified className="size-5" />
              </div>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold">Eligibility & Requirements</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Location</span>
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-3 text-slate-400 size-5" />
                    <input 
                      {...register('location')}
                      className="form-input w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-10 pr-4" 
                      placeholder="Remote, New York, etc." 
                      type="text"
                    />
                  </div>
                  {errors.location && <p className="text-xs text-red-500 font-bold">{errors.location.message}</p>}
                </label>
                
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Education Level</span>
                  <select 
                    {...register('educationLevel')}
                    className="form-select w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4"
                  >
                    <option value="High School">High School</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="PhD">PhD</option>
                    <option value="Any">Any</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Funding Type</span>
                  <select 
                    {...register('fundingType')}
                    className="form-select w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4"
                  >
                    <option value="N/A">Not Applicable</option>
                    <option value="FULLY_FUNDED">Fully Funded</option>
                    <option value="PARTIALLY_FUNDED">Partially Funded</option>
                    <option value="NON_FUNDED">Non-Funded</option>
                  </select>
                </label>
                
                <label className="flex flex-col gap-2">
                  <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Salary / Stipend (Optional)</span>
                  <input 
                    {...register('salary')}
                    className="form-input w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4" 
                    placeholder="e.g. $50,000/yr, $20/hr, or Unpaid" 
                    type="text"
                  />
                </label>
              </div>
              
              <label className="flex flex-col gap-2">
                <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Specific Requirements</span>
                <textarea 
                  {...register('specificRequirements')}
                  className="form-textarea w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary p-4 min-h-[100px]" 
                  placeholder="List required skills, GPA, background, or materials (e.g. Portfolio required)..."
                />
              </label>
            </div>
          </section>

          {/* Section: Application Details */}
          <section className="bg-white dark:bg-slate-900/50 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <CalendarDays className="size-5" />
              </div>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold">Application Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Application Deadline</span>
                <div className="relative flex items-center">
                  <input 
                    {...register('deadline')}
                    className="form-input w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4" 
                    type="date"
                    style={{ WebkitAppearance: 'none' }} // Ensure date picker looks clean
                  />
                </div>
                {errors.deadline && <p className="text-xs text-red-500 font-bold">{errors.deadline.message}</p>}
              </label>
              
              <label className="flex flex-col gap-2">
                <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Apply URL (Optional)</span>
                <div className="relative flex items-center">
                  <LinkIcon className="absolute left-3 text-slate-400 size-5" />
                  <input 
                    {...register('applyUrl')}
                    className="form-input w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-10 pr-4" 
                    placeholder="https://..." 
                    type="url"
                  />
                </div>
                {errors.applyUrl && (
                  <div className="flex items-center gap-1 text-red-500 mt-1">
                    <AlertCircle className="size-3.5" />
                    <span className="text-xs">{errors.applyUrl.message}</span>
                  </div>
                )}
              </label>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8 pb-12">
            <button 
              type="button"
              onClick={() => navigate('/publisher/dashboard')}
              className="w-full sm:w-auto px-8 py-3 rounded-lg text-slate-700 dark:text-slate-300 font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || mutation.isPending || mutation.isLoading}
              className="w-full sm:w-auto px-10 py-3 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Send className="size-5" />
              {isSubmitting || mutation.isPending || mutation.isLoading ? 'Processing...' : (isEditMode ? 'Update Opportunity' : 'Publish Opportunity')}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateOpportunity;
