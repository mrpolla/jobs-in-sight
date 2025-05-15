
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b py-4 px-6 bg-background sticky top-0 z-10">
        <div className="container flex items-center justify-between">
          <h1 className="text-xl font-bold">Job Tracker</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setHelpModalOpen(true)}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 space-y-8">
        {/* Stats Summary */}
        <StatsSummary jobs={jobs} />
        
        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Job Applications</h2>
          <div className="flex items-center gap-2">
            <Button onClick={() => setAddJobDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Job
            </Button>
            
            <Button variant="default" onClick={handleExportData} className="bg-purple-600 hover:bg-purple-700">
              <Download className="mr-2 h-4 w-4" />
              Export Project
            </Button>
          </div>
        </div>
        
        {/* Job Listings Table */}
        <JobListingTable 
          jobs={jobs} 
          onSelectJob={handleJobSelect} 
          onUpdateJobStatus={handleUpdateJobStatus}
          onDeleteJob={handleDeleteJob}
          onToggleHidden={handleToggleHidden}
        />
      </main>
      
      {/* Side Panel - Overlay */}
      {selectedJob && (
        <div 
          className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
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
