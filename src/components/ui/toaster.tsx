
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
        // We need to check if type is a valid value for the Toast component
        const validProps = { ...props };
        
        // Convert type to string and safely compare with valid types
        // Instead of setting variant directly on the props, we'll set it on validProps
        if (typeof type === 'string') {
          const typeValue = String(type);
          if (typeValue === 'default' || typeValue === 'destructive') {
            // Store this separately since 'variant' isn't directly accepted by sonner
            validProps.variant = typeValue;
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
