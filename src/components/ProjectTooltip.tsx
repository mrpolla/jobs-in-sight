
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Job } from '@/types/job';

interface ProjectTooltipProps {
  job: Job;
  children: React.ReactNode;
}

export default function ProjectTooltip({ job, children }: ProjectTooltipProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-help">{children}</span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-4">
          {job.job_description && (
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">{job.job_description}</p>
            </div>
          )}
          
          {job.team_description && (
            <div>
              <h4 className="text-sm font-medium mb-1">Team</h4>
              <p className="text-sm text-muted-foreground">{job.team_description}</p>
            </div>
          )}
          
          {job.job_type && (
            <div>
              <h4 className="text-sm font-medium mb-1">Job Type</h4>
              <p className="text-sm text-muted-foreground">{job.job_type}</p>
            </div>
          )}
          
          {job.contract_duration && (
            <div>
              <h4 className="text-sm font-medium mb-1">Contract Duration</h4>
              <p className="text-sm text-muted-foreground">{job.contract_duration}</p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
