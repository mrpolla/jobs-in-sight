
import { ExternalLink, Mail, Phone, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Job } from '@/types/job';

interface ApplicationMethodsProps {
  job: Job;
  variant?: 'row' | 'buttons';
  includeLabels?: boolean;
  size?: 'sm' | 'default';
}

export default function ApplicationMethods({ 
  job, 
  variant = 'row', 
  includeLabels = false,
  size = 'default' 
}: ApplicationMethodsProps) {
  // Extract data needed for application methods
  const jobUrl = job.url || '';
  const email = job.recruiter_contact?.email || '';
  const phone = job.recruiter_contact?.phone || '';
  
  // Generate email subject and body if email is available
  const emailSubject = `Application for ${job.position} position at ${job.company}`;
  
  // Generate email body with cover letter if available
  const emailBody = job.cover_letter 
    ? `Dear ${job.recruiter_contact?.name || 'Hiring Manager'},\n\n${job.cover_letter}`
    : '';
  
  const emailLink = `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const phoneLink = `tel:${phone}`;
  
  // Different styles based on variant
  const containerClass = variant === 'row' 
    ? 'flex items-center gap-1' 
    : 'flex flex-wrap gap-2';
    
  const buttonVariant = variant === 'row' ? 'ghost' : 'outline';
  const buttonSize = size === 'sm' ? 'sm' : 'default';
  const iconSize = size === 'sm' ? 16 : 20;
  
  return (
    <TooltipProvider>
      <div className={containerClass}>
        {/* Website button - always present */}
        {jobUrl && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={buttonVariant}
                size={buttonSize}
                className={variant === 'buttons' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900 dark:border-blue-800' : ''}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(jobUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                {variant === 'row' ? (
                  <Globe className="h-4 w-4" />
                ) : (
                  <>
                    <Globe size={iconSize} />
                    {includeLabels && <span>Apply on Website</span>}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Apply via Website</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {/* Email button - when recruiter email is available */}
        {email && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={buttonVariant}
                size={buttonSize}
                className={variant === 'buttons' ? 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900 dark:border-green-800' : ''}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(emailLink);
                }}
              >
                {variant === 'row' ? (
                  <Mail className="h-4 w-4" />
                ) : (
                  <>
                    <Mail size={iconSize} />
                    {includeLabels && <span>Email Recruiter</span>}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Email Recruiter</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {/* Phone button - when recruiter phone is available */}
        {phone && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={buttonVariant}
                size={buttonSize}
                className={variant === 'buttons' ? 'bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:hover:bg-purple-900 dark:border-purple-800' : ''}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(phoneLink);
                }}
              >
                {variant === 'row' ? (
                  <Phone className="h-4 w-4" />
                ) : (
                  <>
                    <Phone size={iconSize} />
                    {includeLabels && <span>Call Recruiter</span>}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Call Recruiter</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
