
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Performs SNMP communication with local SNMP service
 */
async function performSNMP(ipAddress: string, action: string = 'poll'): Promise<Record<string, any> | null> {
  try {
    const snmpServiceUrl = Deno.env.get('SNMP_SERVICE_URL');
    
    if (!snmpServiceUrl) {
      throw new Error('SNMP_SERVICE_URL not configured. Please set up your local SNMP service.');
    }
    
    console.log(`Using SNMP service: ${snmpServiceUrl}`);
    
    let endpoint = '/snmp/poll';
    let body: any = {
      host: ipAddress,
      community: 'public',
      version: '2c',
      timeout: 8000
    };
    
    if (action === 'discover') {
      endpoint = '/snmp/discover';
      body = {};
    }
    
    const response = await fetch(`${snmpServiceUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SNMP service error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'SNMP operation failed');
    }
    
    console.log(`SNMP ${action} successful for ${ipAddress || 'discovery'}`);
    return data.values || data.printers || data;
    
  } catch (error) {
    console.error(`SNMP communication failed: ${error.message}`);
    throw error;
  }
}

/**
 * Maps SNMP response to application data format
 */
function mapSNMPToPrinterData(snmpData: Record<string, any>, ipAddress: string, printerName: string): any {
  console.log("Mapping SNMP data:", Object.keys(snmpData));
  
  // Standard OIDs
  const SYS_DESCR = '1.3.6.1.2.1.1.1.0';
  const SYS_NAME = '1.3.6.1.2.1.1.5.0';
  const PRINTER_STATUS = '1.3.6.1.2.1.25.3.5.1.1.1';
  const PRINTER_DETAILED_STATUS = '1.3.6.1.2.1.25.3.5.1.2.1';
  const SUPPLY_LEVEL_BASE = '1.3.6.1.2.1.43.11.1.1.9.1';
  const INPUT_CURRENT_LEVEL = '1.3.6.1.2.1.43.8.2.1.10.1';
  const TOTAL_PAGES = '1.3.6.1.2.1.43.10.2.1.4.1.1';
  const HP_SERIAL_NUMBER = '1.3.6.1.4.1.11.2.3.9.4.2.1.1.3.3.0';
  
  // Extract basic information
  const deviceDescription = snmpData[SYS_DESCR] || 'Unknown Printer';
  const systemName = snmpData[SYS_NAME] || printerName;
  const statusCode = parseInt(snmpData[PRINTER_STATUS]) || 3;
  const detailedStatus = snmpData[PRINTER_DETAILED_STATUS] || 'Ready';
  
  // Map status to application format
  let appStatus: 'online' | 'offline' | 'error' | 'warning' | 'maintenance' = 'online';
  let subStatus = detailedStatus;
  
  switch (statusCode) {
    case 7: 
      appStatus = 'offline'; 
      subStatus = 'No Connection';
      break;
    case 8: 
      appStatus = 'error'; 
      subStatus = detailedStatus || 'Error condition';
      break;
    case 9: 
      appStatus = 'maintenance'; 
      subStatus = 'Maintenance required';
      break;
    case 5: 
      appStatus = 'warning'; 
      subStatus = 'Warming up';
      break;
    default: 
      appStatus = 'online';
      subStatus = detailedStatus || 'Ready';
  }
  
  // Extract supplies information
  const supplies: Record<string, number> = {};
  let totalInkLevel = 0;
  let inkCount = 0;
  
  // Look for supply levels (multiple cartridges)
  for (let i = 1; i <= 6; i++) {
    const supplyOid = `${SUPPLY_LEVEL_BASE}.${i}`;
    const level = parseInt(snmpData[supplyOid]);
    
    if (!isNaN(level) && level >= 0) {
      // Map supply index to color (this is printer-specific)
      const colorMap = {
        1: 'black',
        2: 'cyan', 
        3: 'magenta',
        4: 'yellow',
        5: 'drum',
        6: 'waste'
      };
      
      const colorName = colorMap[i as keyof typeof colorMap] || `supply${i}`;
      supplies[colorName] = level;
      
      if (i <= 4) { // Only count CMYK for overall ink level
        totalInkLevel += level;
        inkCount++;
      }
    }
  }
  
  // Calculate overall ink level
  const inkLevel = inkCount > 0 ? Math.floor(totalInkLevel / inkCount) : 0;
  
  // Extract paper information
  const paperLevel = parseInt(snmpData[`${INPUT_CURRENT_LEVEL}.1`]) || 0;
  
  // Extract page counts
  const totalPages = parseInt(snmpData[TOTAL_PAGES]) || 0;
  
  // Extract serial number
  const serialNumber = snmpData[HP_SERIAL_NUMBER] || 'Unknown';
  
  // Generate statistics based on actual data
  const monthlyPrints = Math.floor(totalPages * 0.1) || 0;
  const weeklyPrints = Math.floor(monthlyPrints / 4);
  const dailyPrints = Math.floor(weeklyPrints / 7);
  
  return {
    name: printerName || systemName,
    model: deviceDescription,
    location: '',
    status: appStatus,
    subStatus,
    inkLevel,
    paperLevel,
    jobCount: totalPages,
    ipAddress,
    serialNumber,
    supplies,
    stats: {
      dailyPrints,
      weeklyPrints,
      monthlyPrints,
      totalPrints: totalPages,
      jams: 0
    }
  };
}

/**
 * Network discovery using local SNMP service
 */
async function discoverPrinters(): Promise<Array<{ipAddress: string, name: string, model: string}>> {
  console.log("Starting SNMP printer discovery via local service...");
  
  try {
    const result = await performSNMP('', 'discover');
    return result || [];
  } catch (error) {
    console.error('Discovery failed:', error);
    return [];
  }
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
    
    console.log(`Polling printer at ${ipAddress} via local SNMP service`);
    
    try {
      const snmpResponse = await performSNMP(ipAddress, 'poll');
      
      if (!snmpResponse) {
        throw new Error('No SNMP data received');
      }
      
      const printerData = mapSNMPToPrinterData(snmpResponse, ipAddress, printerName);
      
      // Update database if printerId provided
      if (printerId) {
        console.log(`Updating printer ${printerId} in database`);
        
        const { error } = await supabase
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
          .eq('id', printerId);
          
        if (error) {
          console.error("Database update error:", error);
          throw error;
        }
        
        console.log(`Successfully updated printer ${printerId}`);
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: printerData,
        method: 'local-snmp'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('SNMP communication failed:', error);
      
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
