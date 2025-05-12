
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

interface TechStackTooltipProps {
  techStack: string[];
  matchedSkills?: string[];
  children: React.ReactNode;
}

export default function TechStackTooltip({ techStack, matchedSkills = [], children }: TechStackTooltipProps) {
  if (!techStack || techStack.length === 0) {
    return <>{children}</>;
  }
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-help">{children}</div>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <h4 className="text-sm font-medium mb-2">Tech Stack</h4>
        <div className="flex flex-wrap gap-1">
          {techStack.map((tech) => {
            const isMatched = matchedSkills.includes(tech);
            return (
              <Badge 
                key={tech} 
                variant={isMatched ? "default" : "outline"}
                className={isMatched ? "bg-green-600" : ""}
              >
                {tech}
                {isMatched && " ✓"}
              </Badge>
            );
          })}
        </div>
        {matchedSkills.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            ✓ indicates skills matching your CV
          </p>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
