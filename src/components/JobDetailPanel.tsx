
import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, PalmtreeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Job, JobStatus } from '@/types/job';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import RequirementsMatchDisplay from './RequirementsMatchDisplay';
import RequirementsMatchStats from './RequirementsMatchStats';
import StatsSummary from './StatsSummary';
import JobStatusSelect from './JobStatusSelect';
import PrioritySelect from './PrioritySelect';

interface JobDetailPanelProps {
  job: Job;
  onUpdateJobStatus: (job: Job, status: JobStatus) => void;
  onUpdateJobPriority: (job: Job, priority: number) => void;
  onClose: () => void;
}

export default function JobDetailPanel({
  job,
  onUpdateJobStatus,
  onUpdateJobPriority,
  onClose,
}: JobDetailPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="w-full lg:w-[600px] xl:w-[720px] border-l">
      <div className="flex items-center justify-between border-b p-4">
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{job.position}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{job.company}</span>
            {job.location && (
              <>
                <span className="mx-2">•</span>
                <span>{job.location}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 grid gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm font-medium mb-1">Status</div>
            <JobStatusSelect
              value={job.status}
              onChange={(status) => onUpdateJobStatus(job, status)}
            />
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1">Priority</div>
            <PrioritySelect
              value={job.priority_level || 3}
              onChange={(priority) => onUpdateJobPriority(job, priority)}
            />
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1">Applied Date</div>
            <div className="text-sm">{formatDate(job.applied_date)}</div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1">Updated</div>
            <div className="text-sm">{formatDate(job.last_updated)}</div>
          </div>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium">Job Details</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Show
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="mt-2">
            <div className="grid gap-4">
              {job.job_description && (
                <div>
                  <div className="text-sm font-medium mb-1">Job Description</div>
                  <p className="text-sm">{job.job_description}</p>
                </div>
              )}
              
              {job.tech_stack && job.tech_stack.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">Tech Stack</div>
                  <div className="flex flex-wrap gap-1">
                    {job.tech_stack.map((tech, i) => (
                      <Badge key={i} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {job.job_type && (
                  <div>
                    <div className="text-sm font-medium mb-1">Job Type</div>
                    <div className="text-sm">{job.job_type}</div>
                  </div>
                )}
                
                {job.remote_policy && (
                  <div>
                    <div className="text-sm font-medium mb-1">Remote Policy</div>
                    <div className="text-sm">{job.remote_policy}</div>
                  </div>
                )}
                
                {job.hours_per_week && (
                  <div>
                    <div className="text-sm font-medium mb-1 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Hours per Week
                    </div>
                    <div className="text-sm">{job.hours_per_week}h</div>
                  </div>
                )}
                
                {job.vacation_days && (
                  <div>
                    <div className="text-sm font-medium mb-1 flex items-center">
                      <PalmtreeIcon className="h-4 w-4 mr-1" />
                      Vacation Days
                    </div>
                    <div className="text-sm">{job.vacation_days} days</div>
                  </div>
                )}
                
                {job.seniority_level && (
                  <div>
                    <div className="text-sm font-medium mb-1">Seniority</div>
                    <div className="text-sm">{job.seniority_level}</div>
                  </div>
                )}
                
                {job.start_date && (
                  <div>
                    <div className="text-sm font-medium mb-1">Start Date</div>
                    <div className="text-sm">{formatDate(job.start_date)}</div>
                  </div>
                )}
                
                {job.application_deadline && (
                  <div>
                    <div className="text-sm font-medium mb-1">Deadline</div>
                    <div className="text-sm">{formatDate(job.application_deadline)}</div>
                  </div>
                )}
                
                {job.languages_required && job.languages_required.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-1">Languages</div>
                    <div className="text-sm">{job.languages_required.join(', ')}</div>
                  </div>
                )}
                
                {job.possible_salary && (
                  <div>
                    <div className="text-sm font-medium mb-1">Salary</div>
                    <div className="text-sm">{job.possible_salary}</div>
                  </div>
                )}
              </div>
              
              {job.industry && (
                <div>
                  <div className="text-sm font-medium mb-1">Industry</div>
                  <div className="text-sm">{job.industry}</div>
                </div>
              )}
              
              {job.company_info && (
                <div>
                  <div className="text-sm font-medium mb-1">Company Info</div>
                  <p className="text-sm">{job.company_info}</p>
                </div>
              )}
              
              {job.benefits && (
                <div>
                  <div className="text-sm font-medium mb-1">Benefits</div>
                  <p className="text-sm">{job.benefits}</p>
                </div>
              )}
              
              {job.recruiter_contact && (
                <div>
                  <div className="text-sm font-medium mb-1">Recruiter</div>
                  <p className="text-sm">{job.recruiter_contact}</p>
                </div>
              )}
              
              {job.interview_notes && (
                <div>
                  <div className="text-sm font-medium mb-1">Interview Notes</div>
                  <p className="text-sm whitespace-pre-wrap">{job.interview_notes}</p>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {job.cv_match && (
          <>
            <div>
              <h3 className="text-md font-medium mb-2">Match Summary</h3>
              <StatsSummary
                overall={job.cv_match.overall_match_percentage}
                summary={job.match_summary}
              />
            </div>

            <Separator />

            {job.cv_match.requirements_match && job.cv_match.requirements_match.length > 0 && (
              <>
                <div>
                  <h3 className="text-md font-medium mb-2">Requirements Match</h3>
                  <RequirementsMatchStats requirementsMatch={job.cv_match.requirements_match} />
                  <div className="mt-4">
                    <RequirementsMatchDisplay requirementsMatch={job.cv_match.requirements_match} />
                  </div>
                </div>
                <Separator />
              </>
            )}
          </>
        )}
        
        {job.url && (
          <div className="mt-4">
            <Button
              variant="default"
              className="w-full"
              onClick={() => window.open(job.url, '_blank')}
            >
              View Original Job Posting
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
