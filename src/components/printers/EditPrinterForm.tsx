
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PrinterFormValues } from '@/types/printer';
import { UseFormReturn } from 'react-hook-form';
import { Progress } from '@/components/ui/progress';

interface EditPrinterFormProps {
  form: UseFormReturn<PrinterFormValues>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  formData: PrinterFormValues;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<PrinterFormValues>>;
}

const EditPrinterForm: React.FC<EditPrinterFormProps> = ({ 
  form, 
  onSubmit, 
  onCancel, 
  formData, 
  handleInputChange,
}) => {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Printer Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Office Printer 1" 
                    name="name"
                    value={formData.name} 
                    onChange={handleInputChange} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="HP LaserJet Pro" 
                    name="model"
                    value={formData.model} 
                    onChange={handleInputChange} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="First Floor" 
                    name="location"
                    value={formData.location} 
                    onChange={handleInputChange} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Administration" 
                    name="department"
                    value={formData.department} 
                    onChange={handleInputChange} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ipAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IP Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="192.168.1.101" 
                    name="ipAddress"
                    value={formData.ipAddress} 
                    onChange={handleInputChange} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="error">Error</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="warning">Warning</option>
                </select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-3">
          <FormItem>
            <FormLabel>Ink Level ({formData.inkLevel}%)</FormLabel>
            <div className="space-y-2">
              <Progress value={formData.inkLevel} className="w-full h-2" />
              <p className="text-sm text-muted-foreground">Ink level is detected automatically from the printer</p>
            </div>
          </FormItem>
          
          <FormItem>
            <FormLabel>Paper Level ({formData.paperLevel}%)</FormLabel>
            <div className="space-y-2">
              <Progress value={formData.paperLevel} className="w-full h-2" />
              <p className="text-sm text-muted-foreground">Paper level is detected automatically from the printer</p>
            </div>
          </FormItem>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Update Printer</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EditPrinterForm;
