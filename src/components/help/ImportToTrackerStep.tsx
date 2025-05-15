
import { LayoutDashboard } from "lucide-react";

export const ImportToTrackerStep = () => {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 p-2 rounded mb-4">
        <LayoutDashboard className="h-4 w-4" />
        <span>
          Copy-paste JSON from ChatGPT to "JSON Parse" in Job Tracker
        </span>
      </div>

      {/* Screenshots */}
      <div className="mt-2 border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-slate-500 text-sm">
          4.1 Copy json from ChatGPT:
          <img
            src="/images/Step_4_1_copy_json.png"
            alt="Copy JSON"
            className="rounded-lg border border-slate-200 w-full shadow-sm"
          />
        </p>
      </div>
      <div className="mt-2 border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-slate-500 text-sm">
          4.2 Select "JSON Paste" in Job Tracker:
          <img
            src="/images/Step_4_2_add_json.png"
            alt="Select JSON"
            className="rounded-lg border border-slate-200 w-full shadow-sm"
          />
        </p>
      </div>
      <div className="mt-2 border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-slate-500 text-sm">
          4.3 Paste the JSON response in the text area and click "Parse
          JSON":
          <img
            src="/images/Step_4_3_paste_json.png"
            alt="Paste JSON"
            className="rounded-lg border border-slate-200 w-full shadow-sm"
          />
        </p>
      </div>
    </div>
  );
};
