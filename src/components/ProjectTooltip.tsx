import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Job, RequirementMatch, RequirementAssessment } from "@/types/job";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import RequirementsAssessment from "./RequirementsAssessment";
import RequirementsStats from "./RequirementsStats";
import RequirementsMatchDisplay from "./RequirementsMatchDisplay";
import RequirementsMatchStats from "./RequirementsMatchStats";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Progress } from "./ui/progress";

interface ProjectTooltipProps {
  job: Job;
  children: React.ReactNode;
}

export default function ProjectTooltip({ job, children }: ProjectTooltipProps) {
  // Check if we have the new requirements_match structure
  const hasRequirementsMatch =
    job.cv_match?.requirements_match &&
    job.cv_match.requirements_match.length > 0;

  // Backwards compatibility: Check for the legacy requirements_assessment
  const hasRequirementsAssessment =
    job.application_reasoning?.requirements_assessment &&
    job.application_reasoning.requirements_assessment.length > 0;

  // Get the overall match percentage
  const overallMatchPercentage =
    job.cv_match?.overall_match_percentage || job.match_score;

  return (
    <>
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <div className="cursor-help">{children}</div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 md:w-96" align="start">
          <ScrollArea className="h-80">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">
                  {job.position} at {job.company}
                </h4>
                {job.project && (
                  <p className="text-sm text-muted-foreground">
                    Project: {job.project}
                  </p>
                )}
                {job.product && (
                  <p className="text-sm text-muted-foreground">
                    Product: {job.product}
                  </p>
                )}

                {/* Add new fields for hours and vacation */}
                {job.hours_per_week && (
                  <p className="text-sm text-muted-foreground">
                    Hours: {job.hours_per_week} per week
                  </p>
                )}
                {job.vacation_days && (
                  <p className="text-sm text-muted-foreground">
                    Vacation: {job.vacation_days} days
                  </p>
                )}
              </div>

              {job.job_description && (
                <div>
                  <h5 className="text-sm font-semibold">Job Description</h5>
                  <p className="text-sm mt-1">{job.job_description}</p>
                </div>
              )}

              {job.requirements && (
                <div>
                  <h5 className="text-sm font-semibold">Requirements</h5>
                  <p className="text-sm mt-1">{job.requirements}</p>
                </div>
              )}

              {job.application_reasoning && (
                <div className="border-t pt-2 mt-4">
                  <h5 className="text-sm font-semibold">
                    Application Reasoning
                  </h5>

                  {job.application_reasoning.why_apply && (
                    <div className="mt-2">
                      <h6 className="text-xs font-medium">Why Apply</h6>
                      <p className="text-xs mt-1">
                        {job.application_reasoning.why_apply}
                      </p>
                    </div>
                  )}

                  {job.application_reasoning.key_matching_qualifications
                    ?.length > 0 && (
                    <div className="mt-2">
                      <h6 className="text-xs font-medium">
                        Key Matching Qualifications
                      </h6>
                      <ul className="text-xs list-disc pl-4 mt-1">
                        {job.application_reasoning.key_matching_qualifications.map(
                          (qual, i) => (
                            <li key={i}>{qual}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {!hasRequirementsMatch &&
                    !hasRequirementsAssessment &&
                    job.application_reasoning.transferable_skills_details
                      ?.length > 0 && (
                      <div className="mt-2">
                        <h6 className="text-xs font-medium">
                          Transferable Skills
                        </h6>
                        <ul className="text-xs list-disc pl-4 mt-1">
                          {job.application_reasoning.transferable_skills_details.map(
                            (skill, i) => (
                              <li key={i}>{skill}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {job.application_reasoning.learning_needs?.length > 0 && (
                    <div className="mt-2">
                      <h6 className="text-xs font-medium">Learning Needs</h6>
                      <ul className="text-xs list-disc pl-4 mt-1">
                        {job.application_reasoning.learning_needs.map(
                          (need, i) => (
                            <li key={i}>{need}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {job.application_reasoning.overall_fit_assessment && (
                    <div className="mt-2">
                      <h6 className="text-xs font-medium">
                        Overall Fit Assessment
                      </h6>
                      <p className="text-xs mt-1">
                        {job.application_reasoning.overall_fit_assessment}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </HoverCardContent>
      </HoverCard>
    </>
  );
}
