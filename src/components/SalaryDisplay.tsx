
import React from 'react';
import { Job } from '@/types/job';
import { getSalaryInfo, renderSalary } from '@/lib/salary-utils';
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
