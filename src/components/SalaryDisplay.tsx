
import React from 'react';
import { Job } from '@/types/job';
import { getSalaryInfo } from '@/lib/salary-utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SalaryDisplayProps {
  job: Job;
  showTooltip?: boolean;
}

export default function SalaryDisplay({ job, showTooltip = true }: SalaryDisplayProps) {
  const salaryInfo = getSalaryInfo(
    job.possible_salary,
    job.salary_from_external_sources,
    job.salary_estimate_from_context
  );
  
  if (salaryInfo.source === 'none') {
    return <span className="text-muted-foreground text-sm">Not provided</span>;
  }
  
  // If tooltip is not needed, just render the salary
  if (!showTooltip) {
    return renderSalary(salaryInfo);
  }
  
  // With tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {renderSalary(salaryInfo)}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <p className="text-xs">{salaryInfo.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Helper function to render salary with appropriate source indicator
function renderSalary(salaryInfo: { value: string; source: string; icon: React.ElementType | null }) {
  const { value, source, icon: Icon } = salaryInfo;
  
  if (source === 'none') {
    return <span className="text-muted-foreground text-sm">{value}</span>;
  }
  
  return (
    <div className="flex items-center gap-1">
      <span>{value}</span>
      {Icon && <Icon className="h-3 w-3 text-muted-foreground" />}
    </div>
  );
}
