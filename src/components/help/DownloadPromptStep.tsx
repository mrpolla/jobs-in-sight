
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const DownloadPromptStep = () => {
  const handleDownloadPrompt = () => {
    const promptText = `
# Prompt for ChatGPT: Job Listing Information Extraction with CV Match Analysis

I need you to extract detailed information from a job listing URL I'll provide and compare it against my CV that I've uploaded as a file in this ChatGPT project. Please analyze the job posting, research the company, look up relevant salary information, and evaluate how well my CV matches the job requirements. 

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
3. Research the company's website or reliable sources to fill in missing company information
4. Search for salary information on sites like Levels.fyi, Glassdoor, PayScale, or similar platforms for the position and company/location
5. Research company reputation on sites like Glassdoor, Indeed, or Comparably
6. Compare the job requirements against my CV to determine compatibility, analyzing tech stack match, experience match, seniority alignment, etc.
7. Format your response as a valid JSON object
8. For subjective fields (like job posting clarity), provide your best assessment
9. Do not include markdown formatting, additional explanations, or any text outside the JSON object
10. Ensure the JSON is properly formatted and valid
11. All text fields must be in English regardless of the original job posting language

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
  "recruiter_contact": "",
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
  }
}
\`\`\`

## Field Guidelines:
- \`url\`: The original job listing URL provided
- \`position\`: Job title as listed
- \`project\`: The main 1-2 tasks/responsibilities of the position
- \`company\`: Company name
- \`job_description\`: Concise summary of the role
- \`tech_stack\`: Array of technologies mentioned
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
- \`recruiter_contact\`: Contact information if available
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
    <div>
      <Button
        onClick={handleDownloadPrompt}
        className="bg-slate-800 hover:bg-slate-700 text-white mb-4"
        size="sm"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Prompt
      </Button>
      <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 p-2 rounded mb-4">
        <Download className="h-4 w-4" />
        <span>CV can be in Word, TXT, or PDF format</span>
      </div>
    </div>
  );
};
