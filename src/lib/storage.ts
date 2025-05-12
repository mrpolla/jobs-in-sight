
import { Job } from "@/types/job";

const STORAGE_KEY = 'job-tracker-data';

export const saveJobs = (jobs: Job[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error('Error saving jobs to localStorage:', error);
  }
};

export const loadJobs = (): Job[] => {
  try {
    const storedJobs = localStorage.getItem(STORAGE_KEY);
    return storedJobs ? JSON.parse(storedJobs) : [];
  } catch (error) {
    console.error('Error loading jobs from localStorage:', error);
    return [];
  }
};

export const addJob = (job: Job): void => {
  const jobs = loadJobs();
  jobs.push(job);
  saveJobs(jobs);
};

export const updateJob = (updatedJob: Job): void => {
  const jobs = loadJobs();
  const index = jobs.findIndex(job => job.id === updatedJob.id);
  
  if (index !== -1) {
    updatedJob.last_updated = new Date().toISOString();
    jobs[index] = updatedJob;
    saveJobs(jobs);
  }
};

export const deleteJob = (jobId: string): void => {
  const jobs = loadJobs();
  const filteredJobs = jobs.filter(job => job.id !== jobId);
  saveJobs(filteredJobs);
};

export const clearAllJobs = (): void => {
  saveJobs([]);
};
