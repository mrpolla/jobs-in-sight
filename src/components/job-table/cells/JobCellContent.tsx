
import React from 'react';
import { format } from 'date-fns';
import { Job } from '@/types/job';
import ProjectTooltip from '@/components/ProjectTooltip';
import CompanyInfoTooltip from '@/components/CompanyInfoTooltip';

// Factory pattern for all cell content types
const JobCellContent = {
  Position: ({ position }: { position: string }) => {
    return <>{position}</>;
  },
  
  Project: ({ project, job }: { project?: string, job: Job }) => {
    if (!project) return <span>N/A</span>;
    
    return (
      <ProjectTooltip job={job}>
        {project}
      </ProjectTooltip>
    );
  },
  
  Company: ({ 
    company, 
    companyInfo,
    industry,
    companySize,
    companyReputation,
    companyProducts
  }: { 
    company: string,
    companyInfo?: string,
    industry?: string,
    companySize?: string,
    companyReputation?: string,
    companyProducts?: string[] | string
  }) => {
    return (
      <CompanyInfoTooltip
        company={company}
        companyInfo={companyInfo}
        industry={industry}
        companySize={companySize}
        companyReputation={companyReputation}
        companyProducts={typeof companyProducts === 'string' ? companyProducts : companyProducts}
      >
        {company}
      </CompanyInfoTooltip>
    );
  },
  
  Industry: ({ industry }: { industry?: string }) => {
    return <>{industry || 'N/A'}</>;
  },
  
  Location: ({ location }: { location?: string }) => {
    return <>{location || 'N/A'}</>;
  },
  
  RemotePolicy: ({ policy }: { policy?: string }) => {
    return <>{policy || 'N/A'}</>;
  },
  
  Hours: ({ hours }: { hours?: number | string }) => {
    return <>{hours ? `${hours}h` : 'N/A'}</>;
  },
  
  Vacation: ({ days }: { days?: number | string }) => {
    return <>{days ? `${days} days` : 'N/A'}</>;
  },
  
  Salary: ({ salary }: { salary?: string }) => {
    return <>{salary || 'N/A'}</>;
  },
  
  StartDate: ({ date }: { date?: string }) => {
    return <>{date ? format(new Date(date), 'MMM d, yyyy') : 'N/A'}</>;
  }
};

export default JobCellContent;
