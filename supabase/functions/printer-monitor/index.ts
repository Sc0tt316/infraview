
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Comprehensive SNMP OID mappings for different printer manufacturers
const PRINTER_OIDS = {
  // Standard RFC 3805 Printer MIB OIDs
  DEVICE_TYPE: '1.3.6.1.2.1.25.3.2.1.2.1',
  DEVICE_DESCR: '1.3.6.1.2.1.25.3.2.1.3.1',
  DEVICE_STATUS: '1.3.6.1.2.1.25.3.5.1.1.1',
  DEVICE_ERRORS: '1.3.6.1.2.1.25.3.5.1.2.1',
  
  // System Information
  SYS_NAME: '1.3.6.1.2.1.1.5.0',
  SYS_DESCR: '1.3.6.1.2.1.1.1.0',
  SYS_CONTACT: '1.3.6.1.2.1.1.4.0',
  SYS_LOCATION: '1.3.6.1.2.1.1.6.0',
  
  // Printer-specific OIDs
  PRINTER_STATUS: '1.3.6.1.2.1.25.3.5.1.1.1',
  PRINTER_DETAILED_STATUS: '1.3.6.1.2.1.25.3.5.1.2.1',
  
  // Supply levels (toner/ink)
  SUPPLY_LEVEL: '1.3.6.1.2.1.43.11.1.1.9.1',
  SUPPLY_MAX_CAPACITY: '1.3.6.1.2.1.43.11.1.1.8.1',
  SUPPLY_TYPE: '1.3.6.1.2.1.43.11.1.1.3.1',
  SUPPLY_UNIT: '1.3.6.1.2.1.43.11.1.1.7.1',
  SUPPLY_COLOR: '1.3.6.1.2.1.43.12.1.1.4.1',
  
  // Paper handling
  INPUT_CAPACITY_UNIT: '1.3.6.1.2.1.43.8.2.1.9.1',
  INPUT_MAX_CAPACITY: '1.3.6.1.2.1.43.8.2.1.3.1',
  INPUT_CURRENT_LEVEL: '1.3.6.1.2.1.43.8.2.1.10.1',
  
  // Page counts
  TOTAL_PAGES: '1.3.6.1.2.1.43.10.2.1.4.1.1',
  TOTAL_IMPRESSIONS: '1.3.6.1.2.1.43.10.2.1.5.1.1',
  
  // Manufacturer-specific OIDs
  HP: {
    SERIAL_NUMBER: '1.3.6.1.4.1.11.2.3.9.4.2.1.1.3.3.0',
    DEVICE_ID: '1.3.6.1.4.1.11.2.3.9.4.2.1.1.3.1.0',
    CONSUMABLE_STATUS: '1.3.6.1.4.1.11.2.3.9.4.2.1.1.2.1.0',
    PAGE_COUNT: '1.3.6.1.4.1.11.2.3.9.4.2.1.4.1.2.5.0',
    TONER_REMAINING: '1.3.6.1.4.1.11.2.3.9.4.2.1.1.2.6.1',
  },
  CANON: {
    SERIAL_NUMBER: '1.3.6.1.4.1.1602.1.1.1.1.0',
    MODEL_NAME: '1.3.6.1.4.1.1602.1.2.1.1.0',
    COUNTER_TOTAL: '1.3.6.1.4.1.1602.1.11.1.3.1.4',
  },
  EPSON: {
    SERIAL_NUMBER: '1.3.6.1.4.1.1248.1.1.3.1.3.8.1.1.2.1',
    INK_LEVEL: '1.3.6.1.4.1.1248.1.2.2.1.1.1.4.1',
  },
  BROTHER: {
    SERIAL_NUMBER: '1.3.6.1.4.1.2435.2.3.9.4.2.1.5.5.1.0',
    PAGE_COUNTER: '1.3.6.1.4.1.2435.2.3.9.4.2.1.5.5.10.0',
    TONER_REMAINING: '1.3.6.1.4.1.2435.2.4.3.2435.5.13.3.0',
  },
  XEROX: {
    SERIAL_NUMBER: '1.3.6.1.4.1.253.8.53.3.2.1.3.1.20.0',
    USAGE_COUNTER: '1.3.6.1.4.1.253.8.53.13.2.1.6.1.20.1',
  },
  LEXMARK: {
    SERIAL_NUMBER: '1.3.6.1.4.1.641.2.1.2.1.3.1',
    PAGE_COUNT: '1.3.6.1.4.1.641.2.1.2.1.6.1.1.20',
  }
};

