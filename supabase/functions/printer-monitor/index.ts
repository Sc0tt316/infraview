
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// SNMP OIDs for common printer data points
const PRINTER_OIDS = {
  MODEL: '1.3.6.1.2.1.25.3.2.1.3.1',            // Model/description
  SERIAL: '1.3.6.1.2.1.43.5.1.1.17.1',          // Serial number
  STATUS: '1.3.6.1.2.1.25.3.5.1.1.1',           // Printer status
  SUB_STATUS: '1.3.6.1.2.1.25.3.5.1.2.1',       // Printer sub-status (detailed status)
  DEVICE_NAME: '1.3.6.1.2.1.1.5.0',             // Device name
  BLACK_LEVEL: '1.3.6.1.2.1.43.11.1.1.9.1.1',   // Black toner/ink level
  CYAN_LEVEL: '1.3.6.1.2.1.43.11.1.1.9.1.2',    // Cyan toner/ink level (for color printers)
  MAGENTA_LEVEL: '1.3.6.1.2.1.43.11.1.1.9.1.3', // Magenta toner/ink level (for color printers) 
  YELLOW_LEVEL: '1.3.6.1.2.1.43.11.1.1.9.1.4',  // Yellow toner/ink level (for color printers)
  PAPER_LEVEL: '1.3.6.1.2.1.43.8.2.1.10.1.1',   // Paper level in tray
  PAPER_JAMS: '1.3.6.1.2.1.43.18.1.1.8.1.1',    // Paper jam counter
  TOTAL_PRINTED: '1.3.6.1.2.1.43.10.2.1.4.1.1', // Total pages printed
  MONTHLY_PRINTED: '1.3.6.1.2.1.43.10.2.1.5.1.1', // Monthly page count
  PRINTER_TYPE: '1.3.6.1.2.1.25.3.2.1.2.1',     // Printer type
  WARMING_UP: '1.3.6.1.2.1.25.3.5.1.1.2',       // Warming up status
  PROCESSING_JOB: '1.3.6.1.2.1.25.3.5.1.1.3',   // Processing job status
  TONER_LOW: '1.3.6.1.2.1.25.3.5.1.1.4',        // Toner low warning
  TONER_CRITICAL: '1.3.6.1.2.1.25.3.5.1.1.5',   // Toner critical warning
};

// Status code mappings
const PRINTER_STATUS = {
  1: 'other',
  2: 'unknown',
  3: 'idle',
  4: 'printing',
  5: 'warmup',
  6: 'stopped',
  7: 'offline',
  8: 'error',
  9: 'maintenance'
};

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to simulate SNMP communication (in a real implementation, we would use an SNMP library)
async function simulateSNMPQuery(ipAddress: string, oids: string[]): Promise<Record<string, any>> {
  // This is a simulated response - in production, this would make real SNMP calls
  // For demo purposes, we'll generate realistic-looking values
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Randomly determine if printer is online (80% chance)
  const isOnline = Math.random() < 0.8;
  
  if (!isOnline) {
    throw new Error('Printer is offline or not responding');
  }
  
  // Generate random data for the printer
  const randomSupplyLevel = () => Math.floor(Math.random() * 100);
  const randomPrinterModel = () => {
    const models = ['HP LaserJet Pro M404', 'Epson WorkForce Pro WF-4830', 'Canon PIXMA TS9120', 
                   'Brother MFC-L8900CDW', 'Xerox VersaLink C405', 'Lexmark MC3224i'];
    return models[Math.floor(Math.random() * models.length)];
  };
  
  // Determine if it's a color printer (70% chance)
  const isColorPrinter = Math.random() < 0.7;
  
  // Simulate random but realistic job count
  const jobCount = Math.floor(Math.random() * 5000);
  const monthlyPrints = Math.floor(Math.random() * 500);
  
  // Simulate printer status (mostly online with occasional issues)
  const statusCode = Math.random() < 0.9 ? 3 : [5, 6, 8][Math.floor(Math.random() * 3)];
  
  // Determine sub-status based on status code
  let subStatus = 'idle';
  if (statusCode === 4) subStatus = 'printing';
  else if (statusCode === 5) subStatus = 'warming up';
  else if (statusCode === 8) subStatus = 'paper jam';
  else if (statusCode === 9) subStatus = 'scheduled maintenance';
  
  // Create the response object
  const response: Record<string, any> = {
    [PRINTER_OIDS.MODEL]: randomPrinterModel(),
    [PRINTER_OIDS.SERIAL]: `SN-${Math.floor(Math.random() * 1000000)}`,
    [PRINTER_OIDS.STATUS]: statusCode,
    [PRINTER_OIDS.SUB_STATUS]: subStatus,
    [PRINTER_OIDS.DEVICE_NAME]: `Printer-${ipAddress.split('.').pop()}`,
    [PRINTER_OIDS.BLACK_LEVEL]: randomSupplyLevel(),
    [PRINTER_OIDS.PAPER_LEVEL]: randomSupplyLevel(),
    [PRINTER_OIDS.PAPER_JAMS]: Math.floor(Math.random() * 10),
    [PRINTER_OIDS.TOTAL_PRINTED]: jobCount,
    [PRINTER_OIDS.MONTHLY_PRINTED]: monthlyPrints,
  };
  
  // Add color-specific data only for color printers
  if (isColorPrinter) {
    response[PRINTER_OIDS.CYAN_LEVEL] = randomSupplyLevel();
    response[PRINTER_OIDS.MAGENTA_LEVEL] = randomSupplyLevel();
    response[PRINTER_OIDS.YELLOW_LEVEL] = randomSupplyLevel();
  }
  
  return response;
}

