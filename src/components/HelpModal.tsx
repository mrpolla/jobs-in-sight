
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Download, BookOpen, Code, LayoutDashboard, Info } from 'lucide-react';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("getting-started");

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
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-[#7E69AB] to-[#9b87f5] p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-3 rounded-full">
                <HelpCircle size={24} className="text-[#7E69AB]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Job Tracker Assistant</h2>
                <p className="text-white/80">Optimize your job search with AI-powered analysis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="bg-[#F1F0FB] p-6 border-b">
          <h3 className="text-lg font-semibold mb-3 text-[#1A1F2C]">⚡ Quick Start</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-[#D6BCFA] p-2 rounded-full mb-2">
                <BookOpen size={20} className="text-[#7E69AB]" />
              </div>
              <p className="font-medium">Upload your CV to ChatGPT</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-[#D6BCFA] p-2 rounded-full mb-2">
                <Code size={20} className="text-[#7E69AB]" />
              </div>
              <p className="font-medium">Analyze job URL with our prompt</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-[#D6BCFA] p-2 rounded-full mb-2">
                <LayoutDashboard size={20} className="text-[#7E69AB]" />
              </div>
              <p className="font-medium">Import JSON to Job Tracker</p>
            </div>
          </div>
        </div>

        {/* Visual workflow diagram */}
        <div className="p-6">
          <div className="mb-6 bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 text-center">Workflow</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
              <div className="text-center p-3">
                <div className="bg-[#1EAEDB] text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">1</div>
                <p className="text-sm font-medium">Set up ChatGPT</p>
              </div>
              <div className="hidden md:block">
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.0607 13.0607C39.6464 12.4749 39.6464 11.5251 39.0607 10.9393L29.5147 1.3934C28.9289 0.807611 27.9792 0.807611 27.3934 1.3934C26.8076 1.97919 26.8076 2.92893 27.3934 3.51472L35.8787 12L27.3934 20.4853C26.8076 21.0711 26.8076 22.0208 27.3934 22.6066C27.9792 23.1924 28.9289 23.1924 29.5147 22.6066L39.0607 13.0607ZM0 13.5H38V10.5H0V13.5Z" fill="#1EAEDB"/>
                </svg>
              </div>
              <div className="text-center p-3">
                <div className="bg-[#1EAEDB] text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">2</div>
                <p className="text-sm font-medium">Analyze Job Listing</p>
              </div>
              <div className="hidden md:block">
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.0607 13.0607C39.6464 12.4749 39.6464 11.5251 39.0607 10.9393L29.5147 1.3934C28.9289 0.807611 27.9792 0.807611 27.3934 1.3934C26.8076 1.97919 26.8076 2.92893 27.3934 3.51472L35.8787 12L27.3934 20.4853C26.8076 21.0711 26.8076 22.0208 27.3934 22.6066C27.9792 23.1924 28.9289 23.1924 29.5147 22.6066L39.0607 13.0607ZM0 13.5H38V10.5H0V13.5Z" fill="#1EAEDB"/>
                </svg>
              </div>
              <div className="text-center p-3">
                <div className="bg-[#1EAEDB] text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">3</div>
                <p className="text-sm font-medium">Import to Job Tracker</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed interface */}
        <div className="p-6 pt-0">
          <Tabs
            defaultValue="getting-started"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="getting-started">
                <BookOpen className="mr-2 h-4 w-4" />
                Getting Started
              </TabsTrigger>
              <TabsTrigger value="features">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Features
              </TabsTrigger>
              <TabsTrigger value="about">
                <Info className="mr-2 h-4 w-4" />
                About
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="getting-started" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Step-by-Step Guide</h3>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="step1">
                    <AccordionTrigger className="py-3 font-medium">
                      <span className="flex items-center">
                        <div className="bg-[#9b87f5] text-white w-6 h-6 rounded-full flex items-center justify-center mr-3">1</div>
                        Set Up Your ChatGPT Project
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-12">
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>Create a new project in ChatGPT</li>
                        <li>Upload your CV as a file to the project</li>
                        <li>Upload the job analysis prompt (available for download below)</li>
                      </ol>
                      <div className="mt-4">
                        <img 
                          src="https://placehold.co/600x150/e9e3ff/7E69AB?text=ChatGPT+Project+Setup&font=montserrat" 
                          alt="ChatGPT Project Setup" 
                          className="rounded-lg w-full"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="step2">
                    <AccordionTrigger className="py-3 font-medium">
                      <span className="flex items-center">
                        <div className="bg-[#9b87f5] text-white w-6 h-6 rounded-full flex items-center justify-center mr-3">2</div>
                        Analyze a Job Listing
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-12">
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>Find a job listing you're interested in</li>
                        <li>Copy the URL of the job listing</li>
                        <li>In your ChatGPT project, paste the URL and send it to ChatGPT</li>
                        <li>ChatGPT will analyze the listing and return a JSON response</li>
                        <li>Copy the entire JSON response</li>
                      </ol>
                      <div className="mt-4">
                        <img 
                          src="https://placehold.co/600x150/e9e3ff/7E69AB?text=ChatGPT+Analysis&font=montserrat" 
                          alt="ChatGPT Analysis" 
                          className="rounded-lg w-full"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="step3">
                    <AccordionTrigger className="py-3 font-medium">
                      <span className="flex items-center">
                        <div className="bg-[#9b87f5] text-white w-6 h-6 rounded-full flex items-center justify-center mr-3">3</div>
                        Import to Job Tracker
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-12">
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>In Job Tracker, click the "Add Job" or "JSON Paste" button</li>
                        <li>Paste the JSON from ChatGPT</li>
                        <li>Your job will be added with all analysis data</li>
                      </ol>
                      <div className="mt-4">
                        <img 
                          src="https://placehold.co/600x150/e9e3ff/7E69AB?text=Import+to+Job+Tracker&font=montserrat" 
                          alt="Import to Job Tracker" 
                          className="rounded-lg w-full"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                {/* Example Workflow */}
                <div className="mt-8 border-2 border-[#9b87f5] rounded-lg p-5 bg-[#F1F0FB]">
                  <h3 className="text-lg font-semibold mb-3 text-[#7E69AB]">Example Workflow</h3>
                  <ol className="list-decimal list-inside pl-4 space-y-2">
                    <li>Create a ChatGPT project and upload your CV</li>
                    <li>Use the prompt below with a job URL like: "Please analyze this job listing: https://example.com/job/123"</li>
                    <li>ChatGPT will return a JSON analysis that you can import to Job Tracker</li>
                    <li>Track your application status, add notes, and manage your job search</li>
                  </ol>
                </div>
                
                {/* Prompt Download Button */}
                <div className="mt-8 flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-4 text-center">Download the ChatGPT Prompt</h3>
                  <Button 
                    onClick={handleDownloadPrompt}
                    className="bg-gradient-to-r from-[#7E69AB] to-[#9b87f5] hover:opacity-90 text-white px-8 py-6 rounded-lg shadow-lg transition-all"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Prompt Template
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">Click to download the prompt you'll use with ChatGPT</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">What Information is Retrieved</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-[#7E69AB] mb-2">Basic Job Details</h4>
                    <p className="text-sm">Position, company, location, job type, etc. (directly from listing)</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-[#7E69AB] mb-2">Technical Details</h4>
                    <p className="text-sm">Tech stack, required skills, seniority level (extracted from listing)</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-[#7E69AB] mb-2">Company Information</h4>
                    <p className="text-sm">Industry, company size, reputation (researched by AI)</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-[#7E69AB] mb-2">Salary Information</h4>
                    <p className="text-sm">Listed salary or estimates from external sources (if available)</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">What the AI Analyzes</h3>
                <div className="bg-white rounded-lg border">
                  <ul className="divide-y">
                    <li className="p-4">
                      <h4 className="font-medium text-[#7E69AB]">CV Match Score</h4>
                      <p className="text-sm">Overall percentage match between your CV and job requirements</p>
                    </li>
                    <li className="p-4">
                      <h4 className="font-medium text-[#7E69AB]">Requirements Assessment</h4>
                      <p className="text-sm">Each requirement categorized as "Can do well," "Can transfer," or "Must learn"</p>
                    </li>
                    <li className="p-4">
                      <h4 className="font-medium text-[#7E69AB]">Experience Match</h4>
                      <p className="text-sm">Analysis of your years of experience and domain overlap</p>
                    </li>
                    <li className="p-4">
                      <h4 className="font-medium text-[#7E69AB]">Seniority Alignment</h4>
                      <p className="text-sm">Whether the position is lateral, upward, or downward move</p>
                    </li>
                    <li className="p-4">
                      <h4 className="font-medium text-[#7E69AB]">Application Reasoning</h4>
                      <p className="text-sm">Personalized reasons why you should apply based on your CV</p>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="about" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">About Job Tracker</h3>
                <p className="mb-4">Job Tracker is designed to help you organize and analyze job opportunities using AI technology. By leveraging ChatGPT's ability to extract and analyze job listings, you can make more informed decisions about which positions to pursue.</p>
                
                <h4 className="font-semibold mt-6 mb-2">How it works</h4>
                <p className="mb-4">The application uses a specialized prompt that instructs ChatGPT to analyze job listings against your CV and provide structured data about the job and your fit for it. This data is then imported into Job Tracker where you can organize, prioritize, and track your applications.</p>
                
                <h4 className="font-semibold mt-6 mb-2">Example ChatGPT Prompt</h4>
                <div className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                  <pre className="whitespace-pre-wrap">
                    You are a career advisor and job application specialist. I want you to analyze job listings for me 
                    and compare them with my CV to help me understand if I'm a good fit.
                    
                    When I provide you with a job listing URL or text, please analyze it and return a JSON response...
                  </pre>
                </div>
                
                <div className="mt-8 text-center">
                  <Button 
                    onClick={handleDownloadPrompt}
                    className="bg-gradient-to-r from-[#7E69AB] to-[#9b87f5] hover:opacity-90 text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Full Prompt
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
