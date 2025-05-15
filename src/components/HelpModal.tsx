
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onOpenChange }) => {
  const handleDownloadPrompt = () => {
    const promptText = `

# Job Analysis Prompt

You are a career advisor and job application specialist. I want you to analyze job listings for me and compare them with my CV to help me understand if I'm a good fit.

When I provide you with a job listing URL or text, please:

1. Extract all relevant job details (position, company, location, etc.)
2. Identify the technical requirements and skills needed
3. Research the company background if not explicitly stated
4. Estimate salary range if not provided
5. Compare the requirements with my CV
6. Provide a match score as a percentage
7. Categorize each requirement as "Can do well", "Can transfer", or "Must learn"
8. Analyze if my experience level matches the position
9. Suggest if this is a good opportunity based on my career path
10. Provide 3 reasons why I should apply based on my qualifications

Return your analysis in the following JSON format (very important):

\`\`\`json
{
  "position": "Job title",
  "company": "Company name",
  "location": "Job location",
  "remote": true/false/partial,
  "job_type": "Full-time/Contract/etc",
  "job_url": "URL of the job listing",
  "description": "Brief job description",
  "date_added": "YYYY-MM-DD",
  "date_found": "YYYY-MM-DD",
  "date_applied": "",
  "status": "Not Applied",
  "hidden": false,
  "priority_level": 1-5,
  "tech_stack": ["Tech1", "Tech2"],
  "company_info": {
    "industry": "Industry type",
    "size": "Company size",
    "reputation": "Known reputation"
  },
  "salary": {
    "min": number,
    "max": number,
    "currency": "USD",
    "period": "yearly/monthly/hourly"
  },
  "requirements": {
    "skills": ["Skill1", "Skill2"],
    "experience_years": number,
    "education": "Required education",
    "seniority": "Junior/Mid/Senior"
  },
  "match_analysis": {
    "overall_score": number (0-100),
    "requirements_assessment": [
      {
        "requirement": "Specific requirement",
        "status": "Can do well/Can transfer/Must learn",
        "explanation": "Brief explanation"
      }
    ],
    "experience_match": {
      "years_match": "Below/Meet/Exceed",
      "domain_overlap": "Low/Medium/High",
      "explanation": "Brief explanation"
    },
    "seniority_alignment": "Below/At level/Above",
    "application_reasoning": [
      "Reason 1",
      "Reason 2",
      "Reason 3"
    ]
  },
  "notes": "",
  "contacts": []
}
\`\`\`

Important: Ensure all JSON fields are properly formatted, as this output will be imported directly into my job tracking tool.
`;

    // Create a blob from the prompt text
    const blob = new Blob([promptText], { type: 'text/plain' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-analysis-prompt.txt';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Prompt downloaded successfully');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">How to Use Job Tracker with ChatGPT</DialogTitle>
          <DialogDescription className="text-base">
            This application helps you analyze job listings by leveraging ChatGPT to extract information and compare it with your CV.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 text-sm">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Step 1: Set Up Your ChatGPT Project</h2>
            <ol className="list-decimal list-inside pl-4 space-y-1">
              <li>Create a new project in ChatGPT</li>
              <li>Upload your CV as a file to the project</li>
              <li>Upload the job analysis prompt (available for download below)</li>
            </ol>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Step 2: Analyze a Job Listing</h2>
            <ol className="list-decimal list-inside pl-4 space-y-1">
              <li>Find a job listing you're interested in</li>
              <li>Copy the URL of the job listing</li>
              <li>In your ChatGPT project, paste the URL and send it to ChatGPT</li>
              <li>ChatGPT will analyze the listing and return a JSON response</li>
              <li>Copy the entire JSON response</li>
            </ol>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Step 3: Import to Job Tracker</h2>
            <ol className="list-decimal list-inside pl-4 space-y-1">
              <li>In Job Tracker, click the "Add Job" or "JSON Paste" button</li>
              <li>Paste the JSON from ChatGPT</li>
              <li>Your job will be added with all analysis data</li>
            </ol>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">What Information is Retrieved</h2>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li><strong>Basic Job Details</strong>: Position, company, location, job type, etc. (directly from listing)</li>
              <li><strong>Technical Details</strong>: Tech stack, required skills, seniority level (extracted from listing)</li>
              <li><strong>Company Information</strong>: Industry, company size, reputation (researched by AI)</li>
              <li><strong>Salary Information</strong>: Listed salary or estimates from external sources (if available)</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">What the AI Analyzes</h2>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li><strong>CV Match Score</strong>: Overall percentage match between your CV and job requirements</li>
              <li><strong>Requirements Assessment</strong>: Each requirement categorized as "Can do well," "Can transfer," or "Must learn"</li>
              <li><strong>Experience Match</strong>: Analysis of your years of experience and domain overlap</li>
              <li><strong>Seniority Alignment</strong>: Whether the position is lateral, upward, or downward move</li>
              <li><strong>Application Reasoning</strong>: Personalized reasons why you should apply based on your CV</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Example Workflow</h2>
            <ol className="list-decimal list-inside pl-4 space-y-1">
              <li>Create a ChatGPT project and upload your CV</li>
              <li>Use the prompt below with a job URL like: "Please analyze this job listing: https://example.com/job/123"</li>
              <li>ChatGPT will return a JSON analysis that you can import to Job Tracker</li>
              <li>Track your application status, add notes, and manage your job search</li>
            </ol>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Download the ChatGPT Prompt</h2>
            <div className="flex justify-center mt-4">
              <Button onClick={handleDownloadPrompt} variant="outline">
                Download Prompt Template
              </Button>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Example ChatGPT Prompt</h2>
            <div className="bg-muted p-4 rounded-md overflow-x-auto">
              <pre className="whitespace-pre-wrap">
              You are a career advisor and job application specialist. I want you to analyze job listings for me 
              and compare them with my CV to help me understand if I'm a good fit.
              
              When I provide you with a job listing URL or text, please analyze it and return a JSON response...
              </pre>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
