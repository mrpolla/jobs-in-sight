
import { Code } from "lucide-react";

export const AnalyzeJobListingStep = () => {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 p-2 rounded mb-4">
        <Code className="h-4 w-4" />
        <span>https://example.com/job/123"</span>
      </div>

      {/* Screenshots */}
      <div className="mt-2 border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-slate-500 text-sm">
          3.1 Paste link in project chat:
          <img
            src="/images/Step_3_paste_link.png"
            alt="Paste link"
            className="rounded-lg border border-slate-200 w-full shadow-sm"
          />
        </p>
      </div>
    </div>
  );
};
