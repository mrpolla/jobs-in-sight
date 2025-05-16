import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Download,
  BookOpen,
  Code,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
} from "lucide-react";

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ open, onOpenChange }) => {
  const handleDownloadPrompt = () => {
    const promptText = `
# Prompt for ChatGPT: Comprehensive Job Listing Analysis with CV Match and Recruiter Information

I need you to extract detailed information from a job listing URL I'll provide and compare it against my CV that I've uploaded as a file in this ChatGPT project. Please analyze the job posting, research the company, look up relevant salary information, evaluate how well my CV matches the job requirements, identify all available recruiter contact information, extract relevant technologies and tools, and create a professional cover letter.

Beyond the basic analysis, I also need you to:
1. Create a compelling reasoning for why I should apply for this position based on my background and the job requirements
2. Identify specific examples from my CV that directly match what they're asking for
3. Assess EACH specific job requirement and categorize my ability to meet it as:
   - "Can do well" (direct experience/skills with the technology/tool/methodology)
   - "Can transfer" (have transferable skills/experience but limited direct experience)
   - "Must learn" (need to acquire this skill/experience)
4. For requirements in the "Can transfer" category, explain specifically which of my existing skills/experiences could be applied and why
5. Calculate a match score for each individual requirement and an overall match percentage using this scoring system:
   - "Can do well" = 70-100%
   - "Can transfer" = 40-70%
   - "Must learn" = 0-40%
6. Find and extract ALL available recruiter information, including:
   - Name of recruiter or HR contact person
   - Email address (direct or department)
   - Phone number
   - LinkedIn profile (if available)
   - Department/team
   - Any specific application instructions from the recruiter
   - Best contact method (if mentioned)
7. Write a professional cover letter that:
   - Aligns my experience with the job requirements in a compelling way
   - Uses a natural, professional tone (avoid overly corporate jargon or excessively formal language)
   - Demonstrates understanding of the company and its industry
   - Highlights 3-4 specific achievements from my CV that are relevant to this role
   - Explains why I'm interested in this position/company specifically
   - Keeps to a reasonable length (200-300 words)

EVALUATION GUIDELINES:
- Be fair but realistic in your evaluation of my CV against the job requirements
- For tech stack matches, consider both explicit mentions in my CV and closely related technologies
- For years of experience, count relevant experience in the field
- For domain knowledge, consider both explicit and implied understanding based on my work history
- For seniority match, consider a downward move very good (80-100%), lateral move good (60-80%), and upward move moderate (40-60%)
- Provide balanced feedback on my qualifications

Return all data in English in a clean JSON object that follows the schema below. If a field isn't available, include it with null or a reasonable default value.

## Instructions:
1. First, read my CV file attached in this ChatGPT project to understand my background
2. Process the URL I provide
3. Extract information available directly from the job listing (translate to English if necessary)
4. Research the company's website or reliable sources to fill in missing company information
5. Search for salary information on sites like Levels.fyi, Glassdoor, PayScale, or similar platforms for the position and company/location
6. Research company reputation on sites like Glassdoor, Indeed, or Comparably
7. Compare the job requirements against my CV to determine compatibility, analyzing tech stack match, experience match, seniority alignment, etc.
8. Look thoroughly for all recruiter contact details on the job listing page, company careers page, and application process pages
9. Write a professional cover letter tailored to this specific position and company
10. Format your response as a valid JSON object
11. For subjective fields (like job posting clarity), provide your best assessment
12. Do not include markdown formatting, additional explanations, or any text outside the JSON object
13. Ensure the JSON is properly formatted and valid
14. All text fields must be in English regardless of the original job posting language

## JSON Schema:
\`\`\`
{
  "url": "",
  "position": "",
  "project": "",
  "company": "",
  "job_description": "",
  "tech_stack": [],
  "requirements": "",
  "product": "",
  "job_type": "",
  "location": "",
  "remote_policy": "",
  "contract_duration": "",
  "hours_per_week": "",
  "vacation_days": "",
  "seniority_level": "",
  "start_date": "",
  "application_deadline": "",
  "languages_required": [],
  "industry": "",
  "company_info": "",
  "company_products": "",
  "company_size": "",
  "team_description": "",
  "recruiter_contact": {
    "name": "",
    "title": "",
    "email": "",
    "phone": "",
    "linkedin": "",
    "department": "",
    "preferred_contact_method": "",
    "application_instructions": ""
  },
  "possible_salary": "",
  "salary_estimate_from_context": "",
  "salary_from_external_sources": "",
  "benefits": "",
  "company_reputation": "",
  "job_posting_clarity_score": null,
  "priority_level": null,
  "status": "New",
  "applied_date": null,
  "interview_notes": "",
  "rating_match": null,
  "hidden": false,
  
  "cv_match": {
    "overall_match_percentage": null,
    "requirements_match": [
      {
        "requirement": "",
        "status": "",
        "explanation": "",
        "transferable_skills": [],
        "match_score": null
      }
    ],
    "experience_match": {
      "score": null,
      "years_required": null,
      "years_experience": null,
      "domain_match": "",
      "domain_overlap": [],
      "role_similarity": ""
    },
    "seniority_match": {
      "score": null,
      "alignment": "",
      "notes": ""
    },
    "industry_match": {
      "score": null,
      "familiarity": "",
      "transferable_experience": ""
    },
    "project_match": {
      "score": null,
      "similar_projects": [],
      "environment_similarity": ""
    },
    "compensation_alignment": {
      "score": null,
      "notes": ""
    },
    "location_compatibility": {
      "score": null,
      "notes": ""
    }
  },
  "match_summary": "",
  "match_score": null,
  "application_reasoning": {
    "why_apply": "",
    "key_matching_qualifications": [],
    "overall_fit_assessment": ""
  },
  "cover_letter": ""
}
\`\`\`

## Field Guidelines:
- \`url\`: The original job listing URL provided
- \`position\`: Job title as listed
- \`project\`: The main 1-2 tasks/responsibilities of the position
- \`company\`: Company name
- \`job_description\`: Concise summary of the role
- \`tech_stack\`: Array of technologies, tools, methodologies, and systems mentioned.
- \`requirements\`: Key qualifications needed
- \`product\`: The specific product being worked on (only set if there is a definite product mentioned in the description)
- \`job_type\`: Full-time, part-time, contract, etc.
- \`location\`: Office location
- \`remote_policy\`: Remote, hybrid, on-site
- \`contract_duration\`: Permanent, fixed term, etc.
- \`hours_per_week\`: Expected working hours per week
- \`vacation_days\`: Number of vacation days provided annually
- \`seniority_level\`: Junior, mid, senior
- \`start_date\`: Expected start date if mentioned
- \`application_deadline\`: Last date to apply if mentioned
- \`languages_required\`: Array of required languages
- \`industry\`: Company's industry
- \`company_info\`: Brief company description
- \`company_products\`: Main products/services
- \`company_size\`: Number of employees if available
- \`team_description\`: Information about the team
- \`recruiter_contact\`: Detailed information about the recruiting contact
  - \`name\`: Full name of the recruiter or HR contact (if available)
  - \`title\`: Job title of the recruiter (if available)
  - \`email\`: Direct email or department email for applications/inquiries
  - \`phone\`: Phone number for contact (if available)
  - \`linkedin\`: LinkedIn profile URL (if available)
  - \`department\`: HR or recruiting department name
  - \`preferred_contact_method\`: Email, phone, or application form (if specified)
  - \`application_instructions\`: Any specific instructions for applying
- \`possible_salary\`: Salary range if mentioned in the posting
- \`salary_estimate_from_context\`: Estimated salary based on role/location
- \`salary_from_external_sources\`: Salary information from Levels.fyi, Glassdoor, etc. Include source and range
- \`benefits\`: Perks and benefits listed
- \`company_reputation\`: Include ratings from sites like Glassdoor if available (e.g., "4.2/5 on Glassdoor, 3.8/5 on Indeed")
- \`job_posting_clarity_score\`: Rate from 1-5 how clear and detailed the posting is
- \`priority_level\`: Leave as null (to be filled by user)
- \`status\`: Default to "New"
- \`applied_date\`: Leave as null (to be filled by user)
- \`interview_notes\`: Leave empty (to be filled by user)
- \`rating_match\`: Leave as null (to be filled by user)
- \`hidden\`: Default to false
- \`cover_letter\`: A well-written, professional cover letter (300-400 words) tailored to the position and company. Use natural language rather than overly formal corporate speak.

### CV Match Fields:
- \`cv_match.overall_match_percentage\`: Overall match percentage (0-100)
- \`cv_match.requirements_match\`: Array of objects, each containing:
  - \`requirement\`: The specific job requirement being assessed
  - \`status\`: One of: "Can do well", "Can transfer", or "Must learn"
  - \`explanation\`: Explanation of why this status was assigned
  - \`transferable_skills\`: For "Can transfer" status, array of my skills that could be applied to this requirement and why
  - \`match_score\`: Score (0-100) for this specific requirement
- \`cv_match.experience_match.score\`: Score (0-100) for experience match
- \`cv_match.experience_match.years_required\`: Years of experience required
- \`cv_match.experience_match.years_experience\`: Years of relevant experience from CV
- \`cv_match.experience_match.domain_match\`: "Strong", "Moderate", "Limited", or "None"
- \`cv_match.experience_match.domain_overlap\`: Array of matching domains
- \`cv_match.experience_match.role_similarity\`: "High", "Medium", or "Low"
- \`cv_match.seniority_match.score\`: Score (0-100) for seniority alignment
- \`cv_match.seniority_match.alignment\`: "Upward", "Lateral", or "Downward"
- \`cv_match.seniority_match.notes\`: Brief explanation of seniority assessment
- \`cv_match.industry_match.score\`: Score (0-100) for industry alignment
- \`cv_match.industry_match.familiarity\`: "High", "Moderate", "Low", or "None"
- \`cv_match.industry_match.transferable_experience\`: Brief explanation of transferable experience
- \`cv_match.project_match.score\`: Score (0-100) for project/responsibilities match
- \`cv_match.project_match.similar_projects\`: Array of similar projects/responsibilities from CV
- \`cv_match.project_match.environment_similarity\`: "High", "Medium", or "Low"
- \`cv_match.compensation_alignment.score\`: Score (0-100) for salary match
- \`cv_match.compensation_alignment.notes\`: Brief assessment of compensation alignment
- \`cv_match.location_compatibility.score\`: Score (0-100) for location compatibility
- \`cv_match.location_compatibility.notes\`: Brief assessment of location preference match
- \`match_summary\`: 1-2 sentence overview of the match quality
- \`match_score\`: Overall match score (0-100)
- \`application_reasoning.why_apply\`: 2-3 paragraph compelling argument for why I should apply for this position
- \`application_reasoning.key_matching_qualifications\`: Array of specific qualifications from my CV that directly match job requirements
- \`application_reasoning.overall_fit_assessment\`: Overall assessment of my fit for the role (1-2 paragraphs)

## Research Guidelines:
When researching salary information, please check:
1. Levels.fyi for tech positions
2. Glassdoor salary information for the specific company and role
3. PayScale or Salary.com for general industry standards
4. Include currency and whether it's annual, monthly, or hourly

I've attached my CV as a file in this ChatGPT project. Please analyze it and compare it against the job requirements.
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
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto p-0">
        {/* Header with professional color */}
        <div className="bg-indigo-700 p-4 rounded-t-lg">
          <h2 className="text-xl font-bold text-white">Job Tracker</h2>

          {/* Compact Workflow with varied colors */}
          <div className="flex justify-between items-center mt-2 px-3 py-2 bg-indigo-800 rounded text-white text-xs">
            <div className="flex items-center gap-1">
              <Download size={14} className="text-yellow-300" />
              <span>1. Prompt</span>
            </div>
            <ArrowRight size={10} className="text-white/70" />
            <div className="flex items-center gap-1">
              <BookOpen size={14} className="text-green-300" />
              <span>2. Project</span>
            </div>
            <ArrowRight size={10} className="text-white/70" />
            <div className="flex items-center gap-1">
              <Code size={14} className="text-blue-300" />
              <span>3. URL</span>
            </div>
            <ArrowRight size={10} className="text-white/70" />
            <div className="flex items-center gap-1">
              <LayoutDashboard size={14} className="text-orange-300" />
              <span>4. Import</span>
            </div>
            <ArrowRight size={10} className="text-white/70" />
            <div className="flex items-center gap-1">
              <Sparkles size={14} className="text-purple-300" />
              <span>5. Insights</span>
            </div>
          </div>
        </div>

        {/* Main steps content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-indigo-800 mb-6">
            Quick Start Guide
          </h3>

          {/* Step 1 */}
          <div className="mb-6 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                1
              </div>
              <h4 className="text-lg font-semibold text-blue-700">
                Download Prompt Template
              </h4>
            </div>
            <div className="ml-11">
              <p className="text-slate-600 mb-3">
                Start by downloading our specialized prompt that tells AI
                exactly what to analyze
              </p>
              <Button
                onClick={handleDownloadPrompt}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Prompt
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-6 border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                2
              </div>
              <h4 className="text-lg font-semibold text-green-700">
                Set Up ChatGPT Project
              </h4>
            </div>
            <div className="ml-11">
              <p className="text-slate-600 mb-3">
                Create a new ChatGPT project (or use another LLM with file
                upload capabilities)
              </p>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-green-50 py-2 px-3 border-b border-green-100">
                    <span className="text-sm font-medium text-green-800">
                      Create a new project
                    </span>
                  </div>
                  <div className="p-4">
                    <img
                      src="/images/Step_2_1_add_project.png"
                      alt="Adding project"
                      className="rounded-lg border border-slate-200 w-full h-auto"
                    />
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-green-50 py-2 px-3 border-b border-green-100">
                    <span className="text-sm font-medium text-green-800">
                      Upload your CV
                    </span>
                  </div>
                  <div className="p-4">
                    <img
                      src="/images/Step_2_3_add_files.png"
                      alt="Select files to add"
                      className="rounded-lg border border-slate-200 w-full h-auto"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                <p className="font-medium">Pro Tip</p>
                <p className="text-xs">
                  Any ChatGPT, Claude, or Gemini project with file upload
                  capabilities will work great! You can customize the prompt but
                  keep the JSON structure intact for importing.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-6 border border-orange-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                3
              </div>
              <h4 className="text-lg font-semibold text-orange-700">
                Analyze Job Listing
              </h4>
            </div>
            <div className="ml-11">
              <p className="text-slate-600 mb-3">
                Simply paste any job URL into the chat and let AI do the heavy
                lifting
              </p>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-4">
                <div className="bg-orange-50 py-2 px-3 border-b border-orange-100">
                  <span className="text-sm font-medium text-orange-800">
                    Paste any job URL
                  </span>
                </div>
                <div className="p-4">
                  <img
                    src="/images/Step_3_paste_link.png"
                    alt="Paste link"
                    className="rounded-lg border border-slate-200 w-full h-auto max-w-md mx-auto"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-medium">What happens?</p>
                <p className="text-xs">
                  The AI will analyze the job, research the company, match
                  against your CV skills, find salary data, and create a custom
                  cover letter — all in one step!
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="mb-6 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                4
              </div>
              <h4 className="text-lg font-semibold text-purple-700">
                Import to Job Tracker
              </h4>
            </div>
            <div className="ml-11">
              <p className="text-slate-600 mb-3">
                Copy the JSON result and import it directly into Job Tracker
              </p>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-purple-50 py-2 px-3 border-b border-purple-100">
                    <span className="text-sm font-medium text-purple-800">
                      Copy JSON from AI response
                    </span>
                  </div>
                  <div className="p-4">
                    <img
                      src="/images/Step_4_1_copy_json.png"
                      alt="Copy JSON"
                      className="rounded-lg border border-slate-200 w-full h-auto"
                    />
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-purple-50 py-2 px-3 border-b border-purple-100">
                    <span className="text-sm font-medium text-purple-800">
                      Paste & Parse in Job Tracker
                    </span>
                  </div>
                  <div className="p-4">
                    <img
                      src="/images/Step_4_3_paste_json.png"
                      alt="Paste JSON"
                      className="rounded-lg border border-slate-200 w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="mb-6 border border-teal-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                5
              </div>
              <h4 className="text-lg font-semibold text-teal-700">
                Explore Your Job Match
              </h4>
            </div>
            <div className="ml-11">
              <p className="text-slate-600 mb-3">
                See detailed insights about how well you match the job and get a
                ready-to-use cover letter
              </p>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-4">
                <div className="bg-teal-50 py-2 px-3 border-b border-teal-100">
                  <span className="text-sm font-medium text-teal-800">
                    Comprehensive insights
                  </span>
                </div>
                <div className="p-4 bg-slate-50">
                  <img
                    src="/images/Step_5_result.png"
                    alt="See results"
                    className="rounded-lg border border-slate-200 w-full h-auto max-w-2xl mx-auto shadow-md"
                  />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                <p className="font-medium mb-2">What you get:</p>
                <ul className="list-disc pl-5 text-xs space-y-1">
                  <li>Detailed job match score and analysis</li>
                  <li>Skill-by-skill evaluation of your qualifications</li>
                  <li>Customized cover letter ready to send</li>
                  <li>Comprehensive company information</li>
                  <li>Salary estimates from multiple sources</li>
                  <li>Direct recruiter contact information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-6 rounded-b-lg border-t border-slate-200 text-center">
          <p className="font-medium text-slate-800 mb-2">
            Ready to streamline your job search?
          </p>
          <p className="text-sm text-slate-600 mb-4">
            Start by downloading the prompt and analyzing your first job listing
          </p>
          <Button
            onClick={handleDownloadPrompt}
            className="bg-slate-800 hover:bg-slate-700 text-white px-6"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Prompt & Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
