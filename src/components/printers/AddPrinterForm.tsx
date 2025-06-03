
import React from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { PrinterFormValues } from '@/types/printer';
import { Loader2 } from 'lucide-react';

interface AddPrinterFormProps {
  form: UseFormReturn<PrinterFormValues>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  formData: PrinterFormValues;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<PrinterFormValues>>;
  isEditing?: boolean;
  isDetecting?: boolean;
}

const AddPrinterForm: React.FC<AddPrinterFormProps> = ({
  form,
  onSubmit,
  onCancel,
  formData,
  handleInputChange,
  isEditing = false,
  isDetecting = false,
}) => {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Printer Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Printer Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    value={formData.name}
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }}
                    placeholder="Marketing Printer" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Printer Model */}
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      {...field} 
                      value={formData.model}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }}
                      placeholder="Epson WorkForce Pro" 
                      disabled={isDetecting}
                    />
                    {isDetecting && (
                      <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </FormControl>
                {isDetecting && (
                  <p className="text-xs text-muted-foreground">Detecting printer model...</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    value={formData.location}
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }}
                    placeholder="Marketing Department, 2nd Floor" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* IP Address */}
          <FormField
            control={form.control}
            name="ipAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IP Address</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    value={formData.ipAddress}
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }}
                    placeholder="192.168.1.100" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Department */}
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    value={formData.department}
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }}
                    placeholder="Marketing" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Printer status, ink, and paper levels will be automatically detected once the printer is connected via IP address.</p>
          {!isEditing && (
            <p className="mt-1">Enter an IP address to automatically detect the printer model and name.</p>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Printer" : "Add Printer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddPrinterForm;
