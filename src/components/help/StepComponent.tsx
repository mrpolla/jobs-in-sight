
import { ReactNode } from "react";

interface StepComponentProps {
  stepNumber: number;
  title: string;
  description: string;
  children: ReactNode;
}

export const StepComponent = ({
  stepNumber,
  title,
  description,
  children,
}: StepComponentProps) => {
  return (
    <div className="flex items-start gap-4 py-6">
      <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        {stepNumber}
      </div>
      <div className="w-full">
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-sm text-slate-600 mb-2">{description}</p>
        {children}
      </div>
    </div>
  );
};

