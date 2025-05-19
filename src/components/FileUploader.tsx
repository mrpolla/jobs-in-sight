
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Job } from '@/types/job';
import { v4 as uuidv4 } from 'uuid';

interface FileUploaderProps {
  onImport: (jobs: Job[]) => void;
  onCancel: () => void;
}

export function FileUploader({ onImport, onCancel }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [parsedJobs, setParsedJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setFileContent(content);
        
        let parsedContent;
        try {
          parsedContent = JSON.parse(content);
        } catch (err) {
          throw new Error('Invalid JSON format');
        }
        
        // Handle both single job object and array of jobs
        const jobsArray = Array.isArray(parsedContent) ? parsedContent : [parsedContent];
        
        // Validate and transform jobs
        const processedJobs = jobsArray.map(job => {
          // Add required fields if missing
          const processedJob = {
            ...job,
            id: job.id || uuidv4(),
            priority_level: job.priority_level || 3,
            status: job.status || 'Applied',
            last_updated: job.last_updated || new Date().toISOString()
          };
          
          return processedJob;
        });
        
        setParsedJobs(processedJobs);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error processing file');
        toast.error('Error processing file: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
      toast.error('Error reading file');
    };
    
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/json') {
        processFile(file);
      } else {
        setError('Please upload a JSON file');
        toast.error('Please upload a JSON file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleImport = () => {
    if (parsedJobs.length > 0) {
      // Fix: Pass the entire array of jobs rather than calling onImport for each job
      onImport(parsedJobs);
      toast.success(`Successfully imported ${parsedJobs.length} job${parsedJobs.length === 1 ? '' : 's'}`);
    }
  };

  return (
    <DialogContent className="sm:max-w-lg" aria-describedby="file-uploader-description">
      <span id="file-uploader-description" className="sr-only">
        Upload JSON file with job data
      </span>
      <DialogHeader>
        <DialogTitle>Upload Job Data</DialogTitle>
        <DialogDescription>
          Upload a JSON file containing job application data to import
        </DialogDescription>
      </DialogHeader>
      
      {!fileContent ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".json" 
            className="hidden" 
            onChange={handleFileChange}
          />
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Drag and drop your JSON file here, or click to browse
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>Select File</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4 max-h-[300px] overflow-auto">
            <pre className="text-xs">
              {error ? (
                <span className="text-destructive">{error}</span>
              ) : (
                <span>
                  Found {parsedJobs.length} job{parsedJobs.length === 1 ? '' : 's'} to import
                </span>
              )}
            </pre>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={parsedJobs.length === 0 || !!error}
            >
              Import Data
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  );
}

export default FileUploader;
