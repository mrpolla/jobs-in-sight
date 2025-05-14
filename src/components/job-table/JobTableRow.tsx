
import { Job, JobStatus } from '@/types/job';
import { TableRow, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import JobStatusSelect from '@/components/JobStatusSelect';
import PrioritySelect from '@/components/PrioritySelect';
import JobCellContent from '@/components/job-table/cells/JobCellContent';
import RequirementBar from '@/components/job-table/cells/RequirementBar';
import MatchScoreIndicator from '@/components/job-table/cells/MatchScoreIndicator';
import TechStackBadges from '@/components/job-table/cells/TechStackBadges';
import JobRowActions from '@/components/job-table/cells/JobRowActions';
import UpdatedAtCell from '@/components/job-table/cells/UpdatedAtCell';

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
      <TableCell className="font-medium">
        <JobCellContent.Position position={job.position} />
      </TableCell>
      
      <TableCell>
        <JobCellContent.Project project={job.project} job={job} />
      </TableCell>
      
      <TableCell>
        <JobCellContent.Company 
          company={job.company} 
          companyInfo={job.company_info}
          industry={job.industry}
          companySize={job.company_size}
          companyReputation={job.company_reputation}
          companyProducts={job.company_products}
        />
      </TableCell>
      
      <TableCell className="hidden md:table-cell">
        <JobCellContent.Industry industry={job.industry} />
      </TableCell>
      
      <TableCell className="hidden md:table-cell">
        <JobCellContent.Location location={job.location} />
      </TableCell>
      
      <TableCell className="hidden md:table-cell">
        <JobCellContent.RemotePolicy policy={job.remote_policy} />
      </TableCell>
      
      <TableCell className="hidden lg:table-cell">
        <JobCellContent.Hours hours={job.hours_per_week} />
      </TableCell>
      
      <TableCell className="hidden lg:table-cell">
        <JobCellContent.Vacation days={job.vacation_days} />
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
        <RequirementBar 
          requirementsMatch={job.cv_match?.requirements_match}
          renderBar={() => renderRequirementsBar(job)}
        />
      </TableCell>
      
      <TableCell>
        <MatchScoreIndicator 
          score={job.match_score || job.cv_match?.overall_match_percentage} 
        />
      </TableCell>
      
      {showAllColumns && (
        <>
          <TableCell className="hidden lg:table-cell">
            <TechStackBadges 
              techStack={job.tech_stack} 
              matchedSkills={getMatchedSkills(job)} 
            />
          </TableCell>
          
          <TableCell className="hidden lg:table-cell">
            <JobCellContent.Salary salary={job.possible_salary} />
          </TableCell>
          
          <TableCell className="hidden lg:table-cell">
            <JobCellContent.StartDate date={job.start_date} />
          </TableCell>
        </>
      )}
      
      <UpdatedAtCell lastUpdated={job.last_updated} formatDate={formatDate} />
      
      <TableCell>
        <JobRowActions 
          job={job}
          onDelete={handleDelete}
          onToggleHidden={handleToggleHidden}
          onOpenUrl={openJobUrl}
        />
      </TableCell>
    </TableRow>
  );
}
