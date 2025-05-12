
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';

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
                <span className="font-medium">{matchData.tech_stack_match.score}%</span>
              </div>
              <Progress value={matchData.tech_stack_match.score} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Experience Match</span>
                <span className="font-medium">{matchData.experience_match.score}%</span>
              </div>
              <Progress value={matchData.experience_match.score} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Seniority Match</span>
                <span className="font-medium">{matchData.seniority_match.score}%</span>
              </div>
              <Progress value={matchData.seniority_match.score} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Industry Match</span>
                <span className="font-medium">{matchData.industry_match.score}%</span>
              </div>
              <Progress value={matchData.industry_match.score} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Project Match</span>
                <span className="font-medium">{matchData.project_match.score}%</span>
              </div>
              <Progress value={matchData.project_match.score} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Compensation</span>
                <span className="font-medium">{matchData.compensation_alignment.score}%</span>
              </div>
              <Progress value={matchData.compensation_alignment.score} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Location</span>
                <span className="font-medium">{matchData.location_compatibility.score}%</span>
              </div>
              <Progress value={matchData.location_compatibility.score} className="h-2" />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No detailed match data available</p>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
