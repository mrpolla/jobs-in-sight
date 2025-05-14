
export default function NoJobsFound() {
  return (
    <div className="text-center py-8 space-y-2">
      <p className="text-lg font-medium">No jobs found</p>
      <p className="text-muted-foreground">Try adjusting your filters or upload some job data</p>
    </div>
  );
}
