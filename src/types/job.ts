
export interface Job {
  id: string;
  position: string;
  company: string;
  job_description?: string;
  tech_stack?: string[];
  requirements?: string;
  project_or_product?: string;
  job_type?: string;
  location?: string;
  remote_policy?: string;
  contract_duration?: string;
  seniority_level?: string;
  start_date?: string;
  application_deadline?: string;
  languages_required?: string[];
  industry?: string;
  company_info?: string;
  company_products?: string;
  company_size?: string;
  team_description?: string;
  recruiter_contact?: string;
  possible_salary?: string;
  salary_estimate_from_context?: string;
  benefits?: string;
  company_reputation?: string;
  job_posting_clarity_score?: number;
  priority_level: number;
  status: 'Applied' | 'Interview' | 'Rejected' | 'Offer';
  applied_date?: string;
  interview_notes?: string;
  rating_match?: number;
  last_updated: string;
}

export type JobStatus = 'Applied' | 'Interview' | 'Rejected' | 'Offer';

export type SortField = 'position' | 'company' | 'location' | 'status' | 'priority_level' | 'last_updated';

export interface JobFilters {
  status?: JobStatus | 'All';
  priority?: number | 'All';
  search?: string;
}

export interface JobSort {
  field: SortField;
  direction: 'asc' | 'desc';
}
