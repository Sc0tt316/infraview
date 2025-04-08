
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

export interface PrinterFormValues {
  name: string;
  model: string;
  location: string;
  status: "online" | "offline" | "error" | "maintenance" | "warning";
  inkLevel: number;
  paperLevel: number;
  ipAddress: string;
  department: string;
}

export const handlePrinterFormSubmission = (
  event: React.FormEvent<HTMLFormElement>,
  formData: PrinterFormValues,
  onSubmit: (values: PrinterFormValues) => Promise<void>
) => {
  event.preventDefault();
  onSubmit(formData);
};

export const createInitialFormData = (): PrinterFormValues => ({
  name: '',
  model: '',
  location: '',
  status: 'online',
  inkLevel: 100,
  paperLevel: 100,
  ipAddress: '',
  department: '',
});
