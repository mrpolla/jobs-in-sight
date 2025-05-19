import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
  FileCode2,
  Trash,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { format, formatDistanceToNow, isValid } from "date-fns";
import { JobStatus, Job, JobFilters, JobSort, SortField } from "@/types/job";
import JobStatusSelect from "./JobStatusSelect";
import PrioritySelect from "./PrioritySelect";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import TechStackTooltip from "./TechStackTooltip";
import CompanyInfoTooltip from "./CompanyInfoTooltip";
import MatchScoreTooltip from "./MatchScoreTooltip";
import ProjectTooltip from "./ProjectTooltip";
import { Switch } from "./ui/switch";
import SalaryDisplay from "./SalaryDisplay";
import ApplicationMethods from "./ApplicationMethods";
import { ScrollArea } from "./ui/scroll-area";

interface JobListingTableProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onUpdateJobStatus: (job: Job, status: JobStatus) => void;
  onDeleteJob: (jobId: string) => void;
  onToggleHidden: (job: Job, hidden: boolean) => void;
  onUpdateJobPriority?: (job: Job, priority: number) => void;
}

export default function JobListingTable({
  jobs,
  onSelectJob,
  onUpdateJobStatus,
  onDeleteJob,
  onToggleHidden,
  onUpdateJobPriority = () => {},
}: JobListingTableProps) {
  // Update the supported sort fields to include all the new columns
  const [sort, setSort] = useState<JobSort>({
    field: "last_updated",
    direction: "desc",
  });
  const [filters, setFilters] = useState<JobFilters>({
    status: "All",
    priority: "All",
    search: "",
    hideHidden: true,
  });
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [showAllColumns, setShowAllColumns] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const handleSort = (field: SortField) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sort.field !== field) {
      return <ArrowDownUp className="h-4 w-4 text-muted-foreground" />;
    }
    return sort.direction === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const getStatusClass = (status: JobStatus) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const getPriorityClass = (priority: number) => {
    return `priority-${priority}`;
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return "High";
      case 2:
        return "Medium";
      case 3:
        return "Low";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Check if the date is valid before formatting
      if (!isValid(date)) {
        return "Invalid date";
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "All",
      priority: "All",
      search: "",
      hideHidden: filters.hideHidden,
    });
  };

  const handleDelete = (job: Job, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click event
    setJobToDelete(job);
  };

  const handleToggleHidden = (job: Job, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click event
    onToggleHidden(job, !job.hidden);
  };

  const handleStatusChange = (job: Job, status: JobStatus) => {
    // Only use event.stopPropagation if event exists (from direct button clicks)
    onUpdateJobStatus(job, status);
  };

  const handlePriorityChange = (job: Job, priority: number) => {
    // Only use event.stopPropagation if event exists (from direct button clicks)
    onUpdateJobPriority(job, priority);
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      onDeleteJob(jobToDelete.id);
      setJobToDelete(null);
    }
  };

  const cancelDelete = () => {
    setJobToDelete(null);
  };

  // Open URL in a new tab
  const openJobUrl = (job: Job, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click event
    if (job.url) {
      window.open(job.url, "_blank", "noopener,noreferrer");
    }
  };

  // Filter jobs based on current filters
  const filteredJobs = jobs.filter((job) => {
    // First check if we should hide hidden jobs
    if (filters.hideHidden && job.hidden) {
      return false;
    }

    // Status filter
    if (filters.status !== "All" && job.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority !== "All" && job.priority_level !== filters.priority) {
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

  // Sort the filtered jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case "position":
        comparison = a.position.localeCompare(b.position);
        break;
      case "company":
        comparison = a.company.localeCompare(b.company);
        break;
      case "location":
        comparison = (a.location || "").localeCompare(b.location || "");
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "tech_stack":
        const techA = (a.tech_stack || []).join(", ");
        const techB = (b.tech_stack || []).join(", ");
        comparison = techA.localeCompare(techB);
        break;
      case "project":
        comparison = (a.project || "").localeCompare(b.project || "");
        break;
      case "industry":
        comparison = (a.industry || "").localeCompare(b.industry || "");
        break;
      case "remote_policy":
        comparison = (a.remote_policy || "").localeCompare(
          b.remote_policy || ""
        );
        break;
      case "possible_salary":
        const salaryA =
          a.possible_salary ||
          a.salary_from_external_sources ||
          a.salary_estimate_from_context ||
          "";
        const salaryB =
          b.possible_salary ||
          b.salary_from_external_sources ||
          b.salary_estimate_from_context ||
          "";
        comparison = salaryA.localeCompare(salaryB);
        break;
      case "start_date":
        if (a.start_date && b.start_date) {
          try {
            const dateA = new Date(a.start_date);
            const dateB = new Date(b.start_date);
            
            // Check if both dates are valid
            if (isValid(dateA) && isValid(dateB)) {
              comparison = dateA.getTime() - dateB.getTime();
            } else {
              // Handle invalid dates
              comparison = a.start_date.localeCompare(b.start_date);
            }
          } catch (error) {
            console.error("Error comparing dates:", error);
            comparison = 0;
          }
        } else if (a.start_date) {
          comparison = -1;
        } else if (b.start_date) {
          comparison = 1;
        }
        break;
      case "priority_level":
        comparison = a.priority_level - b.priority_level;
        break;
      case "match_score":
        const scoreA = a.match_score || a.cv_match?.overall_match_percentage || 0;
        const scoreB = b.match_score || b.cv_match?.overall_match_percentage || 0;
        comparison = scoreA - scoreB;
        break;
      case "last_updated":
        try {
          const dateA = new Date(a.last_updated);
          const dateB = new Date(b.last_updated);
          
          // Check if both dates are valid
          if (isValid(dateA) && isValid(dateB)) {
            comparison = dateB.getTime() - dateA.getTime();
          } else {
            // Handle invalid dates
            comparison = 0;
          }
        } catch (error) {
          console.error("Error comparing last_updated dates:", error);
          comparison = 0;
        }
        break;
      default:
        comparison = 0;
    }

    return sort.direction === "asc" ? comparison : -comparison;
  });

  // Helper function to extract a skill name from requirement text
  const extractSkillName = (text: string): string => {
    // Simple approach - extract key technologies or first few meaningful words
    const match = text.match(
      /\b(javascript|typescript|react|node|java|python|c#|\.net|angular|vue|aws|azure|sql|sap)\b/i
    );
    if (match) return match[0];

    // If no direct tech match, take first part of the requirement
    const simplifiedMatch = text.match(
      /^(.*?)(experience|knowledge|understanding|proficiency|skills)/i
    );
    return simplifiedMatch
      ? simplifiedMatch[1].trim()
      : text.split(" ").slice(0, 3).join(" ");
  };

  const handleExportExcel = async () => {
    // This is a placeholder for Excel export functionality
    // In a real implementation, we'd use a library like xlsx
    // For now, we'll just download a CSV file

    const headers = [
      "Position",
      "Project",
      "Company",
      "Industry",
      "Location",
      "Status",
      "Priority",
      "Tech Stack",
      "Remote Policy",
      "Salary",
      "Start Date",
      "Match Score",
      "Last Updated",
      "URL",
    ];

    const rows = sortedJobs.map((job) => [
      job.position,
      job.project || "",
      job.company,
      job.industry || "",
      job.location || "",
      job.status,
      getPriorityLabel(job.priority_level),
      (job.tech_stack || []).join(", "),
      job.remote_policy || "",
      job.possible_salary || "",
      job.start_date || "",
      job.match_score || job.cv_match?.overall_match_percentage || "N/A",
      job.last_updated,
      job.url || "",
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `job-listings-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-9"
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7"
                onClick={() => handleFilterChange("search", "")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full md:w-auto"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    {(filters.status !== "All" ||
                      filters.priority !== "All") && (
                      <Badge variant="secondary" className="ml-2 px-1">
                        {(filters.status !== "All" ? 1 : 0) +
                          (filters.priority !== "All" ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuGroup>
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Status</p>
                      <div className="grid grid-cols-2 gap-1">
                        {(
                          [
                            "All",
                            "New",
                            "Applied",
                            "Interview",
                            "Rejected",
                            "Offer",
                          ] as const
                        ).map((status) => (
                          <Button
                            key={status}
                            variant={
                              filters.status === status ? "default" : "outline"
                            }
                            size="sm"
                            className="w-full"
                            onClick={() => handleFilterChange("status", status)}
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
                        {(["All", 1, 2, 3] as const).map((priority) => (
                          <Button
                            key={priority === "All" ? "all" : priority}
                            variant={
                              filters.priority === priority
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="w-full"
                            onClick={() =>
                              handleFilterChange("priority", priority)
                            }
                          >
                            {priority === "All"
                              ? "All"
                              : priority === 1
                              ? "High"
                              : priority === 2
                              ? "Medium"
                              : "Low"}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <div className="p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Show Hidden Jobs
                      </span>
                      <Switch
                        checked={!filters.hideHidden}
                        onCheckedChange={(checked) =>
                          handleFilterChange("hideHidden", !checked)
                        }
                      />
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    disabled={
                      filters.status === "All" && filters.priority === "All"
                    }
                    onSelect={clearFilters}
                    className="justify-center"
                  >
                    Clear Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>Filter jobs by status and priority</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllColumns((prev) => !prev)}
              >
                {showAllColumns ? "Show Less Columns" : "Show All Columns"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {showAllColumns
                ? "Hide additional columns"
                : "Show additional details columns"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <FileCode2 className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export job data to CSV file</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <TooltipProvider>
        {sortedJobs.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <p className="text-lg font-medium">No jobs found</p>
            <p className="text-muted-foreground">
              Try adjusting your filters or upload some job data
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="table-container">
              <div className="table-scroll-wrapper">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">
                        <Button
                          variant="ghost"
                          className="p-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort("position")}
                        >
                          Position {getSortIcon("position")}
                        </Button>
                      </TableHead>

                      {/* Project Column */}
                      <TableHead className="w-[140px]">
                        <Button
                          variant="ghost"
                          className="p-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort("project")}
                        >
                          Project {getSortIcon("project")}
                        </Button>
                      </TableHead>

                      <TableHead className="w-[160px]">
                        <Button
                          variant="ghost"
                          className="p-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort("company")}
                        >
                          Company {getSortIcon("company")}
                        </Button>
                      </TableHead>

                      {/* Industry Column */}
                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="p-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort("industry")}
                        >
                          <Building className="h-4 w-4 mr-1" />
                          Industry {getSortIcon("industry")}
                        </Button>
                      </TableHead>

                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="p-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort("location")}
                        >
                          Location {getSortIcon("location")}
                        </Button>
                      </TableHead>

                      <TableHead className="hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="p-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort("remote_policy")}
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          Remote Policy {getSortIcon("remote_policy")}
                        </Button>
                      </TableHead>

                      <TableHead className="w-[120px]">
                        <Button
                          variant="ghost"
                          className="p-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort("status")}
                        >
                          Status {getSortIcon("status")}
                        </Button>
                      </TableHead>

                      <TableHead className="w-[100px]">
                        <Button
                          variant="ghost"
                          className="p-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort("priority_level")}
                        >
                          Priority {getSortIcon("priority_level")}
                        </Button>
                      </TableHead>

                      {/* Match Score Column */}
                      <TableHead className="w-[120px]">
                        <Button
                          variant="ghost"
                          className="p-0 hover:bg-transparent font-medium"
                          onClick={() => handleSort("match_score")}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Match {getSortIcon("match_score")}
                        </Button>
                      </TableHead>

                      {showAllColumns && (
                        <>
                          <TableHead className="hidden lg:table-cell">
                            <Button
                              variant="ghost"
                              className="p-0 hover:bg-transparent font-medium"
                              onClick={() => handleSort("tech_stack")}
                            >
                              <Code className="h-4 w-4 mr-1" />
                              Tech Stack {getSortIcon("tech_stack")}
                            </Button>
                          </TableHead>

                          <TableHead className="hidden lg:table-cell">
                            <Button
                              variant="ghost"
                              className="p-0 hover:bg-transparent font-medium"
                              onClick={() => handleSort("possible_salary")}
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Salary {getSortIcon("possible_salary")}
                            </Button>
                          </TableHead>

                          <TableHead className="hidden lg:table-cell">
                            <Button
                              variant="ghost"
                              className="p-0 hover:bg-transparent font-medium"
                              onClick={() => handleSort("start_date")}
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Start Date {getSortIcon("start_date")}
                            </Button>
                          </TableHead>

                          <TableHead className="hidden lg:table-cell">
                            <Button
                              variant="ghost"
                              className="p-0 hover:bg-transparent font-medium"
                              onClick={() => handleSort("last_updated")}
                            >
                              Last Updated {getSortIcon("last_updated")}
                            </Button>
                          </TableHead>
                        </>
                      )}

                      <TableHead className="text-center w-[130px]">
                        <span className="flex items-center justify-center">
                          <Button
                            variant="ghost"
                            className="p-0 hover:bg-transparent font-medium cursor-default"
                          >
                            Apply Now
                          </Button>
                        </span>
                      </TableHead>

                      <TableHead className="w-[100px] text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedJobs.map((job) => (
                      <TableRow
                        key={job.id}
                        className={`cursor-pointer hover:bg-muted/50 ${
                          job.hidden ? "opacity-60" : ""
                        }`}
                        onClick={() => onSelectJob(job)}
                      >
                        <TableCell className="font-medium">
                          {job.position}
                        </TableCell>

                        {/* Project Cell - No longer shows requirements match */}
                        <TableCell>
                          {job.project ? (
                            <ProjectTooltip job={job}>{job.project}</ProjectTooltip>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>

                        <TableCell>
                          <CompanyInfoTooltip
                            company={job.company}
                            companyInfo={job.company_info}
                            industry={job.industry}
                            companySize={job.company_size}
                            companyReputation={job.company_reputation}
                            companyProducts={job.company_products}
                          >
                            {job.company}
                          </CompanyInfoTooltip>
                        </TableCell>

                        {/* Industry Cell */}
                        <TableCell className="hidden md:table-cell">
                          {job.industry || "N/A"}
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          {job.location || "N/A"}
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          {job.remote_policy || "N/A"}
                        </TableCell>

                        <TableCell>
                          <div className="max-w-[120px]">
                            <JobStatusSelect
                              value={job.status}
                              onChange={(status) => handleStatusChange(job, status)}
                            />
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="max-w-[120px]">
                            <PrioritySelect
                              value={job.priority_level || 3}
                              onChange={(priority) =>
                                handlePriorityChange(job, priority)
                              }
                            />
                          </div>
                        </TableCell>

                        {/* Match Score Cell - Enhanced with requirements match display */}
                        <TableCell>
                          <MatchScoreTooltip
                            score={
                              job.match_score ||
                              job.cv_match?.overall_match_percentage
                            }
                            matchData={job.cv_match}
                            summary={job.match_summary}
                            requirements={job.cv_match?.requirements_match}
                          />
                        </TableCell>

                        {showAllColumns && (
                          <>
                            <TableCell className="hidden lg:table-cell">
                              {job.tech_stack && job.tech_stack.length > 0 ? (
                                <TechStackTooltip techStack={job.tech_stack}>
                                  <div className="flex flex-wrap gap-1">
                                    {job.tech_stack
                                      .slice(0, 3)
                                      .map((tech, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {tech}
                                        </Badge>
                                      ))}
                                    {job.tech_stack.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{job.tech_stack.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </TechStackTooltip>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>

                            <TableCell className="hidden lg:table-cell">
                              <SalaryDisplay job={job} showTooltip={true} />
                            </TableCell>

                            <TableCell className="hidden lg:table-cell">
                              {job.start_date && isValid(new Date(job.start_date))
                                ? format(new Date(job.start_date), "MMM d, yyyy")
                                : "N/A"}
                            </TableCell>

                            <TableCell className="hidden lg:table-cell">
                              <Tooltip>
                                <TooltipTrigger className="block">
                                  <span>
                                    {isValid(new Date(job.last_updated))
                                      ? formatDate(job.last_updated)
                                      : "Invalid date"}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {isValid(new Date(job.last_updated))
                                    ? format(new Date(job.last_updated), "PPP")
                                    : "Invalid date"}
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                          </>
                        )}

                        {/* Apply Cell with icons */}
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-left justify-left">
                            <ApplicationMethods
                              job={job}
                              variant="buttons"
                              size="sm"
                            />
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            {job.url && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-muted"
                                    onClick={(e) => openJobUrl(job, e)}
                                    aria-label="Open job URL"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Open job listing</TooltipContent>
                              </Tooltip>
                            )}

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-muted"
                                  onClick={(e) => handleToggleHidden(job, e)}
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

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  onClick={(e) => handleDelete(job, e)}
                                  aria-label="Delete job"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete job</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </TooltipProvider>

      <DeleteConfirmationDialog
        isOpen={!!jobToDelete}
        jobTitle={
          jobToDelete ? `${jobToDelete.position} at ${jobToDelete.company}` : ""
        }
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
