
import { Job } from '@/types/job';
import { Card, CardContent } from '@/components/ui/card';
import { ChartPie, Briefcase, FileCheck, XCircle, Award, Star } from 'lucide-react';

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
    { label: 'Total Jobs', value: totalJobs, icon: ChartPie, className: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200' },
    { label: 'Applied', value: applied, icon: Briefcase, className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    { label: 'Interviews', value: interviews, icon: FileCheck, className: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' },
    { label: 'Rejected', value: rejected, icon: XCircle, className: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
    { label: 'Offers', value: offers, icon: Award, className: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    { label: 'High Priority', value: highPriority, icon: Star, className: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {stats.map((stat) => (
        <Card key={stat.label} className={`${stat.className} rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 w-[120px]`}>
          <CardContent className="flex flex-col items-center justify-center py-3 px-2">
            <stat.icon className="h-5 w-5 mb-1" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs font-medium text-center">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
