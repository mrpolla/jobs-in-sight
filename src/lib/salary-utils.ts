
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
  // Check for empty strings and convert them to null
  const cleanPossibleSalary = possibleSalary && possibleSalary.trim() !== '' ? possibleSalary : null;
  const cleanExternalSalary = externalSourcesSalary && externalSourcesSalary.trim() !== '' ? externalSourcesSalary : null;
  const cleanEstimatedSalary = estimatedSalary && estimatedSalary.trim() !== '' ? estimatedSalary : null;
  
  // Case 1: Direct salary from job posting
  if (cleanPossibleSalary) {
    return {
      value: cleanPossibleSalary,
      source: 'direct',
      icon: null,
      tooltip: 'Salary mentioned in job posting'
    };
  }
  
  // Case 2: Salary from external sources
  if (cleanExternalSalary) {
    // For external sources, extract just the salary range if it's a long text
    const extractedSalary = extractSalaryFromText(cleanExternalSalary);
    return {
      value: extractedSalary,
      source: 'external',
      icon: ExternalLink,
      tooltip: cleanExternalSalary
    };
  }
  
  // Case 3: Estimated salary from context
  if (cleanEstimatedSalary) {
    return {
      value: cleanEstimatedSalary,
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

/**
 * Helper function to extract just the salary range from a longer text
 */
function extractSalaryFromText(text: string): string {
  // Look for patterns like €260K–€281K, $100,000-$150,000, etc.
  const currencyRangeRegex = /([€$£¥][\d,.]+K?)\s*[-–]\s*([€$£¥][\d,.]+K?)/i;
  const match = text.match(currencyRangeRegex);
  
  if (match) {
    return `${match[1]}-${match[2]}`;
  }
  
  // If we can't extract a clean range, use the first 60 chars or so
  if (text.length > 60) {
    return text.substring(0, 60) + '...';
  }
  
  return text;
}
