
import { Job, RequirementMatch } from "@/types/job";

export const getStatusClass = (status: string) => {
  return `status-badge status-${status.toLowerCase()}`;
};

export const getPriorityClass = (priority: number) => {
  return `priority-${priority}`;
};

export const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 1: return 'High';
    case 2: return 'Medium';
    case 3: return 'Low';
    default: return 'Unknown';
  }
};

export const formatDateRelative = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  } catch (error) {
    return dateString;
  }
};

export const getMatchedSkills = (job: Job): string[] => {
  if (!job.cv_match?.requirements_match) {
    return [];
  }
  
  const wellMatchedRequirements = job.cv_match.requirements_match.filter(req => 
    req.status === "Can do well"
  );
  
  return wellMatchedRequirements.map(req => extractSkillName(req.requirement));
};

export const isTechRequirement = (text: string): boolean => {
  const techTerms = ["javascript", "typescript", "react", "node", "java", "python", 
                    "c#", ".net", "angular", "vue", "aws", "azure", "cloud", "api", 
                    "frontend", "backend", "fullstack", "database", "sql", "nosql", 
                    "docker", "kubernetes", "devops", "ci/cd", "testing", "agile", 
                    "scrum", "git", "sap"];
  
  const lowercaseText = text.toLowerCase();
  return techTerms.some(term => lowercaseText.includes(term));
};

export const extractSkillName = (text: string): string => {
  const match = text.match(/\b(javascript|typescript|react|node|java|python|c#|\.net|angular|vue|aws|azure|sql|sap)\b/i);
  if (match) return match[0];
  
  const simplifiedMatch = text.match(/^(.*?)(experience|knowledge|understanding|proficiency|skills)/i);
  return simplifiedMatch ? simplifiedMatch[1].trim() : text.split(' ').slice(0, 3).join(' ');
};

export const renderRequirementsBar = (job: Job) => {
  if (!job.cv_match?.requirements_match || job.cv_match.requirements_match.length === 0) {
    return <div>N/A</div>;
  }
  
  const requirementsMatch = job.cv_match.requirements_match;
  
  // Ensure we're working with number type
  const totalCount = requirementsMatch.length;
  
  // Count each category and ensure they're numbers
  const canDoWellCount = requirementsMatch.filter(req => req.status === 'Can do well').length;
  const canTransferCount = requirementsMatch.filter(req => req.status === 'Can transfer').length;
  const mustLearnCount = requirementsMatch.filter(req => req.status === 'Must learn').length;
  
  // Calculate percentages with explicit number types
  const wellPercentage: number = totalCount > 0 ? (Number(canDoWellCount) / Number(totalCount)) * 100 : 0;
  const transferPercentage: number = totalCount > 0 ? (Number(canTransferCount) / Number(totalCount)) * 100 : 0;
  const learnPercentage: number = totalCount > 0 ? (Number(mustLearnCount) / Number(totalCount)) * 100 : 0;
  
  return (
    <div className="w-full">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        <div 
          className="bg-green-500" 
          style={{ width: `${wellPercentage}%` }}
        />
        <div 
          className="bg-amber-500" 
          style={{ width: `${transferPercentage}%` }}
        />
        <div 
          className="bg-red-500" 
          style={{ width: `${learnPercentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span>{canDoWellCount}</span>
        <span>{canTransferCount}</span>
        <span>{mustLearnCount}</span>
      </div>
    </div>
  );
};
