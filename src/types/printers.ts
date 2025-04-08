
export interface PrinterData {
  id: string;
  name: string;
  model: string;
  location: string;
  status: 'online' | 'offline' | 'error' | 'maintenance' | 'warning';
  inkLevel: number;
  paperLevel: number;
  ipAddress: string;
  department: string;
  jobCount?: number;
  lastActive?: string;
}

export interface PrinterActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  printerId?: string;
}

export interface PrinterLog {
  id: string;
  timestamp: string;
  type: string;
  user: string;
  message: string;
  details?: string;
  pages?: number;
}

export interface PrinterFiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (dept: string) => void;
}

export interface PrinterCardProps {
  printer: PrinterData;
  isGridView: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export interface EmptyPrinterStateProps {
  onAdd: () => void;
}

export interface DeletePrinterConfirmationProps {
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
