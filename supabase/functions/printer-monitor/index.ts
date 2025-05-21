
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// SNMP OIDs for common printer data points
const PRINTER_OIDS = {
  MODEL: '1.3.6.1.2.1.25.3.2.1.3.1',            // Model/description
  SERIAL: '1.3.6.1.2.1.43.5.1.1.17.1',          // Serial number
  STATUS: '1.3.6.1.2.1.25.3.5.1.1.1',           // Printer status
  DEVICE_NAME: '1.3.6.1.2.1.1.5.0',             // Device name
  BLACK_LEVEL: '1.3.6.1.2.1.43.11.1.1.9.1.1',   // Black toner/ink level
  CYAN_LEVEL: '1.3.6.1.2.1.43.11.1.1.9.1.2',    // Cyan toner/ink level (for color printers)
  MAGENTA_LEVEL: '1.3.6.1.2.1.43.11.1.1.9.1.3', // Magenta toner/ink level (for color printers) 
  YELLOW_LEVEL: '1.3.6.1.2.1.43.11.1.1.9.1.4',  // Yellow toner/ink level (for color printers)
  PAPER_LEVEL: '1.3.6.1.2.1.43.8.2.1.10.1.1',   // Paper level in tray
  PAPER_JAMS: '1.3.6.1.2.1.43.18.1.1.8.1.1',    // Paper jam counter
  TOTAL_PRINTED: '1.3.6.1.2.1.43.10.2.1.4.1.1', // Total pages printed
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
  
  // Simulate random but realistic job count
  const jobCount = Math.floor(Math.random() * 5000);
  
  // Simulate printer status (mostly online with occasional issues)
  const statusCode = Math.random() < 0.9 ? 3 : [5, 6, 8][Math.floor(Math.random() * 3)];
  
  return {
    [PRINTER_OIDS.MODEL]: randomPrinterModel(),
    [PRINTER_OIDS.SERIAL]: `SN-${Math.floor(Math.random() * 1000000)}`,
    [PRINTER_OIDS.STATUS]: statusCode,
    [PRINTER_OIDS.DEVICE_NAME]: `Printer-${ipAddress.split('.').pop()}`,
    [PRINTER_OIDS.BLACK_LEVEL]: randomSupplyLevel(),
    [PRINTER_OIDS.CYAN_LEVEL]: randomSupplyLevel(),
    [PRINTER_OIDS.MAGENTA_LEVEL]: randomSupplyLevel(),
    [PRINTER_OIDS.YELLOW_LEVEL]: randomSupplyLevel(),
    [PRINTER_OIDS.PAPER_LEVEL]: randomSupplyLevel(),
    [PRINTER_OIDS.PAPER_JAMS]: Math.floor(Math.random() * 10),
    [PRINTER_OIDS.TOTAL_PRINTED]: jobCount,
  };
}

// Function to map SNMP response to printer data object
function mapSNMPResponseToPrinterData(snmpData: Record<string, any>, ipAddress: string, printerName: string): any {
  // Map the raw SNMP data to our printer data structure
  const status = snmpData[PRINTER_OIDS.STATUS];
  
  // Convert status code to our application's status format
  let appStatus = 'online';
  if (status === 8) appStatus = 'error';
  else if (status === 6 || status === 7) appStatus = 'offline';
  else if (status === 5) appStatus = 'warning';
  else if (status === 9) appStatus = 'maintenance';
  
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
    
  return {
    name: printerName,
    model: snmpData[PRINTER_OIDS.MODEL],
    location: '', // Location might need to be set manually
    status: appStatus,
    inkLevel,
    paperLevel: snmpData[PRINTER_OIDS.PAPER_LEVEL],
    jobCount: snmpData[PRINTER_OIDS.TOTAL_PRINTED],
    ipAddress,
    serialNumber: snmpData[PRINTER_OIDS.SERIAL],
    supplies: {
      black: blackLevel,
      cyan: isColorPrinter ? cyanLevel : null,
      magenta: isColorPrinter ? magentaLevel : null,
      yellow: isColorPrinter ? yellowLevel : null,
    },
    stats: {
      dailyPrints: 0, // Would need historical data to calculate
      weeklyPrints: 0,
      monthlyPrints: 0,
      totalPrints: snmpData[PRINTER_OIDS.TOTAL_PRINTED],
      jams: snmpData[PRINTER_OIDS.PAPER_JAMS]
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
    const { ipAddress, printerId, printerName } = await req.json();
    
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