// Status mappings based on RFC 3805
const PRINTER_STATUS_CODES = {
  1: { status: 'other', description: 'Other' },
  2: { status: 'unknown', description: 'Unknown' },
  3: { status: 'idle', description: 'Ready' },
  4: { status: 'printing', description: 'Processing job' },
  5: { status: 'warmup', description: 'Warming up' },
  6: { status: 'stopped', description: 'Stopped printing' },
  7: { status: 'offline', description: 'Offline' },
  8: { status: 'error', description: 'Error condition' },
  9: { status: 'maintenance', description: 'Maintenance required' }
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Performs real SNMP communication with external service
 */
async function performRealSNMP(ipAddress: string, oids: string[]): Promise<Record<string, any> | null> {
  try {
    // Option 1: Try HTTP-based SNMP service (if available)
    const snmpServiceUrl = Deno.env.get('SNMP_SERVICE_URL');
    if (snmpServiceUrl) {
      console.log(`Attempting real SNMP via service: ${snmpServiceUrl}`);
      
      const response = await fetch(`${snmpServiceUrl}/snmp/walk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SNMP_SERVICE_KEY') || ''}`
        },
        body: JSON.stringify({
          host: ipAddress,
          community: 'public',
          oids: oids,
          version: '2c',
          timeout: 5000
        }),
        signal: AbortSignal.timeout(10000)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Real SNMP successful for ${ipAddress}:`, data);
        return data.values || data;
      } else {
        console.error(`SNMP service returned error: ${response.status}`);
        throw new Error(`SNMP service error: ${response.status}`);
      }
    }
    
    // Option 2: Try direct SNMP using net-snmp compatible service
    const directSnmpUrl = Deno.env.get('DIRECT_SNMP_URL');
    if (directSnmpUrl) {
      console.log(`Attempting direct SNMP: ${directSnmpUrl}`);
      
      const response = await fetch(directSnmpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get',
          host: ipAddress,
          community: 'public',
          oids: oids
        }),
        signal: AbortSignal.timeout(8000)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Direct SNMP successful for ${ipAddress}:`, data);
        return data;
      } else {
        console.error(`Direct SNMP returned error: ${response.status}`);
        throw new Error(`Direct SNMP error: ${response.status}`);
      }
    }
    
    // If no SNMP services are configured, throw error
    throw new Error('No SNMP service configured. Please set SNMP_SERVICE_URL or DIRECT_SNMP_URL environment variables.');
    
  } catch (error) {
    console.error(`Real SNMP failed for ${ipAddress}:`, error.message);
    throw error;
  }
}

/**
 * Main SNMP query function with real communication only
 */
async function queryPrinter(ipAddress: string, oids: string[]): Promise<Record<string, any>> {
  console.log(`Querying printer at ${ipAddress} for ${oids.length} OIDs`);
  
  // Only attempt real SNMP communication - no fallback
  const result = await performRealSNMP(ipAddress, oids);
  if (!result) {
    throw new Error(`Failed to retrieve SNMP data from ${ipAddress}`);
  }
  
  console.log(`Successfully retrieved real SNMP data from ${ipAddress}`);
  return result;
}

/**
 * Maps SNMP response to application data format
 */
