
import React, { useState } from 'react';
import { RequirementAssessment } from '@/types/job';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RequirementsAssessmentProps {
  requirements: RequirementAssessment[];
  compact?: boolean;
}

export default function RequirementsAssessment({ requirements, compact = false }: RequirementsAssessmentProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  const toggleExpand = (index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Can do well':
        return 'bg-green-500 text-white';
      case 'Can transfer':
        return 'bg-amber-500 text-white';
      case 'Must learn':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (requirements.length === 0) {
    return null;
  }

  if (compact) {
    // Display compact summary of requirements
    const counts = requirements.reduce((acc, req) => {
      const status = req.status as keyof typeof acc;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = requirements.length;

    return (
      <div className="flex gap-1 items-center mt-1">
        {counts['Can do well'] && (
          <Badge variant="outline" className="bg-green-100 border-green-500 text-green-800 text-xs">
            {counts['Can do well']} can do
          </Badge>
        )}
        {counts['Can transfer'] && (
          <Badge variant="outline" className="bg-amber-100 border-amber-500 text-amber-800 text-xs">
            {counts['Can transfer']} transferable
          </Badge>
        )}
        {counts['Must learn'] && (
          <Badge variant="outline" className="bg-red-100 border-red-500 text-red-800 text-xs">
            {counts['Must learn']} to learn
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-3">
      <h6 className="text-xs font-medium">Requirements Assessment</h6>
      {requirements.map((req, index) => (
        <div key={index} className="text-xs border-l-2 pl-2 py-0.5" style={{ borderLeftColor: req.status === 'Can do well' ? 'rgb(34, 197, 94)' : req.status === 'Can transfer' ? 'rgb(245, 158, 11)' : 'rgb(239, 68, 68)' }}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-medium">{req.requirement}</div>
              <Badge className={`text-xs mt-0.5 ${getStatusColor(req.status)}`}>
                {req.status}
              </Badge>
              <div className="mt-1">{req.explanation}</div>
            </div>
            {req.transferable_skills.length > 0 && (
              <button
                onClick={() => toggleExpand(index)}
                className="text-xs flex items-center text-blue-500 hover:text-blue-700"
              >
                {expandedItems[index] ? (
                  <>Less <ChevronUp className="h-3 w-3 ml-1" /></>
                ) : (
                  <>More <ChevronDown className="h-3 w-3 ml-1" /></>
                )}
              </button>
            )}
          </div>

          {req.transferable_skills.length > 0 && expandedItems[index] && (
            <div className="mt-2 pl-2 border-l border-dashed border-gray-300">
              <div className="font-medium mb-1">Transferable Skills:</div>
              <ul className="list-disc list-inside space-y-0.5">
                {req.transferable_skills.map((skill, skillIndex) => (
                  <li key={skillIndex}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
