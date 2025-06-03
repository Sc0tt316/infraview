
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
    inkLevel: 0,
    paperLevel: 0,
    ipAddress: '',
    department: ''
  });
  const [isDetecting, setIsDetecting] = useState(false);

  // Initialize form with existing printer data if editing
  useEffect(() => {
    if (existingPrinter) {
      setFormData({
        name: existingPrinter.name || '',
        model: existingPrinter.model || '',
        location: existingPrinter.location || '',
        status: existingPrinter.status || 'offline',
        inkLevel: existingPrinter.inkLevel || 0,
        paperLevel: existingPrinter.paperLevel || 0,
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

  // Auto-detect printer model when IP address changes
  const detectPrinterModel = async (ipAddress: string) => {
    if (!ipAddress || existingPrinter) return; // Skip if editing existing printer
    
    setIsDetecting(true);
    try {
      const result = await fetch('/api/printer-monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ipAddress,
          action: 'poll'
        })
      });
      
      const data = await result.json();
      
      if (data.success && data.data) {
        const detectedModel = data.data.model;
        const detectedName = data.data.name;
        
        if (detectedModel && detectedModel !== 'Unknown Printer') {
          setFormData(prev => ({
            ...prev,
            model: detectedModel,
            name: detectedName || prev.name
          }));
          
          toast({
            title: "Printer Detected",
            description: `Found: ${detectedModel}`,
          });
        }
      }
    } catch (error) {
      console.log('Auto-detection failed, user can enter manually');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-detect when IP address is entered
    if (name === 'ipAddress' && value && !existingPrinter) {
      const timeoutId = setTimeout(() => {
        detectPrinterModel(value);
      }, 1000); // Debounce for 1 second
      
      return () => clearTimeout(timeoutId);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      form.handleSubmit(async (validData) => {
        const printerData = {
          name: validData.name,
          model: validData.model,
          location: validData.location,
          status: 'offline' as const,
          inkLevel: 0,
          paperLevel: 0,
          ipAddress: validData.ipAddress || '',
          department: validData.department || '',
          serialNumber: undefined
        };
        
        if (existingPrinter) {
          await printerService.updatePrinter(existingPrinter.id, printerData);
          
          if (printerData.ipAddress) {
            try {
              await printerService.pollPrinter({
                id: existingPrinter.id,
                name: printerData.name,
                ipAddress: printerData.ipAddress
              });
              toast({
                title: "Success",
                description: "Printer updated and status detected automatically",
              });
            } catch (pollError) {
              toast({
                title: "Printer Updated",
                description: "Printer updated successfully. Status will be detected on next refresh.",
              });
            }
          } else {
            toast({
              title: "Success",
              description: "Printer updated successfully",
            });
          }
        } else {
          const newPrinter = await printerService.addPrinter(printerData);
          
          if (printerData.ipAddress && newPrinter) {
            try {
              await printerService.pollPrinter({
                id: newPrinter.id,
                name: printerData.name,
                ipAddress: printerData.ipAddress
              });
              toast({
                title: "Success",
                description: "Printer added and status detected automatically",
              });
            } catch (pollError) {
              toast({
                title: "Printer Added",
                description: "Printer added successfully. Status will be detected shortly.",
              });
            }
          } else {
            toast({
              title: "Success",
              description: "Printer added successfully",
            });
          }
        }

        queryClient.invalidateQueries({
          queryKey: ['printers']
        });
        
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
      isDetecting={isDetecting}
    />
  );
};

export default AddPrinterFormContainer;
