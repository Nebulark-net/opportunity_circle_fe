import React from 'react';
import { Download, Check, X, Clock, Mail } from 'lucide-react';
import { useUpdateApplicant } from '../../hooks/useUpdateApplicant';
import Button from '../shared/Button';

const ApplicantTable = ({ opportunityId, applicants }) => {
  const updateMutation = useUpdateApplicant(opportunityId);

  const handleStatusChange = (applicantId, status) => {
    updateMutation.mutate({ applicantId, status });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50">
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Applicant</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Applied Date</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Resume</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
          {applicants?.map((applicant) => (
            <tr key={applicant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {applicant.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold dark:text-white">{applicant.fullName}</p>
                    <p className="text-xs text-slate-500">{applicant.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">
                {new Date(applicant.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <a 
                  href={applicant.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                >
                  <Download size={14} />
                  Download
                </a>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                  applicant.status === 'accepted' ? 'bg-green-100 text-green-600' : 
                  applicant.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {applicant.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="secondary" 
                    className="p-2 text-green-500 hover:bg-green-50"
                    onClick={() => handleStatusChange(applicant.id, 'accepted')}
                    disabled={updateMutation.isLoading}
                  >
                    <Check size={18} />
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="p-2 text-red-500 hover:bg-red-50"
                    onClick={() => handleStatusChange(applicant.id, 'rejected')}
                    disabled={updateMutation.isLoading}
                  >
                    <X size={18} />
                  </Button>
                  <Button variant="secondary" className="p-2">
                    <Mail size={18} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantTable;
