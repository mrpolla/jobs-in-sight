
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import ThemeToggle from '@/components/ThemeToggle';
import StatsSummary from '@/components/StatsSummary';
import JobListingTable from '@/components/JobListingTable';
import JobDetailPanel from '@/components/JobDetailPanel';
import HelpModal from '@/components/HelpModal';
import UnifiedAddJobModal from '@/components/UnifiedAddJobModal';
import { Job, JobStatus } from '@/types/job';
import { loadJobs, saveJobs, updateJob, deleteJob } from '@/lib/storage';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [addJobDialogOpen, setAddJobDialogOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load jobs from localStorage on component mount
  useEffect(() => {
    const storedJobs = loadJobs();
    setJobs(storedJobs);
  }, []);

  const handleJobSelect = (job: Job) => {
    console.log("Job selected:", job.id);
    setSelectedJob(job);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
    // Delay clearing the selected job to allow the animation to finish
    setTimeout(() => {
      setSelectedJob(null);
    }, 300);
  };

  const handleAddJob = (job: Job) => {
    const updatedJobs = [...jobs, job];
    setJobs(updatedJobs);
    saveJobs(updatedJobs);
    toast.success('Job added successfully');
  };

  const handleJobUpdated = (updatedJob: Job) => {
    const updatedJobs = jobs.map(job => 
      job.id === updatedJob.id ? updatedJob : job
    );
    setJobs(updatedJobs);
    setSelectedJob(updatedJob);
  };

  const handleDeleteJob = (jobId: string) => {
    deleteJob(jobId);
    
    const updatedJobs = jobs.filter(job => job.id !== jobId);
    setJobs(updatedJobs);
    
    // If the deleted job is currently selected, close the sidebar
    if (selectedJob && selectedJob.id === jobId) {
      handleSidebarClose();
    }
    
    toast.success('Job deleted successfully');
  };

  const handleUpdateJobStatus = (job: Job, status: JobStatus) => {
    const updatedJob = {
      ...job,
      status,
      last_updated: new Date().toISOString()
    };
    
    updateJob(updatedJob);
    
    const updatedJobs = jobs.map(j => 
      j.id === updatedJob.id ? updatedJob : j
    );
    
    setJobs(updatedJobs);
    
    // Update selected job if it's the one being edited
    if (selectedJob && selectedJob.id === updatedJob.id) {
      setSelectedJob(updatedJob);
    }
    
    toast.success(`Status updated to ${status}`);
  };

  const handleToggleHidden = (job: Job, hidden: boolean) => {
    const updatedJob = {
      ...job,
      hidden,
      last_updated: new Date().toISOString()
    };
    
    updateJob(updatedJob);
    
    const updatedJobs = jobs.map(j => 
      j.id === updatedJob.id ? updatedJob : j
    );
    
    setJobs(updatedJobs);
    
    // Update selected job if it's the one being edited
    if (selectedJob && selectedJob.id === updatedJob.id) {
      setSelectedJob(updatedJob);
    }
    
    toast.success(hidden ? 'Job hidden' : 'Job unhidden');
  };

  const handleExportData = () => {
    if (jobs.length === 0) {
      toast.error('No jobs to export');
      return;
    }
    
    // Create a Blob with the JSON data
    const jobsJson = JSON.stringify(jobs, null, 2);
    const blob = new Blob([jobsJson], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-applications-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Jobs exported successfully');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Enhanced Header */}
      <header className="border-b py-4 px-6 bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/8e6d4109-d8c0-47bd-a937-050e31842942.png" 
              alt="Jobs In-Sight Logo" 
              className="h-14 w-14" 
            />
            <img 
              src="/lovable-uploads/008b7164-22c6-43ed-abdb-3798ecd8dacc.png" 
              alt="Jobs In-Sight Text Logo" 
              className="h-10" 
            />
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline"
                    onClick={() => setHelpModalOpen(true)}
                    className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/30"
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  View application help and instructions
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 space-y-6">
        {/* Stats Summary Card */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Application Status</h3>
          <StatsSummary jobs={jobs} />
        </div>
        
        {/* Action Bar */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Job Applications</h2>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => setAddJobDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Job
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Add a new job application
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="default" onClick={handleExportData} className="bg-purple-600 hover:bg-purple-700">
                    <Download className="mr-2 h-4 w-4" />
                    Export Project
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Export all job data as JSON
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Job Listings Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
          <JobListingTable 
            jobs={jobs} 
            onSelectJob={handleJobSelect} 
            onUpdateJobStatus={handleUpdateJobStatus}
            onDeleteJob={handleDeleteJob}
            onToggleHidden={handleToggleHidden}
          />
        </div>
      </main>
      
      {/* Side Panel - Overlay */}
      {selectedJob && (
        <div 
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={handleSidebarClose}
        />
      )}
      
      {/* Side Panel - Content */}
      {selectedJob && (
        <div className={`side-panel ${sidebarOpen ? 'side-panel-open' : 'side-panel-closed'}`}>
          <JobDetailPanel 
            job={selectedJob}
            onClose={handleSidebarClose}
            onJobUpdated={handleJobUpdated}
            onJobDeleted={handleDeleteJob}
          />
        </div>
      )}
      
      {/* Unified Add Job Modal */}
      <UnifiedAddJobModal
        open={addJobDialogOpen}
        onOpenChange={setAddJobDialogOpen}
        onAddJob={handleAddJob}
      />

      {/* Help Modal */}
      <HelpModal 
        open={helpModalOpen}
        onOpenChange={setHelpModalOpen}
      />
    </div>
  );
};

export default Index;
