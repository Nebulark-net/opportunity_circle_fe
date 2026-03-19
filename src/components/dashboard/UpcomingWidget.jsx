import React from 'react';
import Skeleton from '../loaders/Skeleton';

const UpcomingWidget = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex flex-col flex-1 gap-1">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-2 w-1/3" />
              </div>
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Upcoming Deadlines</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-white">Meta Production Eng</span>
            <span className="text-[10px] text-red-400 font-semibold">Today at 11:59 PM</span>
          </div>
          <button className="text-primary text-[10px] font-bold uppercase hover:underline">Apply</button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-white">Tesla Internship</span>
            <span className="text-[10px] text-slate-400 font-semibold">3 Days left</span>
          </div>
          <button className="text-primary text-[10px] font-bold uppercase hover:underline">Apply</button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingWidget;
