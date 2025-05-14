
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Progress } from '@/components/ui/progress';
import { Job, RequirementMatch } from '@/types/job';
import { Badge } from './ui/badge';

interface RequirementsAssessmentTooltipProps {
  requirementsMatch?: RequirementMatch[];
  children: React.ReactNode;
}

export default function RequirementsAssessmentTooltip({ 
  requirementsMatch, 
  children 
}: RequirementsAssessmentTooltipProps) {
  if (!requirementsMatch || requirementsMatch.length === 0) {
    return <span>{children}</span>;
  }

  // Group requirements by status
  const canDoWell = requirementsMatch.filter(req => req.status === 'Can do well');
  const canTransfer = requirementsMatch.filter(req => req.status === 'Can transfer');
  const mustLearn = requirementsMatch.filter(req => req.status === 'Must learn');

  // Calculate average scores for each category
  const getAverageScore = (reqs: RequirementMatch[]) => 
    reqs.length > 0 
      ? Math.round(reqs.reduce((sum, req) => sum + req.match_score, 0) / reqs.length)
      : 0;

  const wellScore = getAverageScore(canDoWell);
  const transferScore = getAverageScore(canTransfer);
  const learnScore = getAverageScore(mustLearn);

  // For the visual bar, we'll show the proportion of requirements in each category
  const total = requirementsMatch.length;
  const wellPercentage = (canDoWell.length / total) * 100;
  const transferPercentage = (canTransfer.length / total) * 100;
  const learnPercentage = (mustLearn.length / total) * 100;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-help">
          {children}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Requirements Assessment</h4>
          
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
          
          <div className="grid gap-3">
            {canDoWell.length > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Can do well ({canDoWell.length})</span>
                  </div>
                  <span className="font-medium">{wellScore}%</span>
                </div>
                <ul className="text-xs text-muted-foreground pl-5 list-disc">
                  {canDoWell.slice(0, 3).map((req, i) => (
                    <li key={i} className="truncate" title={req.requirement}>
                      {req.requirement}
                    </li>
                  ))}
                  {canDoWell.length > 3 && (
                    <li className="italic">+{canDoWell.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}
            
            {canTransfer.length > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                    <span>Can transfer ({canTransfer.length})</span>
                  </div>
                  <span className="font-medium">{transferScore}%</span>
                </div>
                <ul className="text-xs text-muted-foreground pl-5 list-disc">
                  {canTransfer.slice(0, 3).map((req, i) => (
                    <li key={i} className="truncate" title={req.requirement}>
                      {req.requirement}
                    </li>
                  ))}
                  {canTransfer.length > 3 && (
                    <li className="italic">+{canTransfer.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}
            
            {mustLearn.length > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Must learn ({mustLearn.length})</span>
                  </div>
                  <span className="font-medium">{learnScore}%</span>
                </div>
                <ul className="text-xs text-muted-foreground pl-5 list-disc">
                  {mustLearn.slice(0, 3).map((req, i) => (
                    <li key={i} className="truncate" title={req.requirement}>
                      {req.requirement}
                    </li>
                  ))}
                  {mustLearn.length > 3 && (
                    <li className="italic">+{mustLearn.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
