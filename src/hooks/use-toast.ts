
import { toast as sonnerToast } from "sonner";

// Re-export the toast function directly
export { sonnerToast as toast };

// Provide the hook for compatibility with existing components
export const useToast = () => {
  return {
    toast: sonnerToast,
    toasts: [], // Empty array for compatibility with existing components
    dismiss: sonnerToast.dismiss,
  };
};
