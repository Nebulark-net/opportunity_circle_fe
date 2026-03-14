import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const LiveSearch = ({ 
  initialValue = '', 
  onSearch, 
  placeholder = 'Search...', 
  className = '' 
}) => {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    // Only call onSearch if it's different from initialValue OR after mount
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  // Sync with initialValue if it changes externally (e.g. reset)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className={`relative group w-full ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-100 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-primary/20 rounded-lg pl-10 pr-10 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-500 transition-all"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default LiveSearch;
