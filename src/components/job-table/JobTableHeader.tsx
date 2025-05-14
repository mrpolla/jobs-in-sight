
import { Button } from '@/components/ui/button';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SortField, JobSort } from '@/types/job';
import { 
  ArrowDown, 
  ArrowUp, 
  ArrowDownUp, 
  Calendar, 
  Globe, 
  DollarSign, 
  Code, 
  Star,
  Building,
  Clock,
  PalmtreeIcon,
  CheckSquare
} from 'lucide-react';

interface JobTableHeaderProps {
  sort: JobSort;
  showAllColumns: boolean;
  onSort: (field: SortField) => void;
}

export default function JobTableHeader({ sort, showAllColumns, onSort }: JobTableHeaderProps) {
  const getSortIcon = (field: SortField) => {
    if (sort.field !== field) {
      return <ArrowDownUp className="h-4 w-4 text-muted-foreground" />;
    }
    return sort.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[200px]">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent font-medium" 
            onClick={() => onSort('position')}
          >
            Position {getSortIcon('position')}
          </Button>
        </TableHead>
        
        <TableHead>
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent font-medium" 
            onClick={() => onSort('project')}
          >
            Project {getSortIcon('project')}
          </Button>
        </TableHead>
        
        <TableHead>
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent font-medium" 
            onClick={() => onSort('company')}
          >
            Company {getSortIcon('company')}
          </Button>
        </TableHead>
        
        <TableHead className="hidden md:table-cell">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent font-medium" 
            onClick={() => onSort('industry')}
          >
            <Building className="h-4 w-4 mr-1" />
            Industry {getSortIcon('industry')}
          </Button>
        </TableHead>
        
        <TableHead className="hidden md:table-cell">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent font-medium" 
            onClick={() => onSort('location')}
          >
            Location {getSortIcon('location')}
          </Button>
        </TableHead>
        
        <TableHead className="hidden md:table-cell">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent font-medium" 
            onClick={() => onSort('remote_policy')}
          >
            <Globe className="h-4 w-4 mr-1" />
            Remote {getSortIcon('remote_policy')}
          </Button>
        </TableHead>
        
        <TableHead className="hidden lg:table-cell">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent font-medium" 
            onClick={() => onSort('hours_per_week')}
          >
            <Clock className="h-4 w-4 mr-1" />
            Hours {getSortIcon('hours_per_week')}
          </Button>
        </TableHead>
        
        <TableHead className="hidden lg:table-cell">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent font-medium" 
            onClick={() => onSort('vacation_days')}
          >
            <PalmtreeIcon className="h-4 w-4 mr-1" />
            Vacation {getSortIcon('vacation_days')}
          </Button>
        </TableHead>
        
        <TableHead className="w-[120px]">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent font-medium" 
            onClick={() => onSort('status')}
          >
            Status {getSortIcon('status')}
          </Button>
        </TableHead>
        
        <TableHead className="w-[100px]">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent font-medium" 
            onClick={() => onSort('priority_level')}
          >
            Priority {getSortIcon('priority_level')}
          </Button>
        </TableHead>
        
        <TableHead className="w-[130px]">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent font-medium" 
          >
            <CheckSquare className="h-4 w-4 mr-1" />
            Requirements
          </Button>
        </TableHead>
        
        <TableHead className="w-[80px]">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent font-medium" 
            onClick={() => onSort('match_score')}
          >
            <Star className="h-4 w-4 mr-1" />
            Match {getSortIcon('match_score')}
          </Button>
        </TableHead>
        
        {showAllColumns && (
          <>
            <TableHead className="hidden lg:table-cell">
              <Button 
                variant="ghost" 
                className="p-0 hover:bg-transparent font-medium" 
                onClick={() => onSort('tech_stack')}
              >
                <Code className="h-4 w-4 mr-1" />
                Tech Stack {getSortIcon('tech_stack')}
              </Button>
            </TableHead>
            
            <TableHead className="hidden lg:table-cell">
              <Button 
                variant="ghost" 
                className="p-0 hover:bg-transparent font-medium" 
                onClick={() => onSort('possible_salary')}
              >
                <DollarSign className="h-4 w-4 mr-1" />
                Salary {getSortIcon('possible_salary')}
              </Button>
            </TableHead>
            
            <TableHead className="hidden lg:table-cell">
              <Button 
                variant="ghost" 
                className="p-0 hover:bg-transparent font-medium" 
                onClick={() => onSort('start_date')}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Start Date {getSortIcon('start_date')}
              </Button>
            </TableHead>
          </>
        )}
        
        <TableHead className="w-[150px] text-right">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent font-medium" 
            onClick={() => onSort('last_updated')}
          >
            Last Updated {getSortIcon('last_updated')}
          </Button>
        </TableHead>
        
        <TableHead className="w-[100px] text-center">
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
