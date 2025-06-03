
# Local SNMP Service for Printer Management

This is a local SNMP service that communicates with network printers and provides a REST API for the printer management system.

## Prerequisites

- Node.js (v14 or higher)
- Network access to printers
- Printers with SNMP enabled (community string usually 'public')

## Installation

1. Navigate to the snmp-service directory:
   ```bash
   cd snmp-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

## Running the Service

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The service will run on port 3001 by default.

## Testing the Service

1. Health check:
   ```bash
   curl http://localhost:3001/health
   ```

2. Discover printers:
   ```bash
   curl -X POST http://localhost:3001/snmp/discover
   ```

3. Poll a specific printer:
   ```bash
   curl -X POST http://localhost:3001/snmp/poll \
     -H "Content-Type: application/json" \
     -d '{"host": "192.168.1.100"}'
   ```

## Configuration

After starting the service, you need to configure your Supabase project to use it:

1. Go to your Supabase project settings
2. Navigate to Edge Functions secrets
3. Add a new secret:
   - Name: `SNMP_SERVICE_URL`
   - Value: `http://localhost:3001`

## Troubleshooting

- Make sure your printers have SNMP enabled
- Check that the community string is correct (usually 'public')
- Ensure your firewall allows SNMP traffic (UDP port 161)
- Verify network connectivity to printers
