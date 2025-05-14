import { useState, useEffect } from 'react';
import JobListingTable from '@/components/JobListingTable';
import JobDetailPanel from '@/components/JobDetailPanel';
import UploadJobsButton from '@/components/UploadJobsButton';
import { Job, JobStatus } from '@/types/job';
import { v4 as uuidv4 } from 'uuid';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from "@/components/ui/use-toast"

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { toast } = useToast()

  useEffect(() => {
    const storedJobs = localStorage.getItem('jobs');
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    }
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      localStorage.setItem('jobs', JSON.stringify(jobs));
    }
  }, [jobs]);

  const saveJobsToLocalStorage = (jobs: Job[]) => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const handleJobClose = () => {
    setSelectedJob(null);
  };

  const handleUpdateJobStatus = (job: Job, status: JobStatus) => {
    const updatedJobs = jobs.map((j) => {
      if (j.id === job.id) {
        return { ...j, status: status, last_updated: new Date().toISOString() };
      }
      return j;
    });
    setJobs(updatedJobs);
    saveJobsToLocalStorage(updatedJobs);
  };

  // Add this to JobListingTable props
  const onUpdateJobPriority = (job: Job, priority: number) => {
    const updatedJobs = jobs.map((j) => {
      if (j.id === job.id) {
        return { ...j, priority_level: priority, last_updated: new Date().toISOString() };
      }
      return j;
    });
    setJobs(updatedJobs);
    saveJobsToLocalStorage(updatedJobs);
  }

  const handleDeleteJob = (jobId: string) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    setJobs(updatedJobs);
    saveJobsToLocalStorage(updatedJobs);
    setSelectedJob(null); // Clear selected job if it was deleted
  };

  const handleToggleHidden = (job: Job, hidden: boolean) => {
    const updatedJobs = jobs.map((j) => {
      if (j.id === job.id) {
        return { ...j, hidden: hidden, last_updated: new Date().toISOString() };
      }
      return j;
    });
    setJobs(updatedJobs);
    saveJobsToLocalStorage(updatedJobs);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const text = (e.target?.result as string) || '[]';
        const newJobs = (JSON.parse(text) as any[]).map(job => ({ ...job, id: uuidv4() }));
        setJobs(prevJobs => [...prevJobs, ...newJobs]);
        saveJobsToLocalStorage([...jobs, ...newJobs]);
        toast({
          title: "Success!",
          description: "Jobs uploaded successfully.",
        })
      } catch (error) {
        console.error("Error parsing JSON:", error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload jobs. Invalid JSON format.",
          variant: "destructive",
        })
      }
    };

    reader.onerror = () => {
      toast({
        title: "Upload Failed",
        description: "Failed to read the file.",
        variant: "destructive",
      })
    };

    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Job Tracker</h1>

      <div className="mb-4">
        <UploadJobsButton onFileUpload={handleFileUpload} />
      </div>

      <div className="flex">
        <div className="w-full lg:w-3/4">
          <JobListingTable
            jobs={jobs}
            onSelectJob={handleJobSelect}
            onUpdateJobStatus={handleUpdateJobStatus}
            onUpdateJobPriority={onUpdateJobPriority}
            onDeleteJob={handleDeleteJob}
            onToggleHidden={handleToggleHidden}
          />
        </div>

        {selectedJob && (
          <JobDetailPanel
            job={selectedJob}
            onUpdateJobStatus={handleUpdateJobStatus}
            onUpdateJobPriority={onUpdateJobPriority}
            onClose={handleJobClose}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
}
