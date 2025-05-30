export interface Job {
  id: string;
  position: string;
  company: string;
  job_description?: string;
  tech_stack?: string[];
  requirements?: string;
  project?: string;
  product?: string;
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
  recruiter_contact?: string | RecruiterContact;
  possible_salary?: string;
  salary_estimate_from_context?: string;
  salary_from_external_sources?: string; 
  benefits?: string;
  company_reputation?: string;
  job_posting_clarity_score?: number;
  priority_level: number;
  status: 'New' | 'Applied' | 'Interview' | 'Rejected' | 'Offer';
  applied_date?: string;
  interview_notes?: string;
  rating_match?: number;
  last_updated: string;
  hidden?: boolean;
  url?: string;
  hours_per_week?: string;
  vacation_days?: string; 
  application_reasoning?: {
    why_apply?: string;
    key_matching_qualifications?: string[];
    transferable_skills_details?: string[]; // Legacy field
    requirements_assessment?: RequirementAssessment[]; // Legacy field
    learning_needs?: string[];
    overall_fit_assessment?: string;
  };
  cv_match?: {
    overall_match_percentage: number;
    requirements_match?: RequirementMatch[]; // New field for integrated requirements assessment
    experience_match: {
      score: number;
      years_required: number;
      years_experience: number;
      domain_match: string;
      domain_overlap: string[];
      role_similarity: string;
    };
    seniority_match: {
      score: number;
      alignment: string;
      notes: string;
    };
    industry_match: {
      score: number;
      familiarity: string;
      transferable_experience: string;
    };
    project_match: {
      score: number;
      similar_projects: string[];
      environment_similarity: string;
    };
    compensation_alignment: {
      score: number;
      notes: string;
    };
    location_compatibility: {
      score: number;
      notes: string;
    };
  };
  match_summary?: string;
  match_score?: number;
  cover_letter?: string;
  // Added for batch import handling - will be present only during the import process
  batch?: Job[];
}

export interface RecruiterContact {
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  department: string;
  preferred_contact_method: string;
  application_instructions: string;
}

export interface RequirementAssessment {
  requirement: string;
  status: 'Can do well' | 'Can transfer' | 'Must learn';
  explanation: string;
  transferable_skills: string[];
}

export interface RequirementMatch {
  requirement: string;
  status: 'Can do well' | 'Can transfer' | 'Must learn';
  explanation: string;
  transferable_skills: string[];
  match_score: number;
}

export type JobStatus = 'New' | 'Applied' | 'Interview' | 'Rejected' | 'Offer';

export type SortField = 'position' | 'company' | 'location' | 'status' | 'priority_level' | 
  'tech_stack' | 'project' | 'product' | 'remote_policy' | 'possible_salary' | 'start_date' | 'last_updated' | 'match_score' | 'industry';

export interface JobFilters {
  status?: JobStatus | 'All';
  priority?: number | 'All';
  search?: string;
  hideHidden?: boolean;
}

export interface JobSort {
  field: SortField;
  direction: 'asc' | 'desc';
}
