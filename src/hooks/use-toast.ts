
import * as React from "react";
import { toast as sonnerToast, type ToastT } from "sonner";

interface ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
}

function toast({
  title,
  description,
  action,
  variant = "default",
  duration = 5000,
  ...props
}: ToastProps) {
  sonnerToast(title, {
    description,
    action,
    duration,
    className: variant === "destructive" ? "destructive" : undefined,
    ...props,
  });
}

export { toast };

export function useToast() {
  return {
    toast,
  };
}
