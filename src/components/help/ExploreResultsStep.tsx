
import { LayoutDashboard } from "lucide-react";

export const ExploreResultsStep = () => {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 p-2 rounded mb-4">
        <LayoutDashboard className="h-4 w-4" />
        <span>Explore the many features of Job Tracker</span>
      </div>

      {/* Screenshots */}
      <div className="mt-2 border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-slate-500 text-sm">
          5 Explore results:
          <img
            src="/images/Step_5_result.png"
            alt="See results"
            className="rounded-lg border border-slate-200 w-full shadow-sm"
          />
        </p>
      </div>
    </div>
  );
};
