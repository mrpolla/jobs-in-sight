
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Job } from '@/types/job';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import RequirementsAssessment from './RequirementsAssessment';
import RequirementsStats from './RequirementsStats';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ProjectTooltipProps {
  job: Job;
  children: React.ReactNode;
}

export default function ProjectTooltip({ job, children }: ProjectTooltipProps) {
  const hasRequirementsAssessment = 
    job.application_reasoning?.requirements_assessment && 
    job.application_reasoning.requirements_assessment.length > 0;

  return (
    <>
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div className="cursor-help flex items-center gap-1">
            {children}
            
            {hasRequirementsAssessment && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="ml-1 inline-block">
                      <RequirementsStats requirements={job.application_reasoning!.requirements_assessment!} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Requirements breakdown: 
                    <RequirementsAssessment 
                      requirements={job.application_reasoning!.requirements_assessment!} 
                      compact={true} 
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 md:w-96" align="start">
          <ScrollArea className="h-80">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">{job.position} at {job.company}</h4>
                {job.project && <p className="text-sm text-muted-foreground">Project: {job.project}</p>}
                {job.product && <p className="text-sm text-muted-foreground">Product: {job.product}</p>}
              </div>

              {job.job_description && (
                <div>
                  <h5 className="text-sm font-semibold">Job Description</h5>
                  <p className="text-sm mt-1">{job.job_description}</p>
                </div>
              )}

              {job.requirements && (
                <div>
                  <h5 className="text-sm font-semibold">Requirements</h5>
                  <p className="text-sm mt-1">{job.requirements}</p>
                </div>
              )}

              {hasRequirementsAssessment && (
                <div className="border-t pt-2">
                  <h5 className="text-sm font-semibold">Requirements Assessment</h5>
                  <RequirementsAssessment requirements={job.application_reasoning!.requirements_assessment!} />
                </div>
              )}

              {job.application_reasoning && (
                <div className="border-t pt-2 mt-4">
                  <h5 className="text-sm font-semibold">Application Reasoning</h5>
                  
                  {job.application_reasoning.why_apply && (
                    <div className="mt-2">
                      <h6 className="text-xs font-medium">Why Apply</h6>
                      <p className="text-xs mt-1">{job.application_reasoning.why_apply}</p>
                    </div>
                  )}
                  
                  {job.application_reasoning.key_matching_qualifications?.length > 0 && (
                    <div className="mt-2">
                      <h6 className="text-xs font-medium">Key Matching Qualifications</h6>
                      <ul className="text-xs list-disc pl-4 mt-1">
                        {job.application_reasoning.key_matching_qualifications.map((qual, i) => (
                          <li key={i}>{qual}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {!hasRequirementsAssessment && job.application_reasoning.transferable_skills_details?.length > 0 && (
                    <div className="mt-2">
                      <h6 className="text-xs font-medium">Transferable Skills</h6>
                      <ul className="text-xs list-disc pl-4 mt-1">
                        {job.application_reasoning.transferable_skills_details.map((skill, i) => (
                          <li key={i}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {job.application_reasoning.learning_needs?.length > 0 && (
                    <div className="mt-2">
                      <h6 className="text-xs font-medium">Learning Needs</h6>
                      <ul className="text-xs list-disc pl-4 mt-1">
                        {job.application_reasoning.learning_needs.map((need, i) => (
                          <li key={i}>{need}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {job.application_reasoning.overall_fit_assessment && (
                    <div className="mt-2">
                      <h6 className="text-xs font-medium">Overall Fit Assessment</h6>
                      <p className="text-xs mt-1">{job.application_reasoning.overall_fit_assessment}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </HoverCardContent>
      </HoverCard>
    </>
  );
}
