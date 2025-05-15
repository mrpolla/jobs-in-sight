
import { ReactNode } from "react";
import { StepComponent } from "./StepComponent";
import { DownloadPromptStep } from "./DownloadPromptStep";
import { CreateProjectStep } from "./CreateProjectStep";
import { AnalyzeJobListingStep } from "./AnalyzeJobListingStep";
import { ImportToTrackerStep } from "./ImportToTrackerStep";
import { ExploreResultsStep } from "./ExploreResultsStep";

interface ModalContentProps {
  children?: ReactNode;
}

export const ModalContent = ({ children }: ModalContentProps) => {
  return (
    <div>
      {/* Header */}
      <div className="bg-slate-800 p-6 rounded-t-lg -mt-6 -mx-6 mb-6">
        <h2 className="text-xl font-bold text-white">
          How to Use Job Tracker
        </h2>
        <p className="text-slate-300 text-sm">
          Complete these steps to analyze job opportunities
        </p>
      </div>

      {/* Main content: Steps */}
      <div>
        {/* Step 1 */}
        <StepComponent
          stepNumber={1}
          title="Download Prompt Template"
          description="Download the prompt template for job analysis"
        >
          <DownloadPromptStep />
        </StepComponent>
        
        {/* Divider */}
        <div className="border-t border-slate-200 my-2"></div>
        
        {/* Step 2 */}
        <StepComponent
          stepNumber={2}
          title="Create ChatGPT Project"
          description="Create a new ChatGPT project and upload your CV and the prompt downloaded in the previous step"
        >
          <CreateProjectStep />
        </StepComponent>
        
        {/* Divider */}
        <div className="border-t border-slate-200 my-2"></div>
        
        {/* Step 3 */}
        <StepComponent
          stepNumber={3}
          title="Analyze Job Listing"
          description="Paste a job URL into the ChatGPT project chat"
        >
          <AnalyzeJobListingStep />
        </StepComponent>
        
        {/* Divider */}
        <div className="border-t border-slate-200 my-2"></div>
        
        {/* Step 4 */}
        <StepComponent
          stepNumber={4}
          title="Import to Job Tracker"
          description="Copy the entire JSON response and import it"
        >
          <ImportToTrackerStep />
        </StepComponent>
        
        {/* Divider */}
        <div className="border-t border-slate-200 my-2"></div>
        
        {/* Step 5 */}
        <StepComponent
          stepNumber={5}
          title="Explore results in Job Tracker"
          description="Explore the results in Job Tracker and see how well you match the job listing"
        >
          <ExploreResultsStep />
        </StepComponent>
      </div>
    </div>
  );
};
