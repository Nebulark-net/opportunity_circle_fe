import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OpportunityCard from '../../../components/cards/OpportunityCard';

const OpportunityGrid = ({ opportunities, totalPages, currentPage, onPageChange }) => {
  return (
    <div className="flex flex-col gap-12">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {opportunities.map((opp) => (
          <OpportunityCard key={opp.id || opp._id} opportunity={opp} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8 border-t border-zinc-100 dark:zinc-800">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-zinc-200 dark:zinc-800 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Simple logic for brevity, can be expanded for many pages
              if (totalPages > 7) {
                  if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                      if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="px-2">...</span>;
                      return null;
                  }
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`size-10 rounded-lg text-sm font-bold transition-all ${
                    currentPage === pageNum
                      ? 'bg-primary text-white shadow-md'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-zinc-200 dark:zinc-800 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default OpportunityGrid;
