
import { toast as sonnerToast, type ToastT } from "sonner";
import * as React from "react";

export type ToasterToast = ToastT;

const useToast = () => {
  return {
    toast: sonnerToast,
    // This is needed for the ui/toaster.tsx component but won't be used
    toasts: [] as ToasterToast[],
    dismiss: sonnerToast.dismiss,
  };
};

export { useToast, sonnerToast as toast };
