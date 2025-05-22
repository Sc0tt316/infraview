
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { printerFormSchema, PrinterFormValues } from '@/types/printer';
import AddPrinterForm from './AddPrinterForm';
import { useQueryClient } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { toast } from '@/hooks/use-toast';
import { PrinterData } from '@/types/printers';

interface AddPrinterFormContainerProps {
  onCancel: () => void;
  existingPrinter?: PrinterData;
  onSuccess?: () => void;
}

const AddPrinterFormContainer: React.FC<AddPrinterFormContainerProps> = ({ 
  onCancel,
  existingPrinter,
  onSuccess
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

  // Initialize form with existing printer data if editing
  useEffect(() => {
    if (existingPrinter) {
      setFormData({
        name: existingPrinter.name || '',
        model: existingPrinter.model || '',
        location: existingPrinter.location || '',
        status: existingPrinter.status || 'offline',
        inkLevel: existingPrinter.inkLevel || 100,
        paperLevel: existingPrinter.paperLevel || 100,
        ipAddress: existingPrinter.ipAddress || '',
        department: existingPrinter.department || '',
      });
    }
  }, [existingPrinter]);

  const form = useForm<PrinterFormValues>({
    resolver: zodResolver(printerFormSchema),
    defaultValues: formData,
    values: formData
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
        // Ensure all required fields are present before sending to the API
        const printerData = {
          name: validData.name,
          model: validData.model,
          location: validData.location,
          status: validData.status,
          inkLevel: validData.inkLevel,
          paperLevel: validData.paperLevel,
          ipAddress: validData.ipAddress || '',
          department: validData.department || '',
          serialNumber: undefined
        };
        
        if (existingPrinter) {
          // Update existing printer
          await printerService.updatePrinter(existingPrinter.id, printerData);
          toast({
            title: "Success",
            description: "Printer updated successfully",
          });
        } else {
          // Add new printer
          await printerService.addPrinter(printerData);
          toast({
            title: "Success",
            description: "Printer added successfully",
          });
        }

        // Refresh printer data
        queryClient.invalidateQueries({
          queryKey: ['printers']
        });
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        } else {
          onCancel();
        }
      })();
    } catch (error) {
      console.error("Error adding/updating printer:", error);
      toast({
        title: "Error",
        description: "Failed to save printer. Please try again.",
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
      isEditing={!!existingPrinter}
    />
  );
};

export default AddPrinterFormContainer;
