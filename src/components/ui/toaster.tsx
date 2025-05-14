
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import React from "react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, type, ...props }) {
        // For TypeScript, ensure we handle types correctly
        const validProps = { ...props };
        
        // Map our type values to className values instead of using variant
        if (typeof type === 'string') {
          const typeValue = String(type);
          if (typeValue === 'destructive') {
            validProps.className = `${validProps.className || ''} destructive`.trim();
          }
        }
        
        return (
          <Toast key={id} {...validProps}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action && React.isValidElement(action) ? action : null}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
