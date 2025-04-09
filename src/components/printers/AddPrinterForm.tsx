
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

interface AddPrinterFormProps {
  form: UseFormReturn<PrinterFormValues>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  formData: PrinterFormValues;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<PrinterFormValues>>;
}

const AddPrinterForm: React.FC<AddPrinterFormProps> = ({
  form,
  onSubmit,
  onCancel,
  formData,
  handleInputChange,
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
                  <Input 
                    {...field} 
                    value={formData.model}
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }}
                    placeholder="Epson WorkForce Pro" 
                  />
                </FormControl>
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
          
          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select
                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    name="status"
                    value={formData.status}
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange(e);
                    }}
                  >
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                    <option value="error">Error</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="warning">Warning</option>
                  </select>
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
          <p>Ink and paper levels will be automatically detected once the printer is connected.</p>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Add Printer
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddPrinterForm;
