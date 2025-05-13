
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { printerService } from '@/services/printer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PrinterData } from '@/types/printers';
import PrinterDetailContent from '@/components/printers/PrinterDetailContent';

const PrinterDetail = () => {
  const { printerId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: printer, isLoading, error } = useQuery({
    queryKey: ['printer', printerId],
    queryFn: () => printerService.getPrinter(printerId || ''),
    enabled: !!printerId,
  });

  useEffect(() => {
    if (error) {
      console.error('Error fetching printer details:', error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading printer details...</p>
        </div>
      </div>
    );
  }

  if (!printer) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <h2 className="text-2xl font-bold">Printer Not Found</h2>
            <p className="text-muted-foreground">The printer you are looking for does not exist or has been removed.</p>
            <Button onClick={() => navigate('/printers')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Printers
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/printers')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{printer.name}</h1>
            <p className="text-muted-foreground text-sm">
              {printer.model} • {printer.location}
            </p>
          </div>
        </div>
      </div>

      <PrinterDetailContent printer={printer} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default PrinterDetail;
