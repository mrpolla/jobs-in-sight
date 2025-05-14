
import React from 'react';
import { Job } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink, Eye, EyeOff, Trash } from 'lucide-react';

interface JobRowActionsProps {
  job: Job;
  onDelete: (job: Job, event: React.MouseEvent) => void;
  onToggleHidden: (job: Job, event: React.MouseEvent) => void;
  onOpenUrl: (job: Job, event: React.MouseEvent) => void;
}

export default function JobRowActions({ job, onDelete, onToggleHidden, onOpenUrl }: JobRowActionsProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      {job.url && (
        <ExternalLinkAction job={job} onOpenUrl={onOpenUrl} />
      )}
      
      <VisibilityAction job={job} onToggleHidden={onToggleHidden} />
      
      <DeleteAction job={job} onDelete={onDelete} />
    </div>
  );
}

function ExternalLinkAction({ job, onOpenUrl }: { job: Job, onOpenUrl: (job: Job, event: React.MouseEvent) => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 hover:bg-muted"
          onClick={(e) => onOpenUrl(job, e)}
          aria-label="Open job URL"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Open job listing
      </TooltipContent>
    </Tooltip>
  );
}

function VisibilityAction({ job, onToggleHidden }: { job: Job, onToggleHidden: (job: Job, event: React.MouseEvent) => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 hover:bg-muted"
          onClick={(e) => onToggleHidden(job, e)}
          aria-label={job.hidden ? "Show job" : "Hide job"}
        >
          {job.hidden ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {job.hidden ? "Show job" : "Hide job"}
      </TooltipContent>
    </Tooltip>
  );
}

function DeleteAction({ job, onDelete }: { job: Job, onDelete: (job: Job, event: React.MouseEvent) => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={(e) => onDelete(job, e)}
          aria-label="Delete job"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Delete job
      </TooltipContent>
    </Tooltip>
  );
}
