import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Video, FileText, Download, ExternalLink } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import api from '../lib/api';

const Resources = () => {
  const { data: resources, isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const response = await api.get('/resources');
      return response.data;
    },
  });

  const getIcon = (type) => {
    switch (type) {
      case 'video': return Video;
      case 'guide': return BookOpen;
      case 'template': return FileText;
      default: return BookOpen;
    }
  };

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-card"></div>
    ))}
  </div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Career Resources</h1>
        <p className="text-slate-500">Expert guides, templates, and videos to accelerate your career growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources?.map((resource) => {
          const Icon = getIcon(resource.type);
          return (
            <Card key={resource.id} className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Icon size={24} />
                </div>
                <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {resource.type}
                </span>
              </div>
              
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold dark:text-white">{resource.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{resource.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-border-dark">
                <Button variant="ghost" className="w-full flex items-center justify-center gap-2 text-xs">
                  {resource.type === 'template' ? <Download size={14} /> : <ExternalLink size={14} />}
                  {resource.type === 'template' ? 'Download Template' : 'Read Guide'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Resources;
