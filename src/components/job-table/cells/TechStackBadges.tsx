
import React from 'react';
import { Badge } from '@/components/ui/badge';
import TechStackTooltip from '@/components/TechStackTooltip';

interface TechStackBadgesProps {
  techStack?: string[];
  matchedSkills: string[];
}

export default function TechStackBadges({ techStack, matchedSkills }: TechStackBadgesProps) {
  if (!techStack || techStack.length === 0) {
    return <span>N/A</span>;
  }
  
  return (
    <TechStackTooltip 
      techStack={techStack}
      matchedSkills={matchedSkills}
    >
      <div className="flex flex-wrap gap-1">
        {techStack.slice(0, 3).map((tech, index) => {
          const isMatched = matchedSkills.includes(tech);
          return (
            <Badge 
              key={index} 
              variant="outline" 
              className={`text-xs ${isMatched ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800' : ''}`}
            >
              {tech}
            </Badge>
          );
        })}
        {techStack.length > 3 && (
          <Badge variant="outline" className="text-xs">+{techStack.length - 3}</Badge>
        )}
      </div>
    </TechStackTooltip>
  );
}
