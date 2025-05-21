
import { z } from "zod";

export const printerFormSchema = z.object({
  name: z.string().min(2, {
    message: "Printer name must be at least 2 characters.",
  }),
  model: z.string().min(2, {
    message: "Printer model must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Printer location must be at least 2 characters.",
  }),
  status: z.enum(["online", "offline", "error", "maintenance", "warning"]).default("offline"),
  inkLevel: z.number().min(0).max(100).default(100),
  paperLevel: z.number().min(0).max(100).default(100),
  ipAddress: z.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, { 
    message: "Please enter a valid IP address (e.g., 192.168.1.100)" 
  }).optional().or(z.literal('')),
  department: z.string().optional(),
  autoDiscovery: z.boolean().default(false),
});

export type PrinterFormValues = z.infer<typeof printerFormSchema>;

// Extend the form values with auto-discovery flag
export interface ExtendedPrinterFormValues extends PrinterFormValues {
  autoDiscovery?: boolean;
}
