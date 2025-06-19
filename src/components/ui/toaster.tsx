
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { ToastAction } from "@/components/ui/toast"
import { useEffect } from "react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  // Auto-dismiss toasts after 5 seconds
  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.id) {
        const timer = setTimeout(() => {
          dismiss(String(toast.id));
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    });
  }, [toasts, dismiss]);

  // Only show the first 3 toasts
  const visibleToasts = toasts.slice(0, 3);

  return (
    <div
      className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
    >
      {visibleToasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <div
            key={id}
            className={cn(
              "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-slate-200 p-6 pr-8 shadow-lg transition-all cursor-pointer hover:scale-105 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-right-full data-[state=closed]:animate-in data-[state=closed]:slide-in-from-top-full dark:border-slate-800 sm:data-[state=closed]:slide-out-to-bottom-full sm:data-[state=closed]:slide-in-from-bottom-full",
              {
                "bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50": true,
                "destructive group border-red-500 bg-red-500 text-slate-50 dark:border-red-900 dark:bg-red-900 dark:text-slate-50": props.type === "error"
              }
            )}
            data-state="open"
            role="status"
            aria-live="polite"
            onClick={() => id && dismiss(String(id))}
            {...props}
          >
            <div className="grid gap-1">
              {title && <div className="text-sm font-semibold">{title}</div>}
              {description && (
                <div className="text-sm opacity-90">{description}</div>
              )}
            </div>
            {action && typeof action === 'object' && 'children' in action ? action : null}
          </div>
        )
      })}
    </div>
  )
}
