
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';
import { Job } from '@/types/job';

interface MatchScoreProps {
  score?: number;
  matchData?: Job['cv_match'];
  summary?: string;
}

export default function MatchScoreTooltip({ score, matchData, summary }: MatchScoreProps) {
  if (!score) return <span>N/A</span>;

  // Function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Helper functions to calculate scores from requirements_match
  const getTechStackScore = (matchData: Job['cv_match']) => {
    // Fallback to original structure if available
    if (matchData?.tech_stack_match?.score !== undefined) {
      return matchData.tech_stack_match.score;
    }
    
    // Calculate from requirements_match if available
    if (matchData?.requirements_match && matchData.requirements_match.length > 0) {
      // Simplified approach: average score of tech-related requirements
      const techRequirements = matchData.requirements_match.filter(req => 
        /tech|software|system|code|program|develop|api|framework|language/i.test(req.requirement)
      );
      
      if (techRequirements.length > 0) {
        return Math.round(
          techRequirements.reduce((sum, req) => sum + req.match_score, 0) / techRequirements.length
        );
      }
    }
    
    // Default fallback
    return 0;
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 cursor-help">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${getScoreColor(score)}`}>
            {score}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {summary && <p className="text-sm font-medium mb-2">{summary}</p>}
        
        {matchData ? (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Tech Stack Match</span>
                <span className="font-medium">{getTechStackScore(matchData)}%</span>
              </div>
              <Progress value={getTechStackScore(matchData)} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Experience Match</span>
                <span className="font-medium">{matchData.experience_match?.score || 0}%</span>
              </div>
              <Progress value={matchData.experience_match?.score || 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Seniority Match</span>
                <span className="font-medium">{matchData.seniority_match?.score || 0}%</span>
              </div>
              <Progress value={matchData.seniority_match?.score || 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Industry Match</span>
                <span className="font-medium">{matchData.industry_match?.score || 0}%</span>
              </div>
              <Progress value={matchData.industry_match?.score || 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Project Match</span>
                <span className="font-medium">{matchData.project_match?.score || 0}%</span>
              </div>
              <Progress value={matchData.project_match?.score || 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Compensation</span>
                <span className="font-medium">{matchData.compensation_alignment?.score || 0}%</span>
              </div>
              <Progress value={matchData.compensation_alignment?.score || 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Location</span>
                <span className="font-medium">{matchData.location_compatibility?.score || 0}%</span>
              </div>
              <Progress value={matchData.location_compatibility?.score || 0} className="h-2" />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No detailed match data available</p>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
