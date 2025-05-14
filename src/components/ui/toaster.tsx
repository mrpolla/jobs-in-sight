
import * as React from "react"
import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  // Use SonnerToaster instead since we're using sonner now
  return <SonnerToaster />
}
