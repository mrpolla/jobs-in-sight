
import { useState, useMemo } from 'react';
import { Job, JobSort, SortField } from '@/types/job';

export function useJobSorting(jobs: Job[]) {
  const [sort, setSort] = useState<JobSort>({ field: 'last_updated', direction: 'desc' });

  const handleSort = (field: SortField) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      let comparison = 0;
      
      switch (sort.field) {
        case 'position':
          comparison = a.position.localeCompare(b.position);
          break;
        case 'company':
          comparison = a.company.localeCompare(b.company);
          break;
        case 'location':
          comparison = (a.location || '').localeCompare(b.location || '');
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'priority_level':
          comparison = a.priority_level - b.priority_level;
          break;
        case 'tech_stack':
          const techA = (a.tech_stack || []).join(', ');
          const techB = (b.tech_stack || []).join(', ');
          comparison = techA.localeCompare(techB);
          break;
        case 'project':
          comparison = (a.project || '').localeCompare(b.project || '');
          break;
        case 'industry':
          comparison = (a.industry || '').localeCompare(b.industry || '');
          break;
        case 'remote_policy':
          comparison = (a.remote_policy || '').localeCompare(b.remote_policy || '');
          break;
        case 'possible_salary':
          comparison = (a.possible_salary || '').localeCompare(b.possible_salary || '');
          break;
        case 'start_date':
          if (a.start_date && b.start_date) {
            comparison = new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
          } else if (a.start_date) {
            comparison = -1;
          } else if (b.start_date) {
            comparison = 1;
          }
          break;
        case 'match_score':
          const scoreA = a.match_score || a.cv_match?.overall_match_percentage || 0;
          const scoreB = b.match_score || b.cv_match?.overall_match_percentage || 0;
          comparison = scoreA - scoreB;
          break;
        case 'last_updated':
          comparison = (new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime());
          break;
        case 'hours_per_week':
          comparison = (Number(a.hours_per_week) || 0) - (Number(b.hours_per_week) || 0);
          break;
        case 'vacation_days':
          comparison = (Number(a.vacation_days) || 0) - (Number(b.vacation_days) || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [jobs, sort]);

  return {
    sort,
    sortedJobs,
    handleSort
  };
}
