
import { toast as sonnerToast, type Toast } from "sonner";

// Re-export the toast function directly
export { sonnerToast as toast };

// Provide the hook for compatibility with existing components
export const useToast = () => {
  return {
    toast: sonnerToast,
    toasts: [],
    dismiss: sonnerToast.dismiss,
  };
};
