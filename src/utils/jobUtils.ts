
import { Job } from '@/types/job';

// Parse job data to ensure correct types
export const parseJobData = (jobData: any): Job => {
  console.log('Job data before parsing:', {
    hours_per_week: jobData.hours_per_week,
    vacation_days: jobData.vacation_days,
    priority_level: jobData.priority_level,
    type: {
      hours: typeof jobData.hours_per_week,
      vacation: typeof jobData.vacation_days,
      priority: typeof jobData.priority_level
    }
  });
  
  const parsed = {
    ...jobData,
    hours_per_week: jobData.hours_per_week ? Number(jobData.hours_per_week) : undefined,
    vacation_days: jobData.vacation_days ? Number(jobData.vacation_days) : undefined,
    priority_level: jobData.priority_level ? Number(jobData.priority_level) : 3,
    match_score: jobData.match_score ? Number(jobData.match_score) : 
                 jobData.cv_match?.overall_match_percentage ? 
                 Number(jobData.cv_match.overall_match_percentage) : undefined,
    
    // Ensure arrays
    tech_stack: Array.isArray(jobData.tech_stack) ? jobData.tech_stack : 
                jobData.tech_stack ? [jobData.tech_stack] : [],
  };
  
  console.log('Job data after parsing:', {
    hours_per_week: parsed.hours_per_week,
    vacation_days: parsed.vacation_days,
    priority_level: parsed.priority_level,
    type: {
      hours: typeof parsed.hours_per_week,
      vacation: typeof parsed.vacation_days,
      priority: typeof parsed.priority_level
    }
  });
  
  return parsed as Job;
};
