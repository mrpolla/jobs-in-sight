import { useState, useEffect } from 'react';
import { Job, JobStatus, RequirementAssessment, RequirementMatch } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Pen, Trash, EyeOff, Eye, ExternalLink, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import JobStatusSelect from './JobStatusSelect';
import PrioritySelect from './PrioritySelect';
import { updateJob, deleteJob } from '@/lib/storage';
import { toast } from 'sonner';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { Progress } from './ui/progress';
import RequirementsAssessment from './RequirementsAssessment';
import RequirementsMatchDisplay from './RequirementsMatchDisplay';
import { getSalaryInfo, SalaryInfo } from '@/lib/salary-utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import SalaryDisplay from './SalaryDisplay';

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
  const [selectedReqStatus, setSelectedReqStatus] = useState<string | null>(null);
  const [salaryInfo, setSalaryInfo] = useState<SalaryInfo>({
    value: 'Salary not provided',
    source: 'none',
    icon: null,
    tooltip: 'No salary information available'
  });

  // Update state when job changes
  useEffect(() => {
    if (job) {
      setNotes(job.interview_notes || '');
      setStatus(job.status);
      setPriority(job.priority_level || 3);
      setHidden(job.hidden || false);
      setSalaryInfo(getSalaryInfo(
        job.possible_salary, 
        job.salary_from_external_sources, 
        job.salary_estimate_from_context
      ));
    }
  }, [job]);

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

  // Open URL in a new tab
  const openJobUrl = () => {
    if (job.url) {
      window.open(job.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Get match color based on score
  const getMatchScoreColor = (score?: number) => {
    if (!score) return '';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Get matched skills from requirements_match
  const getMatchedSkills = (job: Job): string[] => {
    if (job.cv_match?.requirements_match) {
      // Extract skills from "Can do well" requirements
      const wellSkills = job.cv_match.requirements_match
        .filter(req => req.status === "Can do well")
        .map(req => {
          // Extract skill keywords from requirement text
          const skill = req.requirement.split(' ').slice(0, 3).join(' ');
          return skill;
        });
      
      return wellSkills;
    }
    
    return [];
  };

  // Check for requirements assessment structure
  const requirementsMatch: RequirementMatch[] = job.cv_match?.requirements_match || [];
  const requirementsAssessment: RequirementAssessment[] = 
    job.application_reasoning?.requirements_assessment || [];

  // Filter requirements by selected status
  const filteredRequirementsMatch = selectedReqStatus
    ? requirementsMatch.filter(req => req.status === selectedReqStatus)
    : requirementsMatch;
    
  const filteredRequirementsAssessment = selectedReqStatus
    ? requirementsAssessment.filter(req => req.status === selectedReqStatus)
    : requirementsAssessment;
  
  // Get matched skills for tech stack display
  const matchedSkills = getMatchedSkills(job);

  return (
    <>
      <div className="side-panel w-full sm:w-[500px] bg-background shadow-xl border-l">
        <div className="p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{job.position}</h2>
              <h3 className="text-xl text-muted-foreground">{job.company}</h3>
              {job.url && (
                <a 
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 flex items-center text-sm mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3 mr-1" /> 
                  View job listing
                </a>
              )}
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
          {(job.match_score || job.cv_match?.overall_match_percentage) && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">CV Match Score</h3>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${getMatchScoreColor(job.match_score || job.cv_match?.overall_match_percentage)}`}>
                  {job.cv_match?.overall_match_percentage || job.match_score || 'N/A'}
                </div>
              </div>
              
              {job.match_summary && (
                <p className="text-sm mt-2">{job.match_summary}</p>
              )}
              
              {job.cv_match && (
                <div className="mt-3 space-y-2">
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
              {job.project && (
                <div>
                  <p className="text-sm text-muted-foreground">Project</p>
                  <p>{job.project}</p>
                </div>
              )}
              
              {job.product && (
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p>{job.product}</p>
                </div>
              )}
              
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
              
              {/* Hours per Week field */}
              {job.hours_per_week && (
                <div className="flex items-start gap-1">
                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Hours per Week</p>
                    <p>{job.hours_per_week}</p>
                  </div>
                </div>
              )}
              
              {/* Vacation Days field */}
              {job.vacation_days && (
                <div className="flex items-start gap-1">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Vacation Days</p>
                    <p>{job.vacation_days}</p>
                  </div>
                </div>
              )}
              
              {job.seniority_level && (
                <div>
                  <p className="text-sm text-muted-foreground">Seniority Level</p>
                  <p>{job.seniority_level}</p>
                </div>
              )}
              
              {/* Salary Information Section - Using SalaryDisplay component */}
              <div>
                <p className="text-sm text-muted-foreground">Salary Range</p>
                <SalaryDisplay job={job} />
              </div>
              
              {/* Display raw values for debugging/reference if needed */}
              {job.possible_salary && salaryInfo.source !== 'direct' && (
                <div className="hidden">
                  <p className="text-sm text-muted-foreground">Listed Salary</p>
                  <p>{job.possible_salary}</p>
                </div>
              )}
              
              {job.salary_from_external_sources && salaryInfo.source !== 'external' && (
                <div className="hidden">
                  <p className="text-sm text-muted-foreground">External Salary Data</p>
                  <p>{job.salary_from_external_sources}</p>
                </div>
              )}
              
              {job.salary_estimate_from_context && salaryInfo.source !== 'estimate' && (
                <div className="hidden">
                  <p className="text-sm text-muted-foreground">Estimated Salary</p>
                  <p>{job.salary_estimate_from_context}</p>
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
              
              {job.contract_duration && (
                <div>
                  <p className="text-sm text-muted-foreground">Contract Duration</p>
                  <p>{job.contract_duration}</p>
                </div>
              )}
              
              {job.start_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p>{formatDate(job.start_date)}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="company" className="space-y-4 mt-4">
              {job.industry && (
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p>{job.industry}</p>
                </div>
              )}
              
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
              
              {job.job_posting_clarity_score !== null && job.job_posting_clarity_score !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">Job Posting Clarity Score</p>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(job.job_posting_clarity_score / 5) * 100} 
                      className="h-2 w-40" 
                    />
                    <span>{job.job_posting_clarity_score}/5</span>
                  </div>
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
                      const isMatched = matchedSkills.includes(tech);
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
                  
                  {matchedSkills.length > 0 && (
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
              
              {/* Requirements Match Section */}
              {requirementsMatch.length > 0 && (
                <div className="border rounded-md p-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Requirements Match</h4>
                    <div className="flex gap-1">
                      <Button 
                        variant={selectedReqStatus === null ? "default" : "outline"} 
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setSelectedReqStatus(null)}
                      >
                        All
                      </Button>
                      <Button 
                        variant={selectedReqStatus === "Can do well" ? "default" : "outline"} 
                        size="sm"
                        className={`h-7 text-xs ${selectedReqStatus === "Can do well" ? "bg-green-600 hover:bg-green-700" : "text-green-600 border-green-600"}`}
                        onClick={() => setSelectedReqStatus(selectedReqStatus === "Can do well" ? null : "Can do well")}
                      >
                        Can Do
                      </Button>
                      <Button 
                        variant={selectedReqStatus === "Can transfer" ? "default" : "outline"} 
                        size="sm"
                        className={`h-7 text-xs ${selectedReqStatus === "Can transfer" ? "bg-amber-600 hover:bg-amber-700" : "text-amber-600 border-amber-600"}`}
                        onClick={() => setSelectedReqStatus(selectedReqStatus === "Can transfer" ? null : "Can transfer")}
                      >
                        Transfer
                      </Button>
                      <Button 
                        variant={selectedReqStatus === "Must learn" ? "default" : "outline"} 
                        size="sm"
                        className={`h-7 text-xs ${selectedReqStatus === "Must learn" ? "bg-red-600 hover:bg-red-700" : "text-red-600 border-red-600"}`}
                        onClick={() => setSelectedReqStatus(selectedReqStatus === "Must learn" ? null : "Must learn")}
                      >
                        Learn
                      </Button>
                    </div>
                  </div>
                  
                  <RequirementsMatchDisplay requirements={filteredRequirementsMatch} />
                </div>
              )}
              
              {/* Legacy Requirements Assessment Section - only show if the new format isn't available */}
              {!requirementsMatch.length && requirementsAssessment.length > 0 && (
                <div className="border rounded-md p-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Requirements Assessment</h4>
                    <div className="flex gap-1">
                      <Button 
                        variant={selectedReqStatus === null ? "default" : "outline"} 
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setSelectedReqStatus(null)}
                      >
                        All
                      </Button>
                      <Button 
                        variant={selectedReqStatus === "Can do well" ? "default" : "outline"} 
                        size="sm"
                        className={`h-7 text-xs ${selectedReqStatus === "Can do well" ? "bg-green-600 hover:bg-green-700" : "text-green-600 border-green-600"}`}
                        onClick={() => setSelectedReqStatus(selectedReqStatus === "Can do well" ? null : "Can do well")}
                      >
                        Can Do
                      </Button>
                      <Button 
                        variant={selectedReqStatus === "Can transfer" ? "default" : "outline"} 
                        size="sm"
                        className={`h-7 text-xs ${selectedReqStatus === "Can transfer" ? "bg-amber-600 hover:bg-amber-700" : "text-amber-600 border-amber-600"}`}
                        onClick={() => setSelectedReqStatus(selectedReqStatus === "Can transfer" ? null : "Can transfer")}
                      >
                        Transfer
                      </Button>
                      <Button 
                        variant={selectedReqStatus === "Must learn" ? "default" : "outline"} 
                        size="sm"
                        className={`h-7 text-xs ${selectedReqStatus === "Must learn" ? "bg-red-600 hover:bg-red-700" : "text-red-600 border-red-600"}`}
                        onClick={() => setSelectedReqStatus(selectedReqStatus === "Must learn" ? null : "Must learn")}
                      >
                        Learn
                      </Button>
                    </div>
                  </div>
                  
                  <RequirementsAssessment requirements={filteredRequirementsAssessment} />
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
              
              {/* Application Reasoning Section */}
              {job.application_reasoning && (
                <div className="border rounded-md p-3 mt-4">
                  <p className="text-sm font-medium mb-2">Application Reasoning</p>
                  
                  {job.application_reasoning.why_apply && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground">Why Apply</p>
                      <p className="text-sm whitespace-pre-wrap">{job.application_reasoning.why_apply}</p>
                    </div>
                  )}
                  
                  {job.application_reasoning.key_matching_qualifications?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground">Key Matching Qualifications</p>
                      <ul className="text-sm list-disc list-inside">
                        {job.application_reasoning.key_matching_qualifications.map((qual, i) => (
                          <li key={i}>{qual}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {job.application_reasoning.learning_needs?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground">Learning Needs</p>
                      <ul className="text-sm list-disc list-inside">
                        {job.application_reasoning.learning_needs.map((need, i) => (
                          <li key={i}>{need}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {job.application_reasoning.overall_fit_assessment && (
                    <div>
                      <p className="text-xs text-muted-foreground">Overall Fit Assessment</p>
                      <p className="text-sm">{job.application_reasoning.overall_fit_assessment}</p>
                    </div>
                  )}
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
              
              {/* CV Match details if available */}
              {job.cv_match && (
                <div className="border rounded-md p-3 mt-4">
                  <p className="text-sm font-medium mb-2">CV Match Details</p>
                  
                  {/* Experience Match */}
                  {job.cv_match.experience_match && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground">Experience Match</p>
                      <div className="flex justify-between items-center">
                        <span>Score: {job.cv_match.experience_match.score}%</span>
                      </div>
                      <Progress 
                        value={job.cv_match.experience_match.score || 0} 
                        className="h-1.5 my-1" 
                      />
                      {job.cv_match.experience_match.years_required && (
                        <p className="text-xs">Required: {job.cv_match.experience_match.years_required} years</p>
                      )}
                      {job.cv_match.experience_match.years_experience && (
                        <p className="text-xs">Your experience: {job.cv_match.experience_match.years_experience} years</p>
                      )}
                      {job.cv_match.experience_match.domain_match && (
                        <p className="text-xs">Domain match: {job.cv_match.experience_match.domain_match}</p>
                      )}
                      
                      {job.cv_match.experience_match.domain_overlap?.length > 0 && (
                        <div className="mt-1">
                          <p className="text-xs">Domain overlap:</p>
                          <ul className="list-disc list-inside text-xs pl-2">
                            {job.cv_match.experience_match.domain_overlap.map((domain, i) => (
                              <li key={i}>{domain}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {job.cv_match.experience_match.role_similarity && (
                        <p className="text-xs">Role similarity: {job.cv_match.experience_match.role_similarity}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Seniority Match */}
                  {job.cv_match.seniority_match && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground">Seniority Match</p>
                      <div className="flex justify-between items-center">
                        <span>Score: {job.cv_match.seniority_match.score}%</span>
                      </div>
                      <Progress 
                        value={job.cv_match.seniority_match.score || 0} 
                        className="h-1.5 my-1" 
                      />
                      {job.cv_match.seniority_match.alignment && (
                        <p className="text-xs">Alignment: {job.cv_match.seniority_match.alignment}</p>
                      )}
                      {job.cv_match.seniority_match.notes && (
                        <p className="text-xs">{job.cv_match.seniority_match.notes}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Industry Match */}
                  {job.cv_match.industry_match && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground">Industry Match</p>
                      <div className="flex justify-between items-center">
                        <span>Score: {job.cv_match.industry_match.score}%</span>
                      </div>
                      <Progress 
                        value={job.cv_match.industry_match.score || 0} 
                        className="h-1.5 my-1" 
                      />
                      {job.cv_match.industry_match.familiarity && (
                        <p className="text-xs">Familiarity: {job.cv_match.industry_match.familiarity}</p>
                      )}
                      {job.cv_match.industry_match.transferable_experience && (
                        <p className="text-xs">{job.cv_match.industry_match.transferable_experience}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Project Match */}
                  {job.cv_match.project_match && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground">Project Match</p>
                      <div className="flex justify-between items-center">
                        <span>Score: {job.cv_match.project_match.score}%</span>
                      </div>
                      <Progress 
                        value={job.cv_match.project_match.score || 0} 
                        className="h-1.5 my-1" 
                      />
                      {job.cv_match.project_match.environment_similarity && (
                        <p className="text-xs">Environment similarity: {job.cv_match.project_match.environment_similarity}</p>
                      )}
                      
                      {job.cv_match.project_match.similar_projects?.length > 0 && (
                        <div className="mt-1">
                          <p className="text-xs">Similar projects:</p>
                          <ul className="list-disc list-inside text-xs pl-2">
                            {job.cv_match.project_match.similar_projects.map((project, i) => (
                              <li key={i}>{project}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Compensation */}
                  {job.cv_match.compensation_alignment && job.cv_match.compensation_alignment.score !== null && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground">Compensation Alignment</p>
                      <div className="flex justify-between items-center">
                        <span>Score: {job.cv_match.compensation_alignment.score}%</span>
                      </div>
                      <Progress 
                        value={job.cv_match.compensation_alignment.score || 0} 
                        className="h-1.5 my-1" 
                      />
                      {job.cv_match.compensation_alignment.notes && (
                        <p className="text-xs">{job.cv_match.compensation_alignment.notes}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Location */}
                  {job.cv_match.location_compatibility && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground">Location Compatibility</p>
                      <div className="flex justify-between items-center">
                        <span>Score: {job.cv_match.location_compatibility.score}%</span>
                      </div>
                      <Progress 
                        value={job.cv_match.location_compatibility.score || 0} 
                        className="h-1.5 my-1" 
                      />
                      {job.cv_match.location_compatibility.notes && (
                        <p className="text-xs">{job.cv_match.location_compatibility.notes}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Missing Skills */}
                  {job.cv_match.requirements_match?.filter(r => r.status === "Must learn").length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground">Skills to Learn</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {job.cv_match.requirements_match
                          .filter(r => r.status === "Must learn")
                          .map((req, i) => (
                            <Badge key={i} variant="outline" className="text-destructive border-destructive">
                              {req.requirement.split(' ').slice(0, 3).join(' ')}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  )}
                  
                  {/* Transferable Skills Section */}
                  {job.cv_match.requirements_match?.filter(r => r.status === "Can transfer").length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Transferable Skills Areas</p>
                      <ul className="text-sm list-disc list-inside">
                        {job.cv_match.requirements_match
                          .filter(r => r.status === "Can transfer")
                          .flatMap(r => r.transferable_skills)
                          .map((skill, i) => (
                            <li key={i}>{skill}</li>
                          ))
                        }
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
