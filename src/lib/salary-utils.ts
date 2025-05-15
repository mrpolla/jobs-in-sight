
import { Info, ExternalLink } from "lucide-react";

export type SalarySource = 'direct' | 'external' | 'estimate' | 'none';

export interface SalaryInfo {
  value: string;
  source: SalarySource;
  icon: React.ElementType | null;
  tooltip: string;
}

/**
 * Gets the salary information based on priority:
 * 1. possible_salary
 * 2. salary_from_external_sources
 * 3. salary_estimate_from_context
 */
export function getSalaryInfo(
  possibleSalary?: string | null,
  externalSourcesSalary?: string | null,
  estimatedSalary?: string | null
): SalaryInfo {
  // Case 1: Direct salary from job posting
  if (possibleSalary) {
    return {
      value: possibleSalary,
      source: 'direct',
      icon: null,
      tooltip: 'Salary mentioned in job posting'
    };
  }
  
  // Case 2: Salary from external sources
  if (externalSourcesSalary) {
    return {
      value: externalSourcesSalary,
      source: 'external',
      icon: ExternalLink,
      tooltip: 'Salary from external sources like Glassdoor, Levels.fyi'
    };
  }
  
  // Case 3: Estimated salary from context
  if (estimatedSalary) {
    return {
      value: estimatedSalary,
      source: 'estimate',
      icon: Info,
      tooltip: 'Estimated salary based on job context'
    };
  }
  
  // Case 4: No salary information available
  return {
    value: 'Salary not provided',
    source: 'none',
    icon: null,
    tooltip: 'No salary information available'
  };
}

// Remove JSX code from this file
// The renderSalary function is now moved to SalaryDisplay component
