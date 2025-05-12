
import { Job } from '@/types/job';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsSummaryProps {
  jobs: Job[];
}

export default function StatsSummary({ jobs }: StatsSummaryProps) {
  const totalJobs = jobs.length;
  const applied = jobs.filter(job => job.status === 'Applied').length;
  const interviews = jobs.filter(job => job.status === 'Interview').length;
  const rejected = jobs.filter(job => job.status === 'Rejected').length;
  const offers = jobs.filter(job => job.status === 'Offer').length;
  const highPriority = jobs.filter(job => job.priority_level === 1).length;
  
  const stats = [
    { label: 'Total Jobs', value: totalJobs, className: 'bg-gray-100 dark:bg-gray-800' },
    { label: 'Applied', value: applied, className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    { label: 'Interviews', value: interviews, className: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' },
    { label: 'Rejected', value: rejected, className: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
    { label: 'Offers', value: offers, className: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    { label: 'High Priority', value: highPriority, className: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className={stat.className}>
          <CardHeader className="pb-1 pt-4">
            <CardTitle className="text-xl">{stat.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