function mapSNMPToPrinterData(snmpData: Record<string, any>, ipAddress: string, printerName: string): any {
  console.log("Mapping SNMP data:", Object.keys(snmpData));
  
  // Extract basic information
  const deviceDescription = snmpData[PRINTER_OIDS.SYS_DESCR] || snmpData[PRINTER_OIDS.DEVICE_DESCR] || 'Unknown Printer';
  const systemName = snmpData[PRINTER_OIDS.SYS_NAME] || printerName;
  const statusCode = snmpData[PRINTER_OIDS.PRINTER_STATUS] || 3;
  const detailedStatus = snmpData[PRINTER_OIDS.PRINTER_DETAILED_STATUS] || 'Ready';
  
  // Map status to application format
  const statusInfo = PRINTER_STATUS_CODES[statusCode] || PRINTER_STATUS_CODES[3];
  let appStatus: 'online' | 'offline' | 'error' | 'warning' | 'maintenance' = 'online';
  
  switch (statusCode) {
    case 7: appStatus = 'offline'; break;
    case 8: appStatus = 'error'; break;
    case 9: appStatus = 'maintenance'; break;
    case 5: appStatus = 'warning'; break; // warming up
    default: appStatus = 'online';
  }
  
  // Extract supplies information
  const supplies: Record<string, number> = {};
  let totalInkLevel = 0;
  let inkCount = 0;
  
  Object.entries(snmpData).forEach(([oid, value]) => {
    if (oid.startsWith(PRINTER_OIDS.SUPPLY_LEVEL)) {
      const supplyType = snmpData[oid.replace(PRINTER_OIDS.SUPPLY_LEVEL, PRINTER_OIDS.SUPPLY_TYPE)] || 'unknown';
      const level = typeof value === 'number' ? value : parseInt(value as string) || 0;
      
      if (typeof supplyType === 'string') {
        supplies[supplyType.toLowerCase()] = level;
        totalInkLevel += level;
        inkCount++;
      }
    }
  });
  
  // Calculate overall ink level
  const inkLevel = inkCount > 0 ? Math.floor(totalInkLevel / inkCount) : 0;
  
  // Extract paper information
  const paperLevel = snmpData[`${PRINTER_OIDS.INPUT_CURRENT_LEVEL}.1`] || 0;
  
  // Extract page counts
  const totalPages = snmpData[PRINTER_OIDS.TOTAL_PAGES] || snmpData[PRINTER_OIDS.TOTAL_IMPRESSIONS] || 0;
  
  // Extract serial number (try different manufacturer-specific OIDs)
  let serialNumber = 'Unknown';
  Object.values(PRINTER_OIDS).forEach(manufacturerOids => {
    if (typeof manufacturerOids === 'object' && manufacturerOids.SERIAL_NUMBER) {
      if (snmpData[manufacturerOids.SERIAL_NUMBER]) {
        serialNumber = snmpData[manufacturerOids.SERIAL_NUMBER];
      }
    }
  });
  
  // Generate statistics based on actual data
  const monthlyPrints = Math.floor(totalPages * 0.1) || 0;
  const weeklyPrints = Math.floor(monthlyPrints / 4);
  const dailyPrints = Math.floor(weeklyPrints / 7);
  
  return {
    name: printerName || systemName,
    model: deviceDescription,
    location: '', // This needs to be set manually or from network discovery
    status: appStatus,
    subStatus: detailedStatus,
    inkLevel,
    paperLevel: typeof paperLevel === 'number' ? paperLevel : parseInt(paperLevel) || 0,
    jobCount: totalPages,
    ipAddress,
    serialNumber,
    supplies,
    stats: {
      dailyPrints,
      weeklyPrints,
      monthlyPrints,
      totalPrints: totalPages,
      jams: 0 // Would need specific OID for jam count
    }
  };
}

/**
 * Network discovery with real SNMP only
 */
