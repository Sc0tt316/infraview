
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import type { ToasterProps as SonnerProps } from "sonner";

type ToasterProps = SonnerProps;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        duration: 3000, // 3 seconds
        closeButton: true,
        // Removed 'dismissible' property as it doesn't exist in ToastOptions
        className: "cursor-pointer", // Make toast clickable
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      richColors
      position="top-right"
      expand={false}
      offset="16px"
      visibleToasts={3} // Limit visible toasts to 3
      {...props}
    />
  );
};

export { Toaster };
