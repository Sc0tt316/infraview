
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

// Main Printer interface that matches our database structure
export interface Printer {
  id: string;
  name: string;
  model: string;
  location: string;
  status: 'online' | 'offline' | 'error' | 'warning' | 'maintenance';
  sub_status?: string;
  ink_level: number;
  paper_level: number;
  job_count?: number;
  last_active?: string;
  ip_address?: string;
  department?: string;
  serial_number?: string;
  added_date?: string;
  supplies?: any;
  stats?: any;
}
