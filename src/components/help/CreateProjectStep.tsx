
import { BookOpen } from "lucide-react";

export const CreateProjectStep = () => {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 p-2 rounded mb-4">
        <BookOpen className="h-4 w-4" />
        <span>CV can be in Word, TXT, or PDF format</span>
      </div>

      {/* Screenshots */}
      <div className="mt-2 border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-slate-500 text-sm">
          2.1 Add new project in ChatGPT:
          <img
            src="/images/Step_2_1_add_project.png"
            alt="Adding project"
            className="rounded-lg border border-slate-200 w-full shadow-sm"
          />
        </p>
      </div>
      <div className="mt-2 border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-slate-500 text-sm">
          2.2 Click add files:
          <img
            src="/images/Step_2_2_click_add_files.png"
            alt="Click add files"
            className="rounded-lg border border-slate-200 w-full shadow-sm"
          />
        </p>
      </div>
      <div className="mt-2 border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-slate-500 text-sm">
          2.3 Select files to add:
          <img
            src="/images/Step_2_3_add_files.png"
            alt="Select files to add"
            className="rounded-lg border border-slate-200 w-full shadow-sm"
          />
        </p>
      </div>
    </div>
  );
};
