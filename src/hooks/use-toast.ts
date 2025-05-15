
import { toast as sonnerToast, Toast } from "sonner";
import * as React from "react";

export type ToasterToast = Toast;

const useToast = () => {
  return {
    toast: sonnerToast,
    // This is needed for the ui/toaster.tsx component but won't be used
    toasts: [] as ToasterToast[],
    dismiss: sonnerToast.dismiss,
  };
};

export { useToast, sonnerToast as toast };
