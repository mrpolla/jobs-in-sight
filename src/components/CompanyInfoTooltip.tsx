
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface CompanyInfoTooltipProps {
  company: string;
  companyInfo?: string;
  industry?: string;
  companySize?: string;
  companyReputation?: string;
  companyProducts?: string;
  children: React.ReactNode;
}

export default function CompanyInfoTooltip({
  company,
  companyInfo,
  industry,
  companySize,
  companyReputation,
  companyProducts,
  children
}: CompanyInfoTooltipProps) {
  const hasDetails = companyInfo || industry || companySize || companyReputation || companyProducts;
  
  if (!hasDetails) {
    return <>{children}</>;
  }
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-help">{children}</div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <h4 className="text-base font-bold mb-2">{company}</h4>
        
        {companyInfo && (
          <p className="text-sm mb-2">{companyInfo}</p>
        )}
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {industry && (
            <div>
              <p className="text-xs text-muted-foreground">Industry</p>
              <p className="font-medium">{industry}</p>
            </div>
          )}
          
          {companySize && (
            <div>
              <p className="text-xs text-muted-foreground">Company Size</p>
              <p className="font-medium">{companySize}</p>
            </div>
          )}
          
          {companyReputation && (
            <div>
              <p className="text-xs text-muted-foreground">Reputation</p>
              <p className="font-medium">{companyReputation}</p>
            </div>
          )}
        </div>
        
        {companyProducts && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground">Products/Services</p>
            <p className="text-sm">{companyProducts}</p>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
