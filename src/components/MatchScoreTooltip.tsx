
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';
import { Job } from '@/types/job';
import { Badge } from './ui/badge';

interface MatchScoreProps {
  score?: number;
  matchData?: Job['cv_match'];
  summary?: string;
  requirements?: Job['cv_match']['requirements_match'];
}

export default function MatchScoreTooltip({ score, matchData, summary, requirements }: MatchScoreProps) {
  if (!score) return <span>N/A</span>;

  // Function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Helper function to calculate tech stack score from requirements_match
  const getTechStackScore = (matchData: Job['cv_match']) => {
    // Calculate from requirements_match if available
    if (matchData?.requirements_match && matchData.requirements_match.length > 0) {
      // Find tech-related requirements
      const techRequirements = matchData.requirements_match.filter(req => 
        /tech|software|system|code|program|develop|api|framework|language|SAP/i.test(req.requirement)
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

  // Function to count requirements by status
  const getStatusCounts = (requirements?: Job['cv_match']['requirements_match']) => {
    if (!requirements || requirements.length === 0) return null;
    
    return requirements.reduce(
      (acc, req) => {
        if (req.status === "Can do well") acc.canDo++;
        else if (req.status === "Can transfer") acc.canTransfer++;
        else if (req.status === "Must learn") acc.mustLearn++;
        return acc;
      },
      { canDo: 0, canTransfer: 0, mustLearn: 0 }
    );
  };
  
  const statusCounts = getStatusCounts(requirements);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 cursor-help">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${getScoreColor(score)}`}>
            {score}
          </div>
          
          {statusCounts && (
            <div className="flex gap-1 items-center">
              {statusCounts.canDo > 0 && (
                <Badge variant="outline" className="bg-green-100 border-green-500 text-green-800 text-xs">
                  {statusCounts.canDo} ✓
                </Badge>
              )}
              {statusCounts.canTransfer > 0 && (
                <Badge variant="outline" className="bg-amber-100 border-amber-500 text-amber-800 text-xs">
                  {statusCounts.canTransfer} ≈
                </Badge>
              )}
              {statusCounts.mustLearn > 0 && (
                <Badge variant="outline" className="bg-red-100 border-red-500 text-red-800 text-xs">
                  {statusCounts.mustLearn} ✕
                </Badge>
              )}
            </div>
          )}
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
            
            {requirements && requirements.length > 0 && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs font-medium mb-1">Requirements Match</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {requirements.map((req, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          req.status === "Can do well" ? "bg-green-500" : 
                          req.status === "Can transfer" ? "bg-amber-500" : 
                          "bg-red-500"
                        }`}></div>
                        <span className="font-medium">{req.requirement}</span>
                        <span className="ml-auto">{req.match_score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No detailed match data available</p>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
