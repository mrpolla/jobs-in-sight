
import { toast as sonnerToast } from "sonner";

// Re-export toast from sonner for use throughout the application
export const toast = sonnerToast;

// Create a custom hook for toast functionality
export const useToast = () => {
  return {
    toast: sonnerToast,
  };
};