// Function to map SNMP response to printer data object
function mapSNMPResponseToPrinterData(snmpData: Record<string, any>, ipAddress: string, printerName: string): any {
  // Map the raw SNMP data to our printer data structure
  const statusCode = snmpData[PRINTER_OIDS.STATUS];
  const subStatus = snmpData[PRINTER_OIDS.SUB_STATUS] || 'idle';
  
  // Convert status code to our application's status format
  let appStatus = 'online';
  if (statusCode === 8) appStatus = 'error';
  else if (statusCode === 6 || statusCode === 7) appStatus = 'offline';
  else if (statusCode === 5) appStatus = 'warning';
  else if (statusCode === 9) appStatus = 'maintenance';
  
  // Calculate overall ink level as average of all cartridges
  const blackLevel = snmpData[PRINTER_OIDS.BLACK_LEVEL] || 0;
  const cyanLevel = snmpData[PRINTER_OIDS.CYAN_LEVEL] || 0;
  const magentaLevel = snmpData[PRINTER_OIDS.MAGENTA_LEVEL] || 0;
  const yellowLevel = snmpData[PRINTER_OIDS.YELLOW_LEVEL] || 0;
  
  // For monochrome printers, only use black level
  const isColorPrinter = cyanLevel > 0 || magentaLevel > 0 || yellowLevel > 0;
  const inkLevel = isColorPrinter
    ? Math.floor((blackLevel + cyanLevel + magentaLevel + yellowLevel) / 4)
    : blackLevel;
  
  // Get printer usage statistics
  const totalPrints = snmpData[PRINTER_OIDS.TOTAL_PRINTED] || 0;
  const monthlyPrints = snmpData[PRINTER_OIDS.MONTHLY_PRINTED] || 0;
  const weeklyPrints = Math.floor(monthlyPrints / 4); // Estimate
  const dailyPrints = Math.floor(weeklyPrints / 7);   // Estimate
  const paperJams = snmpData[PRINTER_OIDS.PAPER_JAMS] || 0;
    
  return {
    name: printerName,
    model: snmpData[PRINTER_OIDS.MODEL],
    location: '', // Location might need to be set manually
    status: appStatus,
    subStatus: subStatus,
    inkLevel,
    paperLevel: snmpData[PRINTER_OIDS.PAPER_LEVEL],
    jobCount: totalPrints,
    ipAddress,
    serialNumber: snmpData[PRINTER_OIDS.SERIAL],
    supplies: {
      black: blackLevel,
      cyan: isColorPrinter ? cyanLevel : undefined,
      magenta: isColorPrinter ? magentaLevel : undefined,
      yellow: isColorPrinter ? yellowLevel : undefined,
    },
    stats: {
      dailyPrints,
      weeklyPrints,
      monthlyPrints,
      totalPrints,
      jams: paperJams
    }
  };
}

serve(async (req) => {
  // Create Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Parse request body
    const reqBody = await req.json();
    const { ipAddress, printerId, printerName, action } = reqBody;
    
    // Handle discovery action
    if (action === 'discover') {
      // Simulate discovering printers on the network
      const discoveredPrinters = [
        { ipAddress: '192.168.1.100', name: 'Office Printer', model: 'HP LaserJet Pro MFP M428fdw' },
        { ipAddress: '192.168.1.101', name: 'Marketing Printer', model: 'Canon PIXMA G7020' },
        { ipAddress: '192.168.1.102', name: 'HR Printer', model: 'Brother MFC-L8900CDW' },
      ];
      
      return new Response(JSON.stringify({ success: true, printers: discoveredPrinters }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // For single printer polling, require IP address
    if (!ipAddress) {
      return new Response(JSON.stringify({ error: 'IP address is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Query all OIDs from the printer using SNMP
    const oids = Object.values(PRINTER_OIDS);
    const snmpResponse = await simulateSNMPQuery(ipAddress, oids);
    
    // Map SNMP response to printer data format
    const printerData = mapSNMPResponseToPrinterData(snmpResponse, ipAddress, printerName);
    
    // Update printer in database if printerId is provided
    if (printerId) {
      const { data, error } = await supabase
        .from('printers')
        .update({
          model: printerData.model,
          status: printerData.status,
          ink_level: printerData.inkLevel,
          paper_level: printerData.paperLevel,
          job_count: printerData.jobCount,
          serial_number: printerData.serialNumber,
          last_active: new Date().toISOString()
        })
        .eq('id', printerId)
        .select('*')
        .single();
        
      if (error) {
        throw error;
      }
      
      // Log an activity for the printer update
      await supabase.from('printer_activities').insert({
        printer_id: printerId,
        printer_name: printerName,
        action: 'Data Updated via SNMP',
        details: `Printer data refreshed automatically`,
        status: 'success',
        timestamp: new Date().toISOString()
      });
      
      // Return updated printer data
      return new Response(JSON.stringify({ success: true, data: printerData }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } 
    
    // If no printerId, just return the data without updating database
    return new Response(JSON.stringify({ success: true, data: printerData }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error in printer-monitor function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to communicate with printer' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
