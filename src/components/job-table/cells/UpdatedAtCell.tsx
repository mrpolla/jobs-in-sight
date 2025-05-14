
import React from 'react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TableCell } from '@/components/ui/table';

interface UpdatedAtCellProps {
  lastUpdated: string;
  formatDate: (dateString: string) => string;
}

export default function UpdatedAtCell({ lastUpdated, formatDate }: UpdatedAtCellProps) {
  return (
    <TableCell className="text-right">
      <Tooltip>
        <TooltipTrigger className="block">
          <span>{formatDate(lastUpdated)}</span>
        </TooltipTrigger>
        <TooltipContent>
          {format(new Date(lastUpdated), 'PPP')}
        </TooltipContent>
      </Tooltip>
    </TableCell>
  );
}
