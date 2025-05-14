
import { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { format, formatDistanceToNow } from 'date-fns';
import { Job, JobStatus } from '@/types/job';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { TooltipProvider } from '@/components/ui/tooltip';
import JobFiltersBar from './JobFiltersBar';
import JobTableHeader from './JobTableHeader';
import JobTableRow from './JobTableRow';
import NoJobsFound from './NoJobsFound';
import { useJobFilters } from '@/hooks/use-job-filters';
import { useJobSorting } from '@/hooks/use-job-sorting';
import { renderRequirementsBar, getMatchedSkills } from './JobListingUtils';
import { toast } from '@/components/ui/use-toast';

interface JobListingTableProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onUpdateJobStatus: (job: Job, status: JobStatus) => void;
  onUpdateJobPriority: (job: Job, priority: number) => void;
  onDeleteJob: (jobId: string) => void;
  onToggleHidden: (job: Job, hidden: boolean) => void;
}

export default function JobListingTable({ 
  jobs, 
  onSelectJob, 
  onUpdateJobStatus,
  onUpdateJobPriority,
  onDeleteJob,
  onToggleHidden
}: JobListingTableProps) {
  const [showAllColumns, setShowAllColumns] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  
  const { filters, filteredJobs, handleFilterChange, clearFilters } = useJobFilters(jobs);
  const { sort, sortedJobs, handleSort } = useJobSorting(filteredJobs);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  const handleDelete = (job: Job, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click event
    setJobToDelete(job);
  };

  const handleToggleHidden = (job: Job, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click event
    onToggleHidden(job, !job.hidden);
    
    toast({
      title: job.hidden ? "Job is now visible" : "Job is now hidden",
      description: `${job.position} at ${job.company} has been ${job.hidden ? "unhidden" : "hidden"}.`,
      duration: 3000,
    });
  };
  
  const handlePriorityChange = (job: Job, priority: number, event?: React.SyntheticEvent) => {
    if (event) {
      event.stopPropagation(); // Prevent row click event
    }
    onUpdateJobPriority(job, priority);
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      onDeleteJob(jobToDelete.id);
      toast({
        title: "Job deleted",
        description: `${jobToDelete.position} at ${jobToDelete.company} has been deleted.`,
        duration: 3000,
      });
      setJobToDelete(null);
    }
  };

  const cancelDelete = () => {
    setJobToDelete(null);
  };

  const openJobUrl = (job: Job, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click event
    if (job.url) {
      window.open(job.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleExportExcel = async () => {
    const headers = [
      'Position', 'Project', 'Company', 'Industry', 'Location', 'Status', 'Priority', 
      'Tech Stack', 'Remote Policy', 'Salary', 
      'Start Date', 'Match Score', 'Last Updated', 'URL'
    ];
    
    const rows = sortedJobs.map(job => [
      job.position,
      job.project || '',
      job.company,
      job.industry || '',
      job.location || '',
      job.status,
      job.priority_level === 1 ? 'High' : job.priority_level === 2 ? 'Medium' : 'Low',
      (job.tech_stack || []).join(', '),
      job.remote_policy || '',
      job.possible_salary || '',
      job.start_date || '',
      job.match_score || job.cv_match?.overall_match_percentage || 'N/A',
      job.last_updated,
      job.url || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `job-listings-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: `${sortedJobs.length} jobs exported to CSV.`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-4">
      <JobFiltersBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        onToggleShowAllColumns={() => setShowAllColumns(prev => !prev)}
        onExportExcel={handleExportExcel}
        showAllColumns={showAllColumns}
      />
      
      <TooltipProvider>
        {sortedJobs.length === 0 ? (
          <NoJobsFound />
        ) : (
          <div className="rounded-md border overflow-auto">
            <Table>
              <JobTableHeader 
                sort={sort} 
                showAllColumns={showAllColumns} 
                onSort={handleSort} 
              />
              <TableBody>
                {sortedJobs.map((job) => (
                  <JobTableRow
                    key={job.id}
                    job={job}
                    showAllColumns={showAllColumns}
                    onSelectJob={onSelectJob}
                    onUpdateJobStatus={onUpdateJobStatus}
                    onUpdateJobPriority={onUpdateJobPriority}
                    onDeleteJob={onDeleteJob}
                    onToggleHidden={onToggleHidden}
                    getMatchedSkills={getMatchedSkills}
                    formatDate={formatDate}
                    handleDelete={handleDelete}
                    handleToggleHidden={handleToggleHidden}
                    handlePriorityChange={handlePriorityChange}
                    openJobUrl={openJobUrl}
                    renderRequirementsBar={renderRequirementsBar}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TooltipProvider>
      
      <DeleteConfirmationDialog 
        isOpen={!!jobToDelete}
        jobTitle={jobToDelete ? `${jobToDelete.position} at ${jobToDelete.company}` : ''}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
