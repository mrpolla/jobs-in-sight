
import React from 'react';
import { RequirementMatch } from '@/types/job';
import RequirementsAssessmentTooltip from '@/components/RequirementsAssessmentTooltip';

interface RequirementBarProps {
  requirementsMatch?: RequirementMatch[];
  renderBar: () => JSX.Element;
}

export default function RequirementBar({ requirementsMatch, renderBar }: RequirementBarProps) {
  if (!requirementsMatch || requirementsMatch.length === 0) {
    return <div>N/A</div>;
  }
  
  return (
    <RequirementsAssessmentTooltip requirementsMatch={requirementsMatch}>
      {renderBar()}
    </RequirementsAssessmentTooltip>
  );
}
