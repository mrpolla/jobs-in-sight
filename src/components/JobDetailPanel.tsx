
import { useState, useEffect } from 'react';
import { Job, JobStatus } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Pen, Trash, EyeOff, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import JobStatusSelect from './JobStatusSelect';
import PrioritySelect from './PrioritySelect';
import { updateJob, deleteJob } from '@/lib/storage';
import { toast } from 'sonner';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { Progress } from './ui/progress';

interface JobDetailPanelProps {
  job: Job | null;
  onClose: () => void;
  onJobUpdated: (job: Job) => void;
  onJobDeleted: (jobId: string) => void;
}

export default function JobDetailPanel({ job, onClose, onJobUpdated, onJobDeleted }: JobDetailPanelProps) {
  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState(job?.interview_notes || '');
  const [status, setStatus] = useState<JobStatus>(job?.status || 'New');
  const [priority, setPriority] = useState<number>(job?.priority_level || 3);
  const [hidden, setHidden] = useState<boolean>(job?.hidden || false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Update state when job changes
  useEffect(() => {
    if (job) {
      setNotes(job.interview_notes || '');
      setStatus(job.status);
      setPriority(job.priority_level);
      setHidden(job.hidden || false);
    }
  }, [job]);

  console.log("Side panel rendered with job:", job);

  if (!job) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleSave = () => {
    if (!job) return;
    
    const updatedJob: Job = {
      ...job,
      interview_notes: notes,
      status,
      priority_level: priority,
      hidden,
      last_updated: new Date().toISOString()
    };
    
    updateJob(updatedJob);
    onJobUpdated(updatedJob);
    setEditMode(false);
    toast.success('Job details updated');
  };

  const handleStatusChange = (newStatus: JobStatus) => {
    setStatus(newStatus);
    if (!editMode) {
      const updatedJob: Job = {
        ...job,
        status: newStatus,
        last_updated: new Date().toISOString()
      };
      updateJob(updatedJob);
      onJobUpdated(updatedJob);
      toast.success(`Status updated to ${newStatus}`);
    }
  };

  const handlePriorityChange = (newPriority: number) => {
    setPriority(newPriority);
    if (!editMode) {
      const updatedJob: Job = {
        ...job,
        priority_level: newPriority,
        last_updated: new Date().toISOString()
      };
      updateJob(updatedJob);
      onJobUpdated(updatedJob);
      toast.success(`Priority updated to ${newPriority === 1 ? 'High' : newPriority === 2 ? 'Medium' : 'Low'}`);
    }
  };

  const handleToggleHidden = () => {
    const newHidden = !hidden;
    setHidden(newHidden);
    if (!editMode) {
      const updatedJob: Job = {
        ...job,
        hidden: newHidden,
        last_updated: new Date().toISOString()
      };
      updateJob(updatedJob);
      onJobUpdated(updatedJob);
      toast.success(newHidden ? 'Job hidden' : 'Job unhidden');
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!job) return;
    
    deleteJob(job.id);
    onJobDeleted(job.id);
    setShowDeleteConfirm(false);
    toast.success('Job deleted successfully');
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Get match color based on score
  const getMatchScoreColor = (score?: number) => {
    if (!score) return '';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <>
      <div className="side-panel w-full sm:w-[500px] bg-background shadow-xl border-l">
        <div className="p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{job.position}</h2>
              <h3 className="text-xl text-muted-foreground">{job.company}</h3>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggleHidden}
                title={hidden ? "Show job" : "Hide job"}
              >
                {hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setEditMode(!editMode)}>
                <Pen className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleDelete}>
                <Trash className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <JobStatusSelect 
                value={status}
                onChange={handleStatusChange}
                disabled={!editMode && status === job.status}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Priority</p>
              <PrioritySelect 
                value={priority}
                onChange={handlePriorityChange}
                disabled={!editMode && priority === job.priority_level}
              />
            </div>
          </div>

          {/* Match Score Section */}
          {(job.match_score || job.cv_match) && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">CV Match Score</h3>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${getMatchScoreColor(job.match_score || job.cv_match?.overall_match_percentage)}`}>
                  {job.match_score || job.cv_match?.overall_match_percentage || 'N/A'}
                </div>
              </div>
              
              {job.match_summary && (
                <p className="text-sm mt-2">{job.match_summary}</p>
              )}
              
              {job.cv_match && (
                <div className="mt-3 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs">
                      <span>Tech Stack</span>
                      <span>{job.cv_match.tech_stack_match.score}%</span>
                    </div>
                    <Progress value={job.cv_match.tech_stack_match.score} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs">
                      <span>Experience</span>
                      <span>{job.cv_match.experience_match.score}%</span>
                    </div>
                    <Progress value={job.cv_match.experience_match.score} className="h-1.5" />
                  </div>
                </div>
              )}
            </div>
          )}

          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="company" className="flex-1">Company</TabsTrigger>
              <TabsTrigger value="requirements" className="flex-1">Requirements</TabsTrigger>
              <TabsTrigger value="application" className="flex-1">Application</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4">
              {job.location && (
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{job.location}</p>
                </div>
              )}
              
              {job.job_type && (
                <div>
                  <p className="text-sm text-muted-foreground">Job Type</p>
                  <p>{job.job_type}</p>
                </div>
              )}
              
              {job.remote_policy && (
                <div>
                  <p className="text-sm text-muted-foreground">Remote Policy</p>
                  <p>{job.remote_policy}</p>
                </div>
              )}
              
              {job.seniority_level && (
                <div>
                  <p className="text-sm text-muted-foreground">Seniority Level</p>
                  <p>{job.seniority_level}</p>
                </div>
              )}
              
              {job.possible_salary && (
                <div>
                  <p className="text-sm text-muted-foreground">Salary Range</p>
                  <p>{job.possible_salary}</p>
                </div>
              )}
              
              {job.job_description && (
                <div>
                  <p className="text-sm text-muted-foreground">Job Description</p>
                  <p className="whitespace-pre-wrap">{job.job_description}</p>
                </div>
              )}
              
              {job.benefits && (
                <div>
                  <p className="text-sm text-muted-foreground">Benefits</p>
                  <p>{job.benefits}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="company" className="space-y-4 mt-4">
              {job.company_info && (
                <div>
                  <p className="text-sm text-muted-foreground">About Company</p>
                  <p>{job.company_info}</p>
                </div>
              )}
              
              {job.company_products && (
                <div>
                  <p className="text-sm text-muted-foreground">Products/Services</p>
                  <p>{job.company_products}</p>
                </div>
              )}
              
              {job.company_size && (
                <div>
                  <p className="text-sm text-muted-foreground">Company Size</p>
                  <p>{job.company_size}</p>
                </div>
              )}
              
              {job.industry && (
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p>{job.industry}</p>
                </div>
              )}
              
              {job.company_reputation && (
                <div>
                  <p className="text-sm text-muted-foreground">Reputation</p>
                  <p>{job.company_reputation}</p>
                </div>
              )}
              
              {job.team_description && (
                <div>
                  <p className="text-sm text-muted-foreground">Team</p>
                  <p>{job.team_description}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="requirements" className="space-y-4 mt-4">
              {job.requirements && (
                <div>
                  <p className="text-sm text-muted-foreground">Requirements</p>
                  <p className="whitespace-pre-wrap">{job.requirements}</p>
                </div>
              )}
              
              {job.tech_stack && job.tech_stack.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Tech Stack</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {job.tech_stack.map((tech, index) => {
                      const isMatched = job.cv_match?.tech_stack_match?.matched_skills?.includes(tech);
                      return (
                        <Badge 
                          key={index} 
                          variant={isMatched ? "default" : "secondary"}
                          className={isMatched ? "bg-green-600" : ""}
                        >
                          {tech}
                          {isMatched && " ✓"}
                        </Badge>
                      );
                    })}
                  </div>
                  
                  {job.cv_match?.tech_stack_match?.matched_skills && (
                    <p className="text-xs text-muted-foreground mt-2">
                      ✓ indicates skills matching your CV
                    </p>
                  )}
                </div>
              )}
              
              {job.languages_required && job.languages_required.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Languages</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {job.languages_required.map((language, index) => (
                      <Badge key={index} variant="outline">{language}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {job.project_or_product && (
                <div>
                  <p className="text-sm text-muted-foreground">Project/Product</p>
                  <p>{job.project_or_product}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="application" className="space-y-4 mt-4">
              {job.applied_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Applied Date</p>
                  <p>{formatDate(job.applied_date)}</p>
                </div>
              )}
              
              {job.application_deadline && (
                <div>
                  <p className="text-sm text-muted-foreground">Application Deadline</p>
                  <p>{formatDate(job.application_deadline)}</p>
                </div>
              )}
              
              {job.recruiter_contact && (
                <div>
                  <p className="text-sm text-muted-foreground">Recruiter Contact</p>
                  <p>{job.recruiter_contact}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                {editMode ? (
                  <Textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    className="min-h-[150px] mt-1" 
                    placeholder="Add your notes here..."
                  />
                ) : (
                  <p className="whitespace-pre-wrap bg-secondary p-3 rounded-md min-h-[100px]">
                    {job.interview_notes || 'No notes yet.'}
                  </p>
                )}
              </div>
              
              {job.rating_match && (
                <div>
                  <p className="text-sm text-muted-foreground">Match Rating</p>
                  <div className="flex items-center mt-1">
                    {Array.from({length: 5}).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-1 ${
                          i < job.rating_match! ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}
                      >
                        {i < job.rating_match! ? i + 1 : ''}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* CV Match details if available */}
              {job.cv_match && (
                <div className="border rounded-md p-3 mt-4">
                  <p className="text-sm font-medium mb-2">CV Match Details</p>
                  
                  {job.cv_match.tech_stack_match?.missing_skills?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground">Missing Skills</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {job.cv_match.tech_stack_match.missing_skills.map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-destructive border-destructive">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {job.cv_match.tech_stack_match?.transferable_skills?.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Transferable Skills</p>
                      <ul className="text-sm list-disc list-inside">
                        {job.cv_match.tech_stack_match.transferable_skills.map((skill, i) => (
                          <li key={i}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {job.cv_match.experience_match?.domain_overlap?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Experience Overlap</p>
                      <ul className="text-sm list-disc list-inside">
                        {job.cv_match.experience_match.domain_overlap.map((domain, i) => (
                          <li key={i}>{domain}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {job.cv_match.project_match?.similar_projects?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Similar Projects</p>
                      <ul className="text-sm list-disc list-inside">
                        {job.cv_match.project_match.similar_projects.map((project, i) => (
                          <li key={i}>{project}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {editMode && (
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationDialog 
        isOpen={showDeleteConfirm}
        jobTitle={`${job.position} at ${job.company}`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}
