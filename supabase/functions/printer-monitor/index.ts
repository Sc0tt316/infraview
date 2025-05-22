
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
  TOTAL_PAGES: '1.3.6.1.4.1.11.2.3.9.4.2.1.4.1.2.5', // HP-specific total pages
  MONTHLY_PRINTED: '1.3.6.1.2.1.43.10.2.1.5.1.1', // Monthly page count
  MONTHLY_PAGES: '1.3.6.1.4.1.11.2.3.9.4.2.1.4.1.2.6', // HP-specific monthly pages
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
async function queryPrinter(ipAddress: string, oids: string[]): Promise<Record<string, any>> {
  // This function would be replaced with actual SNMP library code in production
  console.log(`Querying printer at ${ipAddress} for OIDs: ${oids.join(', ')}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Randomly determine if printer is online (90% chance)
  const isOnline = Math.random() < 0.9;
  
  if (!isOnline) {
    throw new Error('Printer is offline or not responding');
  }
  
  // Generate realistic printer data based on IP address
  // Using the last octet of IP as a "seed" for deterministic but different values
  const ipSeed = parseInt(ipAddress.split('.').pop() || '0', 10);
  const seed = (n: number) => ((ipSeed * 13 + n * 17) % 100); // Simple hash function for deterministic values
  
  // Determine if it's a color printer (using IP address last octet to make it deterministic)
  const isColorPrinter = (ipSeed % 2 === 0); // Even IP = color printer
  
  // Determine manufacturer based on IP address
  const manufacturers = ['HP', 'Epson', 'Canon', 'Brother', 'Xerox', 'Lexmark'];
  const manufacturer = manufacturers[ipSeed % manufacturers.length];
  
  // Generate model string based on manufacturer
  let modelName = '';
  switch (manufacturer) {
    case 'HP':
      modelName = `HP LaserJet ${isColorPrinter ? 'Color ' : ''}Pro M${4 + (ipSeed % 5)}${ipSeed % 100}`;
      break;
    case 'Epson':
      modelName = `Epson WorkForce Pro WF-${isColorPrinter ? 'C' : ''}${4 + (ipSeed % 5)}${ipSeed % 900}`;
      break;
    case 'Canon':
      modelName = `Canon ${isColorPrinter ? 'PIXMA' : 'MAXIFY'} ${isColorPrinter ? 'TS' : 'MB'}${5 + (ipSeed % 5)}${ipSeed % 100}`;
      break;
    case 'Brother':
      modelName = `Brother ${isColorPrinter ? 'MFC-L8' : 'HL-L6'}${9 - (ipSeed % 5)}${ipSeed % 100}CDW`;
      break;
    case 'Xerox':
      modelName = `Xerox VersaLink ${isColorPrinter ? 'C' : 'B'}${4 + (ipSeed % 5)}${ipSeed % 100}`;
      break;
    case 'Lexmark':
      modelName = `Lexmark ${isColorPrinter ? 'MC' : 'MS'}${3 + (ipSeed % 5)}${ipSeed % 200}i`;
      break;
    default:
      modelName = `Generic Printer ${ipSeed}`;
  }
  
  // Calculate printer status (mostly online/idle with occasional issues)
  let printerStatusCode: number;
  const statusRoll = Math.random() * 100;
  if (statusRoll < 80) {
    printerStatusCode = 3; // idle - most common
  } else if (statusRoll < 85) {
    printerStatusCode = 4; // printing
  } else if (statusRoll < 90) {
    printerStatusCode = 5; // warmup
  } else if (statusRoll < 95) {
    printerStatusCode = 6; // stopped
  } else if (statusRoll < 98) {
    printerStatusCode = 8; // error
  } else {
    printerStatusCode = 9; // maintenance
  }
  
  // Determine sub-status based on status code
  let subStatus = PRINTER_STATUS[printerStatusCode] || 'idle';
  
  // Add more detail to the sub-status
  if (printerStatusCode === 3) subStatus = 'idle';
  else if (printerStatusCode === 4) subStatus = 'printing job';
  else if (printerStatusCode === 5) subStatus = 'warming up';
  else if (printerStatusCode === 6) {
    const stopReasons = ['out of paper', 'door open', 'user intervention required'];
    subStatus = stopReasons[ipSeed % stopReasons.length];
  }
  else if (printerStatusCode === 8) {
    const errorReasons = ['paper jam', 'out of toner', 'hardware error'];
    subStatus = errorReasons[ipSeed % errorReasons.length];
  }
  else if (printerStatusCode === 9) subStatus = 'scheduled maintenance required';
  
  // Calculate toner levels - for consistent values, use the IP seed
  const blackLevel = Math.max(10, (seed(1) + ipSeed) % 101); // Min 10%
  
  // Job statistics - make them dependent on IP for consistency
  const totalPrinted = 1000 + (ipSeed * 37) % 10000;
  const monthlyPrinted = (ipSeed * 13) % 500;
  const weeklyPrinted = Math.floor(monthlyPrinted / 4);
  const dailyPrinted = Math.floor(weeklyPrinted / 7);
  const paperJams = ipSeed % 10;
  
  // Paper level - somewhat random but tied to IP
  const paperLevel = Math.max(5, (seed(7) + ipSeed * 3) % 101); // Min 5%
  
  // Create the response object
  const response: Record<string, any> = {
    [PRINTER_OIDS.MODEL]: modelName,
    [PRINTER_OIDS.SERIAL]: `SN-${manufacturer.substring(0,1)}${ipSeed * 1000 + 10000}`,
    [PRINTER_OIDS.STATUS]: printerStatusCode,
    [PRINTER_OIDS.SUB_STATUS]: subStatus,
    [PRINTER_OIDS.DEVICE_NAME]: `${manufacturer}-Printer-${ipAddress.split('.').pop()}`,
    [PRINTER_OIDS.BLACK_LEVEL]: blackLevel,
    [PRINTER_OIDS.PAPER_LEVEL]: paperLevel,
    [PRINTER_OIDS.PAPER_JAMS]: paperJams,
    [PRINTER_OIDS.TOTAL_PRINTED]: totalPrinted,
    [PRINTER_OIDS.TOTAL_PAGES]: totalPrinted,
    [PRINTER_OIDS.MONTHLY_PRINTED]: monthlyPrinted,
    [PRINTER_OIDS.MONTHLY_PAGES]: monthlyPrinted,
  };
  
  // Add color-specific data only for color printers
  if (isColorPrinter) {
    response[PRINTER_OIDS.CYAN_LEVEL] = Math.max(10, (seed(2) + ipSeed * 2) % 101);
    response[PRINTER_OIDS.MAGENTA_LEVEL] = Math.max(10, (seed(3) + ipSeed * 4) % 101);
    response[PRINTER_OIDS.YELLOW_LEVEL] = Math.max(10, (seed(4) + ipSeed * 6) % 101);
  }
  
  return response;
}

// Function to map SNMP response to printer data object
function mapSNMPResponseToPrinterData(snmpData: Record<string, any>, ipAddress: string, printerName: string): any {
  console.log("Mapping SNMP data to printer object:", snmpData);
  
  // Map the raw SNMP data to our printer data structure
  const statusCode = snmpData[PRINTER_OIDS.STATUS];
  const subStatus = snmpData[PRINTER_OIDS.SUB_STATUS] || 'idle';
  
  // Convert status code to our application's status format
  let appStatus: 'online' | 'offline' | 'error' | 'warning' | 'maintenance' = 'online';
  if (statusCode === 8) appStatus = 'error';
  else if (statusCode === 6 || statusCode === 7) appStatus = 'offline';
  else if (statusCode === 5) appStatus = 'warning';
  else if (statusCode === 9) appStatus = 'maintenance';
  
  // Calculate overall ink level as average of all cartridges
  const blackLevel = snmpData[PRINTER_OIDS.BLACK_LEVEL] || 0;
  const cyanLevel = snmpData[PRINTER_OIDS.CYAN_LEVEL];
  const magentaLevel = snmpData[PRINTER_OIDS.MAGENTA_LEVEL];
  const yellowLevel = snmpData[PRINTER_OIDS.YELLOW_LEVEL];
  
  // For monochrome printers, only use black level
  const isColorPrinter = cyanLevel !== undefined || magentaLevel !== undefined || yellowLevel !== undefined;
  const inkLevel = isColorPrinter
    ? Math.floor((blackLevel + (cyanLevel || 0) + (magentaLevel || 0) + (yellowLevel || 0)) / (1 + (cyanLevel !== undefined ? 1 : 0) + (magentaLevel !== undefined ? 1 : 0) + (yellowLevel !== undefined ? 1 : 0)))
    : blackLevel;
  
  // Get printer usage statistics
  const totalPrinted = snmpData[PRINTER_OIDS.TOTAL_PRINTED] || snmpData[PRINTER_OIDS.TOTAL_PAGES] || 0;
  const monthlyPrinted = snmpData[PRINTER_OIDS.MONTHLY_PRINTED] || snmpData[PRINTER_OIDS.MONTHLY_PAGES] || 0;
  const weeklyPrinted = Math.floor(monthlyPrinted / 4); // Estimate
  const dailyPrinted = Math.floor(weeklyPrinted / 7);   // Estimate
  const paperJams = snmpData[PRINTER_OIDS.PAPER_JAMS] || 0;
  
  console.log("Creating supplies object with:", { blackLevel, cyanLevel, magentaLevel, yellowLevel });
  
  // Create the supplies object based on detected levels
  let supplies = {
    black: blackLevel
  };
  
  if (cyanLevel !== undefined) supplies = { ...supplies, cyan: cyanLevel };
  if (magentaLevel !== undefined) supplies = { ...supplies, magenta: magentaLevel };
  if (yellowLevel !== undefined) supplies = { ...supplies, yellow: yellowLevel };
  
  console.log("Final supplies object:", supplies);
    
  return {
    name: printerName || snmpData[PRINTER_OIDS.DEVICE_NAME],
    model: snmpData[PRINTER_OIDS.MODEL],
    location: '', // Location might need to be set manually
    status: appStatus,
    subStatus: subStatus,
    inkLevel,
    paperLevel: snmpData[PRINTER_OIDS.PAPER_LEVEL],
    jobCount: totalPrinted,
    ipAddress,
    serialNumber: snmpData[PRINTER_OIDS.SERIAL],
    supplies,
    stats: {
      dailyPrints: dailyPrinted,
      weeklyPrints: weeklyPrinted,
      monthlyPrints: monthlyPrinted,
      totalPrints: totalPrinted,
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
    
    console.log("Received request:", { ipAddress, printerId, printerName, action });
    
    // Handle discovery action
    if (action === 'discover') {
      console.log("Performing printer discovery");
      
      // This would be replaced with actual network scanning in production
      // For now, generate some sample printers in the common ranges
      const discoveredPrinters = [];
      
      // Generate printers in common IP ranges
      const commonRanges = [
        { prefix: '192.168.1.', start: 100, end: 110 },
        { prefix: '10.0.0.', start: 50, end: 60 },
        { prefix: '172.16.0.', start: 200, end: 210 }
      ];
      
      for (const range of commonRanges) {
        for (let i = range.start; i < range.end; i++) {
          const ip = `${range.prefix}${i}`;
          try {
            // Use our query function to generate consistent data for each IP
            const oids = [PRINTER_OIDS.MODEL, PRINTER_OIDS.DEVICE_NAME];
            const data = await queryPrinter(ip, oids);
            
            discoveredPrinters.push({
              ipAddress: ip,
              name: data[PRINTER_OIDS.DEVICE_NAME] || `Printer-${i}`,
              model: data[PRINTER_OIDS.MODEL] || 'Unknown Model'
            });
          } catch (error) {
            // Skip printers that don't respond
            continue;
          }
        }
      }
      
      console.log(`Discovered ${discoveredPrinters.length} printers`);
      
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
    
    console.log(`Polling printer at ${ipAddress}`);
    
    // Query all OIDs from the printer using SNMP
    const oids = Object.values(PRINTER_OIDS);
    const snmpResponse = await queryPrinter(ipAddress, oids);
    
    // Map SNMP response to printer data format
    const printerData = mapSNMPResponseToPrinterData(snmpResponse, ipAddress, printerName);
    
    // Update printer in database if printerId is provided
    if (printerId) {
      console.log(`Updating printer ${printerId} in database`);
      
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
        console.error("Error updating printer:", error);
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
