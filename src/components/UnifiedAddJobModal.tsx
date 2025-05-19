import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, ClipboardType, Upload } from 'lucide-react';
import AddJobForm from './AddJobForm';
import { Job } from '@/types/job';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from './ui/textarea';

interface UnifiedAddJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddJob: (job: Job) => void;
}

export default function UnifiedAddJobModal({ 
  open, 
  onOpenChange,
  onAddJob
}: UnifiedAddJobModalProps) {
  const [activeTab, setActiveTab] = useState<string>('json-paste');
  
  // JSON Paste state
  const [jsonInput, setJsonInput] = useState('');
  const [parsedJobs, setParsedJobs] = useState<Job[] | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  
  // File Upload state
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [uploadedJobs, setUploadedJobs] = useState<Job[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const resetState = () => {
    setJsonInput('');
    setParsedJobs(null);
    setJsonError(null);
    setFileContent(null);
    setUploadedJobs([]);
    setFileError(null);
    setIsDragging(false);
  };

  // Handle closing the modal
  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // JSON Paste functionality
  const handleJsonParse = () => {
    try {
      setJsonError(null);
      
      if (!jsonInput.trim()) {
        setJsonError("Please enter JSON data");
        return;
      }

      const parsed = JSON.parse(jsonInput);
      let jobs: Job[] = [];

      // Handle both single job object and array of jobs
      if (Array.isArray(parsed)) {
        jobs = parsed.map(job => ({
          ...job,
          id: job.id || uuidv4(),
          priority_level: job.priority_level || 3,
          status: job.status || 'New',
          last_updated: job.last_updated || new Date().toISOString()
        }));
      } else {
        jobs = [{
          ...parsed,
          id: parsed.id || uuidv4(),
          priority_level: parsed.priority_level || 3,
          status: parsed.status || 'New',
          last_updated: parsed.last_updated || new Date().toISOString()
        }];
      }

      // Validate required fields
      const invalidJobs = jobs.filter(job => !job.position || !job.company);
      
      if (invalidJobs.length > 0) {
        setJsonError("Some jobs are missing required fields (position, company)");
        return;
      }

      setParsedJobs(jobs);
    } catch (e) {
      setJsonError("Invalid JSON format. Please check your input.");
      console.error("JSON parse error:", e);
    }
  };

  const handleJsonImport = () => {
    if (parsedJobs && parsedJobs.length > 0) {
      // FIX: Add all jobs in a single batch instead of iterating through them
      onAddJob({...parsedJobs[0], batch: parsedJobs});
      toast.success(`Successfully imported ${parsedJobs.length} job(s)`);
      handleClose();
    }
  };

  // File Upload functionality
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
        
        setUploadedJobs(processedJobs);
        setFileError(null);
      } catch (err) {
        setFileError(err instanceof Error ? err.message : 'Error processing file');
        toast.error('Error processing file: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    };
    
    reader.onerror = () => {
      setFileError('Error reading file');
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
        setFileError('Please upload a JSON file');
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

  const handleFileImport = () => {
    if (uploadedJobs.length > 0) {
      // FIX: Add all jobs in a single batch instead of iterating through them
      onAddJob({...uploadedJobs[0], batch: uploadedJobs});
      toast.success(`Successfully imported ${uploadedJobs.length} job${uploadedJobs.length === 1 ? '' : 's'}`);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] max-h-screen overflow-y-auto" aria-describedby="dialog-description">
        <span id="dialog-description" className="sr-only">
          Add job dialog with options to paste JSON, upload file, or add manually
        </span>
        <DialogHeader>
          <DialogTitle>Add Job</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="json-paste" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="json-paste" className="flex items-center gap-2">
              <ClipboardType className="h-4 w-4" />
              <span className="hidden sm:inline">Paste JSON</span>
            </TabsTrigger>
            <TabsTrigger value="file-upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload File</span>
            </TabsTrigger>
            <TabsTrigger value="manual-entry" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Manually</span>
            </TabsTrigger>
          </TabsList>
          
          {/* JSON Paste Tab */}
          <TabsContent value="json-paste" className="space-y-4">
            {!parsedJobs ? (
              <>
                <Textarea 
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{"position": "Frontend Developer", "company": "Acme Inc", ...}'
                  className="min-h-[200px] font-mono text-sm"
                />
                {jsonError && (
                  <p className="text-sm text-destructive">{jsonError}</p>
                )}
                <div className="flex justify-end">
                  <Button onClick={handleJsonParse}>
                    Parse JSON
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                  <p className="font-medium">Preview ({parsedJobs.length} job{parsedJobs.length !== 1 ? 's' : ''})</p>
                  <ul className="mt-2 space-y-2">
                    {parsedJobs.map((job, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">{job.position}</span> at <span>{job.company}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setParsedJobs(null)}>
                    Back to Edit
                  </Button>
                  <Button onClick={handleJsonImport}>
                    Import Jobs
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          {/* File Upload Tab */}
          <TabsContent value="file-upload" className="space-y-4">
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
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  id="file-upload"
                  onChange={handleFileChange}
                />
                
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Drag and drop your JSON file here, or click to browse
                  </p>
                  <Button onClick={() => document.getElementById('file-upload')?.click()}>
                    Select File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4 max-h-[300px] overflow-auto">
                  {fileError ? (
                    <span className="text-destructive">{fileError}</span>
                  ) : (
                    <>
                      <p className="font-medium mb-2">Found {uploadedJobs.length} job{uploadedJobs.length === 1 ? '' : 's'} to import</p>
                      <ul className="space-y-2">
                        {uploadedJobs.map((job, index) => (
                          <li key={index} className="text-sm">
                            <span className="font-medium">{job.position}</span> at <span>{job.company}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFileContent(null);
                      setUploadedJobs([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleFileImport} 
                    disabled={uploadedJobs.length === 0 || !!fileError}
                  >
                    Import Data
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Manual Entry Tab */}
          <TabsContent value="manual-entry">
            <AddJobForm 
              onSave={job => {
                onAddJob(job);
                handleClose();
              }} 
              onCancel={handleClose} 
              embedded={true}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
