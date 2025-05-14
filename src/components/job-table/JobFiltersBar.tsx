
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JobFilters } from '@/types/job';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Filter, 
  Search, 
  X, 
  FileCode2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface JobFiltersBarProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  onClearFilters: () => void;
  onToggleShowAllColumns: () => void;
  onExportExcel: () => void;
  showAllColumns: boolean;
}

export default function JobFiltersBar({
  filters,
  onFilterChange,
  onClearFilters,
  onToggleShowAllColumns,
  onExportExcel,
  showAllColumns
}: JobFiltersBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="flex-1 w-full md:max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-9"
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
          {filters.search && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1 h-7 w-7" 
              onClick={() => onFilterChange('search', '')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
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
                  {(['All', 'New', 'Applied', 'Interview', 'Rejected', 'Offer'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={filters.status === status ? 'default' : 'outline'}
                      size="sm"
                      className="w-full"
                      onClick={() => onFilterChange('status', status)}
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
                      onClick={() => onFilterChange('priority', priority)}
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
            
            <div className="p-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Show Hidden Jobs</span>
                <Switch 
                  checked={!filters.hideHidden} 
                  onCheckedChange={(checked) => onFilterChange('hideHidden', !checked)}
                />
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              disabled={filters.status === 'All' && filters.priority === 'All'}
              onSelect={onClearFilters}
              className="justify-center"
            >
              Clear Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleShowAllColumns}
        >
          {showAllColumns ? "Show Less Columns" : "Show All Columns"}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onExportExcel}
        >
          <FileCode2 className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
