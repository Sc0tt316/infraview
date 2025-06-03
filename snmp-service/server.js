
const express = require('express');
const cors = require('cors');
const snmp = require('net-snmp');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// SNMP OID mappings for printers
const PRINTER_OIDS = {
  // System Information
  SYS_NAME: '1.3.6.1.2.1.1.5.0',
  SYS_DESCR: '1.3.6.1.2.1.1.1.0',
  SYS_CONTACT: '1.3.6.1.2.1.1.4.0',
  SYS_LOCATION: '1.3.6.1.2.1.1.6.0',
  
  // Printer Status
  PRINTER_STATUS: '1.3.6.1.2.1.25.3.5.1.1.1',
  PRINTER_DETAILED_STATUS: '1.3.6.1.2.1.25.3.5.1.2.1',
  
  // Supply levels (toner/ink)
  SUPPLY_LEVEL: '1.3.6.1.2.1.43.11.1.1.9.1',
  SUPPLY_MAX_CAPACITY: '1.3.6.1.2.1.43.11.1.1.8.1',
  SUPPLY_TYPE: '1.3.6.1.2.1.43.11.1.1.3.1',
  
  // Paper handling
  INPUT_CURRENT_LEVEL: '1.3.6.1.2.1.43.8.2.1.10.1',
  INPUT_MAX_CAPACITY: '1.3.6.1.2.1.43.8.2.1.3.1',
  
  // Page counts
  TOTAL_PAGES: '1.3.6.1.2.1.43.10.2.1.4.1.1',
  TOTAL_IMPRESSIONS: '1.3.6.1.2.1.43.10.2.1.5.1.1',
  
  // HP-specific OIDs
  HP_SERIAL_NUMBER: '1.3.6.1.4.1.11.2.3.9.4.2.1.1.3.3.0',
  HP_PAGE_COUNT: '1.3.6.1.4.1.11.2.3.9.4.2.1.4.1.2.5.0',
};

// Function to perform SNMP walk
function performSNMPWalk(host, community, oids, version = '2c', timeout = 8000) {
  return new Promise((resolve, reject) => {
    const session = snmp.createSession(host, community, {
      version: version === '1' ? snmp.Version1 : snmp.Version2c,
      timeout: timeout,
      retries: 1
    });

    const results = {};
    let completedRequests = 0;
    const totalRequests = oids.length;
    let hasError = false;

    // Function to handle completion
    const checkCompletion = () => {
      completedRequests++;
      if (completedRequests === totalRequests && !hasError) {
        session.close();
        resolve(results);
      }
    };

    // Handle session errors
    session.on('error', (error) => {
      if (!hasError) {
        hasError = true;
        session.close();
        reject(new Error(`SNMP session error: ${error.message}`));
      }
    });

    // Query each OID
    oids.forEach(oid => {
      session.get([oid], (error, varbinds) => {
        if (error) {
          if (!hasError) {
            hasError = true;
            session.close();
            reject(new Error(`SNMP get error for ${oid}: ${error.message}`));
          }
          return;
        }

        varbinds.forEach(vb => {
          if (snmp.isVarbindError(vb)) {
            console.warn(`SNMP error for OID ${vb.oid}: ${snmp.varbindError(vb)}`);
            results[vb.oid] = null;
          } else {
            // Convert value based on type
            let value = vb.value;
            if (Buffer.isBuffer(value)) {
              value = value.toString('utf8').replace(/\0/g, ''); // Remove null bytes
            }
            results[vb.oid] = value;
          }
        });

        checkCompletion();
      });
    });
  });
}

// Function to discover printers on network
async function discoverPrinters() {
  const discoveredPrinters = [];
  const networkRanges = ['192.168.1', '192.168.0', '10.0.0', '172.16.0'];
  
  for (const range of networkRanges) {
    for (let i = 1; i <= 254; i++) {
      const ip = `${range}.${i}`;
      
      try {
        // Quick check with system description
        const result = await performSNMPWalk(ip, 'public', [PRINTER_OIDS.SYS_DESCR], '2c', 3000);
        
        if (result[PRINTER_OIDS.SYS_DESCR]) {
          const deviceDesc = result[PRINTER_OIDS.SYS_DESCR];
          
          // Check if it's likely a printer
          if (deviceDesc && (
            deviceDesc.toLowerCase().includes('printer') ||
            deviceDesc.toLowerCase().includes('laserjet') ||
            deviceDesc.toLowerCase().includes('pixma') ||
            deviceDesc.toLowerCase().includes('maxify') ||
            deviceDesc.toLowerCase().includes('workforce') ||
            deviceDesc.toLowerCase().includes('canon') ||
            deviceDesc.toLowerCase().includes('hp') ||
            deviceDesc.toLowerCase().includes('epson') ||
            deviceDesc.toLowerCase().includes('brother')
          )) {
            // Get printer name
            const nameResult = await performSNMPWalk(ip, 'public', [PRINTER_OIDS.SYS_NAME], '2c', 3000);
            const printerName = nameResult[PRINTER_OIDS.SYS_NAME] || `Printer-${ip}`;
            
            discoveredPrinters.push({
              ipAddress: ip,
              name: printerName,
              model: deviceDesc
            });
            
            console.log(`Discovered printer: ${printerName} at ${ip}`);
          }
        }
      } catch (error) {
        // Skip unreachable IPs silently
        continue;
      }
    }
  }
  
  return discoveredPrinters;
}

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SNMP Service is running' });
});

// SNMP Walk endpoint
app.post('/snmp/walk', async (req, res) => {
  try {
    const { host, community = 'public', oids, version = '2c', timeout = 8000 } = req.body;
    
    if (!host || !oids || !Array.isArray(oids)) {
      return res.status(400).json({
        error: 'Missing required parameters: host and oids array'
      });
    }
    
    console.log(`SNMP walk request for ${host} with ${oids.length} OIDs`);
    
    const results = await performSNMPWalk(host, community, oids, version, timeout);
    
    res.json({
      success: true,
      host,
      values: results
    });
    
  } catch (error) {
    console.error('SNMP walk error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Printer discovery endpoint
app.post('/snmp/discover', async (req, res) => {
  try {
    console.log('Starting printer discovery...');
    
    const printers = await discoverPrinters();
    
    res.json({
      success: true,
      printers,
      count: printers.length
    });
    
  } catch (error) {
    console.error('Discovery error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Single printer poll endpoint
app.post('/snmp/poll', async (req, res) => {
  try {
    const { host, community = 'public', version = '2c', timeout = 8000 } = req.body;
    
    if (!host) {
      return res.status(400).json({
        error: 'Missing required parameter: host'
      });
    }
    
    // Get all relevant printer OIDs
    const allOids = Object.values(PRINTER_OIDS);
    
    console.log(`Polling printer at ${host}`);
    
    const results = await performSNMPWalk(host, community, allOids, version, timeout);
    
    res.json({
      success: true,
      host,
      values: results
    });
    
  } catch (error) {
    console.error(`Polling error for ${req.body.host}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`SNMP Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`SNMP endpoints:`);
  console.log(`  POST /snmp/walk - Perform SNMP walk`);
  console.log(`  POST /snmp/poll - Poll single printer`);
  console.log(`  POST /snmp/discover - Discover printers`);
});
