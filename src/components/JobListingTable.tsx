
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowDown, 
  ArrowUp, 
  X, 
  Filter, 
  Search, 
  ArrowDownUp, 
  Calendar,
  Globe,
  DollarSign,
  Code,
  FileCode2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { format, formatDistanceToNow } from 'date-fns';
import { JobStatus, Job, JobFilters, JobSort, SortField } from '@/types/job';
import JobStatusSelect from './JobStatusSelect';

interface JobListingTableProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onUpdateJobStatus: (job: Job, status: JobStatus) => void;
}

export default function JobListingTable({ jobs, onSelectJob, onUpdateJobStatus }: JobListingTableProps) {
  // Update the supported sort fields to include all the new columns
  const [sort, setSort] = useState<JobSort>({ field: 'last_updated', direction: 'desc' });
  const [filters, setFilters] = useState<JobFilters>({ status: 'All', priority: 'All', search: '' });
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [showAllColumns, setShowAllColumns] = useState(false);
  
  const handleSort = (field: SortField) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sort.field !== field) {
      return <ArrowDownUp className="h-4 w-4 text-muted-foreground" />;
    }
    return sort.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const getStatusClass = (status: JobStatus) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const getPriorityClass = (priority: number) => {
    return `priority-${priority}`;
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'High';
      case 2: return 'Medium';
      case 3: return 'Low';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: 'All', priority: 'All', search: '' });
  };

  const filteredJobs = jobs.filter(job => {
    // Status filter
    if (filters.status !== 'All' && job.status !== filters.status) {
      return false;
    }
    
    // Priority filter
    if (filters.priority !== 'All' && job.priority_level !== filters.priority) {
      return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        job.position.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        (job.location && job.location.toLowerCase().includes(searchTerm))
      );
    }
    
    return true;
  });
  
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let comparison = 0;
    
    switch (sort.field) {
      case 'position':
        comparison = a.position.localeCompare(b.position);
        break;
      case 'company':
        comparison = a.company.localeCompare(b.company);
        break;
      case 'location':
        comparison = (a.location || '').localeCompare(b.location || '');
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'priority_level':
        comparison = a.priority_level - b.priority_level;
        break;
      case 'tech_stack':
        const techA = (a.tech_stack || []).join(', ');
        const techB = (b.tech_stack || []).join(', ');
        comparison = techA.localeCompare(techB);
        break;
      case 'project_or_product':
        comparison = (a.project_or_product || '').localeCompare(b.project_or_product || '');
        break;
      case 'remote_policy':
        comparison = (a.remote_policy || '').localeCompare(b.remote_policy || '');
        break;
      case 'possible_salary':
        comparison = (a.possible_salary || '').localeCompare(b.possible_salary || '');
        break;
      case 'start_date':
        if (a.start_date && b.start_date) {
          comparison = new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        } else if (a.start_date) {
          comparison = -1;
        } else if (b.start_date) {
          comparison = 1;
        }
        break;
      case 'last_updated':
        comparison = (new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime());
        break;
      default:
        comparison = 0;
    }
    
    return sort.direction === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-9"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            {filters.search && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1 h-7 w-7" 
                onClick={() => handleFilterChange('search', '')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {(filters.status !== 'All' || filters.priority !== 'All') && (
                  <Badge variant="secondary" className="ml-2 px-1">
                    {(filters.status !== 'All' ? 1 : 0) + (filters.priority !== 'All' ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuGroup>
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Status</p>
                  <div className="grid grid-cols-2 gap-1">
                    {(['All', 'Applied', 'Interview', 'Rejected', 'Offer'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={filters.status === status ? 'default' : 'outline'}
                        size="sm"
                        className="w-full"
                        onClick={() => handleFilterChange('status', status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Priority</p>
                  <div className="grid grid-cols-2 gap-1">
                    {(['All', 1, 2, 3] as const).map((priority) => (
                      <Button
                        key={priority === 'All' ? 'all' : priority}
                        variant={filters.priority === priority ? 'default' : 'outline'}
                        size="sm"
                        className="w-full"
                        onClick={() => handleFilterChange('priority', priority)}
                      >
                        {priority === 'All' ? 'All' : (
                          priority === 1 ? 'High' : priority === 2 ? 'Medium' : 'Low'
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                disabled={filters.status === 'All' && filters.priority === 'All'}
                onSelect={clearFilters}
                className="justify-center"
              >
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAllColumns(prev => !prev)}
          >
            {showAllColumns ? "Show Less Columns" : "Show All Columns"}
          </Button>
        </div>
      </div>
      
      {sortedJobs.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <p className="text-lg font-medium">No jobs found</p>
          <p className="text-muted-foreground">Try adjusting your filters or upload some job data</p>
        </div>
      ) : (
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <Button 
                    variant="ghost" 
                    className="p-0 hover:bg-transparent font-medium" 
                    onClick={() => handleSort('position')}
                  >
                    Position {getSortIcon('position')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="p-0 hover:bg-transparent font-medium" 
                    onClick={() => handleSort('company')}
                  >
                    Company {getSortIcon('company')}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button 
                    variant="ghost" 
                    className="p-0 hover:bg-transparent font-medium" 
                    onClick={() => handleSort('location')}
                  >
                    Location {getSortIcon('location')}
                  </Button>
                </TableHead>
                <TableHead className="w-[120px]">
                  <Button 
                    variant="ghost" 
                    className="p-0 hover:bg-transparent font-medium" 
                    onClick={() => handleSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </Button>
                </TableHead>
                <TableHead className="w-[100px]">
                  <Button 
                    variant="ghost" 
                    className="p-0 hover:bg-transparent font-medium" 
                    onClick={() => handleSort('priority_level')}
                  >
                    Priority {getSortIcon('priority_level')}
                  </Button>
                </TableHead>
                
                {showAllColumns && (
                  <>
                    <TableHead className="hidden lg:table-cell">
                      <Button 
                        variant="ghost" 
                        className="p-0 hover:bg-transparent font-medium" 
                        onClick={() => handleSort('tech_stack')}
                      >
                        <Code className="h-4 w-4 mr-1" />
                        Tech Stack {getSortIcon('tech_stack')}
                      </Button>
                    </TableHead>
                    
                    <TableHead className="hidden xl:table-cell">
                      <Button 
                        variant="ghost" 
                        className="p-0 hover:bg-transparent font-medium" 
                        onClick={() => handleSort('project_or_product')}
                      >
                        <FileCode2 className="h-4 w-4 mr-1" />
                        Project/Product {getSortIcon('project_or_product')}
                      </Button>
                    </TableHead>
                    
                    <TableHead className="hidden lg:table-cell">
                      <Button 
                        variant="ghost" 
                        className="p-0 hover:bg-transparent font-medium" 
                        onClick={() => handleSort('remote_policy')}
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        Remote Policy {getSortIcon('remote_policy')}
                      </Button>
                    </TableHead>
                    
                    <TableHead className="hidden lg:table-cell">
                      <Button 
                        variant="ghost" 
                        className="p-0 hover:bg-transparent font-medium" 
                        onClick={() => handleSort('possible_salary')}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Salary {getSortIcon('possible_salary')}
                      </Button>
                    </TableHead>
                    
                    <TableHead className="hidden lg:table-cell">
                      <Button 
                        variant="ghost" 
                        className="p-0 hover:bg-transparent font-medium" 
                        onClick={() => handleSort('start_date')}
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
                    onClick={() => handleSort('last_updated')}
                  >
                    Last Updated {getSortIcon('last_updated')}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedJobs.map((job) => (
                <TableRow 
                  key={job.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onSelectJob(job)}
                >
                  <TableCell className="font-medium">{job.position}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell className="hidden md:table-cell">{job.location || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="max-w-[120px]">
                      <JobStatusSelect
                        value={job.status}
                        onChange={(status) => {
                          onUpdateJobStatus(job, status);
                          // Prevent row click when status is changed
                          event?.stopPropagation();
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityClass(job.priority_level)}>
                      {getPriorityLabel(job.priority_level)}
                    </Badge>
                  </TableCell>
                  
                  {showAllColumns && (
                    <>
                      <TableCell className="hidden lg:table-cell">
                        {job.tech_stack && job.tech_stack.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {job.tech_stack.slice(0, 3).map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">{tech}</Badge>
                            ))}
                            {job.tech_stack.length > 3 && (
                              <Badge variant="outline" className="text-xs">+{job.tech_stack.length - 3}</Badge>
                            )}
                          </div>
                        ) : 'N/A'}
                      </TableCell>
                      
                      <TableCell className="hidden xl:table-cell">
                        {job.project_or_product || 'N/A'}
                      </TableCell>
                      
                      <TableCell className="hidden lg:table-cell">
                        {job.remote_policy || 'N/A'}
                      </TableCell>
                      
                      <TableCell className="hidden lg:table-cell">
                        {job.possible_salary || 'N/A'}
                      </TableCell>
                      
                      <TableCell className="hidden lg:table-cell">
                        {job.start_date ? format(new Date(job.start_date), 'MMM d, yyyy') : 'N/A'}
                      </TableCell>
                    </>
                  )}
                  
                  <TableCell className="text-right">
                    <span title={format(new Date(job.last_updated), 'PPP')}>
                      {formatDate(job.last_updated)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
