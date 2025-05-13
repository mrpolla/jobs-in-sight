
import React, { useMemo } from 'react';
import { RequirementMatch } from '@/types/job';

interface RequirementsMatchStatsProps {
  requirements: RequirementMatch[];
}

export default function RequirementsMatchStats({ requirements }: RequirementsMatchStatsProps) {
  const stats = useMemo(() => {
    const counts = {
      'Can do well': 0,
      'Can transfer': 0,
      'Must learn': 0
    };

    requirements.forEach(req => {
      if (req.status in counts) {
        counts[req.status as keyof typeof counts]++;
      }
    });

    const total = requirements.length;
    
    return {
      counts,
      total,
      percentages: {
        'Can do well': total ? Math.round((counts['Can do well'] / total) * 100) : 0,
        'Can transfer': total ? Math.round((counts['Can transfer'] / total) * 100) : 0,
        'Must learn': total ? Math.round((counts['Must learn'] / total) * 100) : 0
      }
    };
  }, [requirements]);

  if (!requirements.length) {
    return null;
  }

  return (
    <div className="inline-flex items-center h-3 w-24 rounded-full overflow-hidden bg-gray-200">
      {stats.percentages['Can do well'] > 0 && (
        <div 
          className="h-full bg-green-500" 
          style={{ width: `${stats.percentages['Can do well']}%` }} 
          title={`Can do well: ${stats.counts['Can do well']} (${stats.percentages['Can do well']}%)`}
        />
      )}
      {stats.percentages['Can transfer'] > 0 && (
        <div 
          className="h-full bg-amber-500" 
          style={{ width: `${stats.percentages['Can transfer']}%` }} 
          title={`Can transfer: ${stats.counts['Can transfer']} (${stats.percentages['Can transfer']}%)`}
        />
      )}
      {stats.percentages['Must learn'] > 0 && (
        <div 
          className="h-full bg-red-500" 
          style={{ width: `${stats.percentages['Must learn']}%` }} 
          title={`Must learn: ${stats.counts['Must learn']} (${stats.percentages['Must learn']}%)`}
        />
      )}
    </div>
  );
}
