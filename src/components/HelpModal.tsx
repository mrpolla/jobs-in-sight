import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, BookOpen, Code, LayoutDashboard } from "lucide-react";

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
    const blob = new Blob([promptText], { type: "text/plain" });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "job-analysis-prompt.txt";
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Prompt downloaded successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-800 p-6 rounded-t-lg -mt-6 -mx-6 mb-6">
          <h2 className="text-xl font-bold text-white">
            How to Use Job Tracker
          </h2>
          <p className="text-slate-300 text-sm">
            Complete these steps to analyze job opportunities
          </p>
        </div>

        {/* Main content: 4 simple steps */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              1
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">
                Download Prompt Template
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Download the prompt template for job analysis
              </p>
              <Button
                onClick={handleDownloadPrompt}
                className="bg-slate-800 hover:bg-slate-700 text-white"
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Prompt
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              2
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">
                Create ChatGPT Project
              </h3>
              <p className="text-sm text-slate-600 mb-2">
                Create a new ChatGPT project and upload your CV
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 p-2 rounded">
                <BookOpen className="h-4 w-4" />
                <span>CV can be in Word, TXT, or PDF format</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              3
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Analyze Job Listing</h3>
              <p className="text-sm text-slate-600 mb-2">
                Paste a job URL into ChatGPT with the prompt
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 p-2 rounded">
                <Code className="h-4 w-4" />
                <span>
                  Example: "Please analyze this job:
                  https://example.com/job/123"
                </span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4">
            <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              4
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">
                Import to Job Tracker
              </h3>
              <p className="text-sm text-slate-600 mb-2">
                Copy the entire JSON response and import it
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 p-2 rounded">
                <LayoutDashboard className="h-4 w-4" />
                <span>
                  Use "JSON Import" button or copy-paste into the form
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm text-center text-slate-500">
            Need help? Contact support at{" "}
            <a
              href="mailto:support@jobtracker.com"
              className="text-slate-700 font-medium"
            >
              support@jobtracker.com
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
