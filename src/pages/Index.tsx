import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";
import StatsSummary from "@/components/StatsSummary";
import JobListingTable from "@/components/JobListingTable";
import JobDetailPanel from "@/components/JobDetailPanel";
import HelpModal from "@/components/HelpModal";
import UnifiedAddJobModal from "@/components/UnifiedAddJobModal";
import { Job, JobStatus } from "@/types/job";
import { loadJobs, saveJobs, updateJob, deleteJob } from "@/lib/storage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [addJobDialogOpen, setAddJobDialogOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode } = useTheme();

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
    toast.success("Job added successfully");
  };

  const handleJobUpdated = (updatedJob: Job) => {
    const updatedJobs = jobs.map((job) =>
      job.id === updatedJob.id ? updatedJob : job
    );
    setJobs(updatedJobs);
    setSelectedJob(updatedJob);
  };

  const handleDeleteJob = (jobId: string) => {
    deleteJob(jobId);

    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    setJobs(updatedJobs);

    // If the deleted job is currently selected, close the sidebar
    if (selectedJob && selectedJob.id === jobId) {
      handleSidebarClose();
    }

    toast.success("Job deleted successfully");
  };

  const handleUpdateJobStatus = (job: Job, status: JobStatus) => {
    const updatedJob = {
      ...job,
      status,
      last_updated: new Date().toISOString(),
    };

    updateJob(updatedJob);

    const updatedJobs = jobs.map((j) =>
      j.id === updatedJob.id ? updatedJob : j
    );

    setJobs(updatedJobs);

    // Update selected job if it's the one being edited
    if (selectedJob && selectedJob.id === updatedJob.id) {
      setSelectedJob(updatedJob);
    }

    toast.success(`Status updated to ${status}`);
  };

  const handleUpdateJobPriority = (job: Job, priority: number) => {
    const updatedJob = {
      ...job,
      priority_level: priority,
      last_updated: new Date().toISOString(),
    };

    updateJob(updatedJob);

    const updatedJobs = jobs.map((j) =>
      j.id === updatedJob.id ? updatedJob : j
    );

    setJobs(updatedJobs);

    // Update selected job if it's the one being edited
    if (selectedJob && selectedJob.id === updatedJob.id) {
      setSelectedJob(updatedJob);
    }

    toast.success(
      `Priority updated to ${
        priority === 1 ? "High" : priority === 2 ? "Medium" : "Low"
      }`
    );
  };

  const handleToggleHidden = (job: Job, hidden: boolean) => {
    const updatedJob = {
      ...job,
      hidden,
      last_updated: new Date().toISOString(),
    };

    updateJob(updatedJob);

    const updatedJobs = jobs.map((j) =>
      j.id === updatedJob.id ? updatedJob : j
    );

    setJobs(updatedJobs);

    // Update selected job if it's the one being edited
    if (selectedJob && selectedJob.id === updatedJob.id) {
      setSelectedJob(updatedJob);
    }

    toast.success(hidden ? "Job hidden" : "Job unhidden");
  };

  const handleExportData = () => {
    if (jobs.length === 0) {
      toast.error("No jobs to export");
      return;
    }

    // Create a Blob with the JSON data
    const jobsJson = JSON.stringify(jobs, null, 2);
    const blob = new Blob([jobsJson], { type: "application/json" });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `job-applications-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Jobs exported successfully");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Enhanced Header */}
      <header className="border-b py-4 px-6 bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={
                isDarkMode
                  ? "/lovable-uploads/logo_inverted.png"
                  : "/lovable-uploads/logo.png"
              }
              alt="Jobs In-Sight Logo"
              className="h-10 w-10 md:h-14 md:w-14"
            />
            <h1 className="text-xl md:text-2xl font-bold text-[#1A508B] dark:text-[#33C3F0]">
              Jobs In-Sight
            </h1>
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
                    <HelpCircle className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Help</span>
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

      <main className="flex-1 container py-4 md:py-8 space-y-4 md:space-y-6">
        {/* Title and Action Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100">
                Job Applications
              </h2>

              {/* Action buttons - moved to below title on mobile */}
              <div className="flex justify-start gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setAddJobDialogOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="mr-1 md:mr-2 h-4 w-4" />
                        <span className="inline">Add Job</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add a new job application</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        onClick={handleExportData}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Download className="mr-1 md:mr-2 h-4 w-4" />
                        <span className="inline">Export JSON</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export all job data as JSON</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Stats Summary - only show on medium screens and up */}
            <div className="hidden md:block mt-4">
              <StatsSummary jobs={jobs} />
            </div>
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
            onUpdateJobPriority={handleUpdateJobPriority}
          />
        </div>
      </main>

      {/* Side Panel - Overlay */}
      {selectedJob && (
        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={handleSidebarClose}
        />
      )}

      {/* Side Panel - Content */}
      {selectedJob && (
        <div
          className={`side-panel ${
            sidebarOpen ? "side-panel-open" : "side-panel-closed"
          }`}
        >
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
      <HelpModal open={helpModalOpen} onOpenChange={setHelpModalOpen} />
    </div>
  );
};

export default Index;
