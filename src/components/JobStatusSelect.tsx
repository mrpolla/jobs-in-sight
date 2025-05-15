
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobStatus } from '@/types/job';

interface JobStatusSelectProps {
  value: JobStatus;
  onChange: (status: JobStatus) => void;
  disabled?: boolean;
}

const statuses: { value: JobStatus; label: string; className: string }[] = [
  { value: 'New', label: 'New', className: 'bg-blue-500 hover:bg-blue-600 text-white' },
  { value: 'Applied', label: 'Applied', className: 'bg-purple-500 hover:bg-purple-600 text-white' },
  { value: 'Interview', label: 'Interview', className: 'bg-amber-500 hover:bg-amber-600 text-white' },
  { value: 'Rejected', label: 'Rejected', className: 'bg-red-500 hover:bg-red-600 text-white' },
  { value: 'Offer', label: 'Offer', className: 'bg-green-500 hover:bg-green-600 text-white' }
];

export default function JobStatusSelect({ value, onChange, disabled = false }: JobStatusSelectProps) {
  const selectedStatus = statuses.find(s => s.value === value) || statuses[0];
  
  return (
    <Select 
      value={value} 
      onValueChange={(val) => onChange(val as JobStatus)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          <div className={selectedStatus.className + " px-2 py-1 rounded text-sm font-medium"}>
            {selectedStatus.label}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" className="bg-popover">
        {statuses.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            <div className={status.className + " px-2 py-1 rounded text-sm font-medium"}>
              {status.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
