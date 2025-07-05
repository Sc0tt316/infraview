
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import type { ToasterProps as SonnerProps } from "sonner";

type ToasterProps = SonnerProps;

const Toaster = ({ ...props }: ToasterProps) => {
  // Component disabled - no popup notifications
  return null;
};

export { Toaster };
