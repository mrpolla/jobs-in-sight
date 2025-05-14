
import { useState, useMemo } from 'react';
import { Job, JobFilters } from '@/types/job';

export function useJobFilters(jobs: Job[]) {
  const [filters, setFilters] = useState<JobFilters>({ 
    status: 'All', 
    priority: 'All', 
    search: '',
    hideHidden: true
  });

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: 'All', priority: 'All', search: '', hideHidden: filters.hideHidden });
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (filters.hideHidden && job.hidden) {
        return false;
      }
      
      if (filters.status !== 'All' && job.status !== filters.status) {
        return false;
      }
      
      if (filters.priority !== 'All' && job.priority_level !== filters.priority) {
        return false;
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          job.position.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          (job.location && job.location.toLowerCase().includes(searchTerm))
        );
      }
      
      return true;
    });
  }, [jobs, filters]);

  return {
    filters,
    filteredJobs,
    handleFilterChange,
    clearFilters
  };
}
