
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { printerFormSchema, PrinterFormValues } from '@/types/printer';
import AddPrinterForm from './AddPrinterForm';
import { useQueryClient } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { toast } from '@/hooks/use-toast';

interface AddPrinterFormContainerProps {
  onCancel: () => void;
}

const AddPrinterFormContainer: React.FC<AddPrinterFormContainerProps> = ({ 
  onCancel 
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<PrinterFormValues>({
    name: '',
    model: '',
    location: '',
    status: 'offline',
    inkLevel: 100,
    paperLevel: 100,
    ipAddress: '',
    department: ''
  });

  const form = useForm<PrinterFormValues>({
    resolver: zodResolver(printerFormSchema),
    defaultValues: formData
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      form.handleSubmit(async (validData) => {
        await printerService.addPrinter(validData);
        toast({
          title: "Success",
          description: "Printer added successfully",
        });
        queryClient.invalidateQueries({
          queryKey: ['printers']
        });
        onCancel();
      })();
    } catch (error) {
      console.error("Error adding printer:", error);
      toast({
        title: "Error",
        description: "Failed to add printer. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AddPrinterForm
      form={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      formData={formData}
      handleInputChange={handleInputChange}
      setFormData={setFormData}
    />
  );
};

export default AddPrinterFormContainer;