async function discoverPrinters(): Promise<Array<{ipAddress: string, name: string, model: string}>> {
  console.log("Starting real SNMP printer discovery...");
  
  const discoveredPrinters = [];
  
  // Discovery ranges to scan
  const discoveryMethods = [
    { name: 'SNMP Broadcast', range: '192.168.1', start: 100, end: 120 },
    { name: 'Common Office Range', range: '10.0.0', start: 50, end: 70 },
    { name: 'Corporate Range', range: '172.16.0', start: 200, end: 220 },
    { name: 'Extended Range', range: '192.168.0', start: 150, end: 170 }
  ];
  
  for (const method of discoveryMethods) {
    console.log(`Trying discovery method: ${method.name}`);
    
    for (let i = method.start; i < method.end; i++) {
      const ip = `${method.range}.${i}`;
      
      try {
        // Quick SNMP probe with real communication only
        const probeOids = [PRINTER_OIDS.SYS_DESCR, PRINTER_OIDS.DEVICE_TYPE];
        const result = await queryPrinter(ip, probeOids);
        
        if (result && result[PRINTER_OIDS.SYS_DESCR]) {
          const deviceDesc = result[PRINTER_OIDS.SYS_DESCR];
          const deviceName = result[PRINTER_OIDS.SYS_NAME] || `Printer-${i}`;
          
          // Check if it's actually a printer
          if (deviceDesc.toLowerCase().includes('printer') || 
              deviceDesc.toLowerCase().includes('laserjet') ||
              deviceDesc.toLowerCase().includes('pixma') ||
              deviceDesc.toLowerCase().includes('workforce')) {
            
            discoveredPrinters.push({
              ipAddress: ip,
              name: deviceName,
              model: deviceDesc
            });
            
            console.log(`Discovered printer: ${deviceName} at ${ip}`);
          }
        }
      } catch (error) {
        // Skip unreachable IPs - this is expected for most IPs
        continue;
      }
    }
  }
  
  console.log(`Discovery complete. Found ${discoveredPrinters.length} printers`);
  return discoveredPrinters;
}

// Main handler
serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const reqBody = await req.json();
    const { ipAddress, printerId, printerName, action } = reqBody;
    
    console.log("Processing request:", { ipAddress, printerId, printerName, action });
    
    // Handle discovery
    if (action === 'discover') {
      try {
        const discoveredPrinters = await discoverPrinters();
        return new Response(JSON.stringify({ 
          success: true, 
          printers: discoveredPrinters 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Discovery failed:', error);
        return new Response(JSON.stringify({ 
          success: false,
          error: 'SNMP discovery failed',
          details: error.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Handle single printer polling
    if (!ipAddress) {
      return new Response(JSON.stringify({ error: 'IP address is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`Polling printer at ${ipAddress} using real SNMP only`);
    
    // Query all relevant OIDs
    const allOids = [
      ...Object.values(PRINTER_OIDS).filter(oid => typeof oid === 'string'),
      ...Object.values(PRINTER_OIDS.HP),
      ...Object.values(PRINTER_OIDS.CANON),
      ...Object.values(PRINTER_OIDS.EPSON),
      ...Object.values(PRINTER_OIDS.BROTHER),
      ...Object.values(PRINTER_OIDS.XEROX),
      ...Object.values(PRINTER_OIDS.LEXMARK)
    ];
    
    try {
      const snmpResponse = await queryPrinter(ipAddress, allOids);
      const printerData = mapSNMPToPrinterData(snmpResponse, ipAddress, printerName);
      
      // Update database if printerId provided
      if (printerId) {
        console.log(`Updating printer ${printerId} in database`);
        
        const { data, error } = await supabase
          .from('printers')
          .update({
            model: printerData.model,
            status: printerData.status,
            sub_status: printerData.subStatus,
            ink_level: printerData.inkLevel,
            paper_level: printerData.paperLevel,
            job_count: printerData.jobCount,
            serial_number: printerData.serialNumber,
            supplies: printerData.supplies,
            stats: printerData.stats,
            last_active: new Date().toISOString()
          })
          .eq('id', printerId)
          .select();
          
        if (error) {
          console.error("Database update error:", error);
          throw error;
        }
        
        // Log activity
        await supabase.from('printer_activities').insert({
          printer_id: printerId,
          printer_name: printerName,
          action: 'SNMP Data Updated',
          details: `Real SNMP data retrieved from ${ipAddress}`,
          status: 'success',
          timestamp: new Date().toISOString()
        });
        
        console.log(`Successfully updated printer ${printerId}`);
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: printerData,
        method: 'real_snmp'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('SNMP communication failed:', error);
      
      // Log failed attempt
      if (printerId) {
        await supabase.from('printer_activities').insert({
          printer_id: printerId,
          printer_name: printerName,
          action: 'SNMP Poll Failed',
          details: `Real SNMP communication failed: ${error.message}`,
          status: 'error',
          timestamp: new Date().toISOString()
        });
      }
      
      return new Response(JSON.stringify({ 
        success: false,
        error: 'SNMP communication failed',
        details: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    console.error('Error in printer-monitor function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to communicate with printer',
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
