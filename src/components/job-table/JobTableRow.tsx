
import { Job, JobStatus } from '@/types/job';
import { TableRow, TableCell } from '@/components/ui/table';
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  Eye,
  EyeOff,
  Trash
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import TechStackTooltip from '@/components/TechStackTooltip';
import CompanyInfoTooltip from '@/components/CompanyInfoTooltip';
import ProjectTooltip from '@/components/ProjectTooltip';
import RequirementsAssessmentTooltip from '@/components/RequirementsAssessmentTooltip';
import JobStatusSelect from '@/components/JobStatusSelect';
import PrioritySelect from '@/components/PrioritySelect';

interface JobTableRowProps {
  job: Job;
  showAllColumns: boolean;
  onSelectJob: (job: Job) => void;
  onUpdateJobStatus: (job: Job, status: JobStatus) => void;
  onUpdateJobPriority: (job: Job, priority: number) => void;
  onDeleteJob: (jobId: string) => void;
  onToggleHidden: (job: Job, hidden: boolean) => void;
  getMatchedSkills: (job: Job) => string[];
  formatDate: (dateString: string) => string;
  handleDelete: (job: Job, event: React.MouseEvent) => void;
  handleToggleHidden: (job: Job, event: React.MouseEvent) => void;
  handlePriorityChange: (job: Job, priority: number, event?: React.SyntheticEvent) => void;
  openJobUrl: (job: Job, event: React.MouseEvent) => void;
  renderRequirementsBar: (job: Job) => JSX.Element;
}

export default function JobTableRow({
  job,
  showAllColumns,
  onSelectJob,
  onUpdateJobStatus,
  onUpdateJobPriority,
  handleDelete,
  handleToggleHidden,
  handlePriorityChange,
  openJobUrl,
  getMatchedSkills,
  formatDate,
  renderRequirementsBar
}: JobTableRowProps) {
  return (
    <TableRow 
      key={job.id}
      className={`cursor-pointer hover:bg-muted/50 ${job.hidden ? 'opacity-60' : ''}`}
      onClick={() => onSelectJob(job)}
    >
      <TableCell className="font-medium">{job.position}</TableCell>
      
      <TableCell>
        {job.project ? (
          <ProjectTooltip job={job}>
            {job.project}
          </ProjectTooltip>
        ) : 'N/A'}
      </TableCell>
      
      <TableCell>
        <CompanyInfoTooltip
          company={job.company}
          companyInfo={job.company_info}
          industry={job.industry}
          companySize={job.company_size}
          companyReputation={job.company_reputation}
          companyProducts={job.company_products}
        >
          {job.company}
        </CompanyInfoTooltip>
      </TableCell>
      
      <TableCell className="hidden md:table-cell">{job.industry || 'N/A'}</TableCell>
      
      <TableCell className="hidden md:table-cell">{job.location || 'N/A'}</TableCell>
      
      <TableCell className="hidden md:table-cell">{job.remote_policy || 'N/A'}</TableCell>
      
      <TableCell className="hidden lg:table-cell">
        {job.hours_per_week ? `${job.hours_per_week}h` : 'N/A'}
      </TableCell>
      
      <TableCell className="hidden lg:table-cell">
        {job.vacation_days ? `${job.vacation_days} days` : 'N/A'}
      </TableCell>
      
      <TableCell>
        <div className="max-w-[120px]">
          <JobStatusSelect
            value={job.status}
            onChange={(status) => {
              onUpdateJobStatus(job, status);
            }}
          />
        </div>
      </TableCell>
      
      <TableCell>
        <PrioritySelect 
          value={job.priority_level || 3} 
          onChange={(priority) => handlePriorityChange(job, priority)}
        />
      </TableCell>
      
      <TableCell>
        <RequirementsAssessmentTooltip requirementsMatch={job.cv_match?.requirements_match}>
          {renderRequirementsBar(job)}
        </RequirementsAssessmentTooltip>
      </TableCell>
      
      <TableCell>
        <div className="flex justify-center">
          {(job.match_score || job.cv_match?.overall_match_percentage) ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white 
                  ${(job.match_score || job.cv_match?.overall_match_percentage) >= 80 ? 'bg-green-500' : 
                    (job.match_score || job.cv_match?.overall_match_percentage) >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                >
                  {job.match_score || job.cv_match?.overall_match_percentage}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Overall match score</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <span>N/A</span>
          )}
        </div>
      </TableCell>
      
      {showAllColumns && (
        <>
          <TableCell className="hidden lg:table-cell">
            {job.tech_stack && job.tech_stack.length > 0 ? (
              <TechStackTooltip 
                techStack={job.tech_stack}
                matchedSkills={getMatchedSkills(job)}
              >
                <div className="flex flex-wrap gap-1">
                  {job.tech_stack.slice(0, 3).map((tech, index) => {
                    const isMatched = getMatchedSkills(job).includes(tech);
                    return (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className={`text-xs ${isMatched ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800' : ''}`}
                      >
                        {tech}
                      </Badge>
                    );
                  })}
                  {job.tech_stack.length > 3 && (
                    <Badge variant="outline" className="text-xs">+{job.tech_stack.length - 3}</Badge>
                  )}
                </div>
              </TechStackTooltip>
            ) : 'N/A'}
          </TableCell>
          
          <TableCell className="hidden lg:table-cell">
            {job.possible_salary || 'N/A'}
          </TableCell>
          
          <TableCell className="hidden lg:table-cell">
            {job.start_date ? format(new Date(job.start_date), 'MMM d, yyyy') : 'N/A'}
          </TableCell>
        </>
      )}
      
      <TableCell className="text-right">
        <Tooltip>
          <TooltipTrigger className="block">
            <span>{formatDate(job.last_updated)}</span>
          </TooltipTrigger>
          <TooltipContent>
            {format(new Date(job.last_updated), 'PPP')}
          </TooltipContent>
        </Tooltip>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center justify-center gap-1">
          {job.url && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 hover:bg-muted"
                  onClick={(e) => openJobUrl(job, e)}
                  aria-label="Open job URL"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Open job listing
              </TooltipContent>
            </Tooltip>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 hover:bg-muted"
                onClick={(e) => handleToggleHidden(job, e)}
                aria-label={job.hidden ? "Show job" : "Hide job"}
              >
                {job.hidden ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {job.hidden ? "Show job" : "Hide job"}
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => handleDelete(job, e)}
                aria-label="Delete job"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Delete job
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}
