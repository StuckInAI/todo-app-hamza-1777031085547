'use client';

import { FilterType } from '@/types';

interface TodoFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeCount: number;
  completedCount: number;
}

export default function TodoFilter({ filter, onFilterChange, activeCount, completedCount }: TodoFilterProps) {
  const filters: { label: string; value: FilterType; count: number }[] = [
    { label: 'All', value: 'all', count: activeCount + completedCount },
    { label: 'Active', value: 'active', count: activeCount },
    { label: 'Done', value: 'completed', count: completedCount },
  ];

  return (
    <div className="flex gap-1">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
            filter === f.value
              ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          {f.label}
          <span
            className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs ${
              filter === f.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {f.count}
          </span>
        </button>
      ))}
    </div>
  );
}
