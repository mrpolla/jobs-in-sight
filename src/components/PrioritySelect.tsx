
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface PrioritySelectProps {
  value: number;
  onChange: (priority: number) => void;
  disabled?: boolean;
}

const priorities = [
  { value: 1, label: 'High', className: 'bg-red-500 hover:bg-red-600 text-white' },
  { value: 2, label: 'Medium', className: 'bg-amber-500 hover:bg-amber-600 text-white' },
  { value: 3, label: 'Low', className: 'bg-green-500 hover:bg-green-600 text-white' }
];

export default function PrioritySelect({ value, onChange, disabled = false }: PrioritySelectProps) {
  const selectedPriority = priorities.find(p => p.value === value) || priorities[2];
  
  const handleValueChange = (val: string) => {
    const numericValue = parseInt(val, 10);
    onChange(numericValue);
  };
  
  return (
    <Select 
      value={value.toString()} 
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          <Badge className={selectedPriority.className}>
            {selectedPriority.label}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" className="bg-popover">
        {priorities.map((priority) => (
          <SelectItem key={priority.value} value={priority.value.toString()}>
            <Badge className={priority.className}>
              {priority.label}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
