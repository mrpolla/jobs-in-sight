
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MatchScoreIndicatorProps {
  score?: number;
}

export default function MatchScoreIndicator({ score }: MatchScoreIndicatorProps) {
  return (
    <div className="flex justify-center">
      {score ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white 
              ${score >= 80 ? 'bg-green-500' : 
                score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
            >
              {score}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Overall match score</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <span>N/A</span>
      )}
    </div>
  );
}
