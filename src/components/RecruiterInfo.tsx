
import { useState } from 'react';
import { RecruiterContact } from '@/types/job';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Linkedin, Copy, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface RecruiterInfoProps {
  recruiterContact: RecruiterContact | string | undefined;
}

export default function RecruiterInfo({ recruiterContact }: RecruiterInfoProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  // Handle legacy string format or undefined
  if (!recruiterContact || typeof recruiterContact === 'string') {
    return (
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">Recruiter Contact</p>
        <p>{typeof recruiterContact === 'string' ? recruiterContact : 'No recruiter information available'}</p>
      </div>
    );
  }

  const hasContactDetails = Boolean(
    recruiterContact.name ||
    recruiterContact.email ||
    recruiterContact.phone ||
    recruiterContact.linkedin
  );
  
  const hasAdditionalDetails = Boolean(
    recruiterContact.title ||
    recruiterContact.department ||
    recruiterContact.preferred_contact_method ||
    recruiterContact.application_instructions
  );

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (!hasContactDetails && !hasAdditionalDetails) {
    return (
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">Recruiter Contact</p>
        <p>No recruiter information available</p>
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
            <h3 className="text-lg font-medium">Recruiter Information</h3>
            <Button variant="ghost" size="sm">
              {isOpen ? "Hide Details" : "Show Details"}
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Primary Contact Details */}
              {hasContactDetails && (
                <div className="space-y-2">
                  {recruiterContact.name && (
                    <div className="flex flex-col space-y-1">
                      <p className="text-lg font-medium">{recruiterContact.name}</p>
                      {recruiterContact.title && (
                        <p className="text-sm text-muted-foreground">{recruiterContact.title}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Contact Methods with Icons */}
                  <div className="flex flex-col space-y-2">
                    {recruiterContact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`mailto:${recruiterContact.email}`} 
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {recruiterContact.email}
                        </a>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => copyToClipboard(recruiterContact.email, 'Email')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    {recruiterContact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`tel:${recruiterContact.phone}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {recruiterContact.phone}
                        </a>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => copyToClipboard(recruiterContact.phone, 'Phone')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    {recruiterContact.linkedin && (
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={recruiterContact.linkedin.startsWith('http') 
                            ? recruiterContact.linkedin 
                            : `https://linkedin.com/in/${recruiterContact.linkedin}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Additional Details */}
              {hasAdditionalDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {recruiterContact.department && (
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p>{recruiterContact.department}</p>
                    </div>
                  )}
                  
                  {recruiterContact.preferred_contact_method && (
                    <div>
                      <p className="text-sm text-muted-foreground">Preferred Contact Method</p>
                      <Badge variant="outline">{recruiterContact.preferred_contact_method}</Badge>
                    </div>
                  )}
                </div>
              )}
              
              {/* Application Instructions */}
              {recruiterContact.application_instructions && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">Application Instructions</p>
                  <p className="whitespace-pre-wrap text-sm mt-1 bg-muted p-3 rounded-md">
                    {recruiterContact.application_instructions}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
