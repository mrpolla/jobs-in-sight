
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Job } from '@/types/job';
import { v4 as uuidv4 } from 'uuid';

interface JsonImportDialogProps {
  onImport: (jobs: Job[]) => void;
  onCancel: () => void;
}

export default function JsonImportDialog({ onImport, onCancel }: JsonImportDialogProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [parsedJobs, setParsedJobs] = useState<Job[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParse = () => {
    try {
      setError(null);
      
      if (!jsonInput.trim()) {
        setError("Please enter JSON data");
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
        setError("Some jobs are missing required fields (position, company)");
        return;
      }

      setParsedJobs(jobs);
    } catch (e) {
      setError("Invalid JSON format. Please check your input.");
      console.error("JSON parse error:", e);
    }
  };

  const handleImport = () => {
    if (parsedJobs) {
      onImport(parsedJobs);
      toast.success(`Successfully imported ${parsedJobs.length} job(s)`);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Jobs from JSON</DialogTitle>
          <DialogDescription>
            Paste your JSON data below. You can paste a single job object or an array of jobs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!parsedJobs ? (
            <>
              <Textarea 
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"position": "Frontend Developer", "company": "Acme Inc", ...}'
                className="min-h-[200px] font-mono text-sm"
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <div className="flex justify-end">
                <Button variant="outline" onClick={onCancel} className="mr-2">
                  Cancel
                </Button>
                <Button onClick={handleParse}>
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
              <DialogFooter>
                <Button variant="outline" onClick={() => setParsedJobs(null)} className="mr-2">
                  Back to Edit
                </Button>
                <Button onClick={handleImport}>
                  Import Jobs
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
