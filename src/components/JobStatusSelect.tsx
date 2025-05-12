
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobStatus } from '@/types/job';

interface JobStatusSelectProps {
  value: JobStatus;
  onChange: (status: JobStatus) => void;
  disabled?: boolean;
}

const statuses: { value: JobStatus; label: string; className: string }[] = [
  { value: 'New', label: 'New', className: 'status-badge status-new' },
  { value: 'Applied', label: 'Applied', className: 'status-badge status-applied' },
  { value: 'Interview', label: 'Interview', className: 'status-badge status-interview' },
  { value: 'Rejected', label: 'Rejected', className: 'status-badge status-rejected' },
  { value: 'Offer', label: 'Offer', className: 'status-badge status-offer' }
];

export default function JobStatusSelect({ value, onChange, disabled = false }: JobStatusSelectProps) {
  return (
    <Select 
      value={value} 
      onValueChange={(val) => onChange(val as JobStatus)}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue>
          <div className={`status-badge status-${value.toLowerCase()}`}>
            {value}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            <div className={status.className}>
              {status.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
