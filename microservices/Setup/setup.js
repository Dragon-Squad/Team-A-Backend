const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const Consul = require('consul');

const CONSUL_HOST = 'localhost';
const CONSUL_PORT = 8500;
const SERVER_NAME = "kafka";
const envDir = path.join(__dirname, '../');  

async function kafkaDiscovery() {
  try {
      const consul = new Consul({ host: CONSUL_HOST, port: CONSUL_PORT });

      const result = await consul.catalog.service.nodes(SERVER_NAME);
      if (!result || result.length === 0) {
          throw new Error('No Result from Consul');
      }

      const node = result[0];
      const instance = `${node.ServiceAddress}:${node.ServicePort}`;
      console.log(`Instance in server discovery: ${instance}`);

      const envFilePath = path.resolve(envDir, '.env');
      let envContent = '';

      // Read the existing .env file
      try {
          envContent = await fs.readFile(envFilePath, 'utf-8');
      } catch (err) {
          console.log('.env file not found. Creating a new one.');
      }

      // Check and update the BROKERS key
      const envLines = envContent.split('\n');
      const updatedEnvLines = envLines.map(line => {
          if (line.startsWith('BROKERS=')) {
              return `BROKERS=${instance}`;
          }
          return line;
      });

      // if (!envContent.includes('BROKERS=')) {
      //     updatedEnvLines.push(`BROKERS=${instance}`);
      // }

      // Write the updated content back to the .env file
      await fs.writeFile(envFilePath, updatedEnvLines.join('\n'));
      console.log(`Kafka IP updated in .env file: BROKERS=${instance}`);

  } catch (error) {
      console.error('Error in kafkaDiscovery:', error);
  }
}

async function wslIpV4Discovery() {
  exec('ipconfig', async (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }

    try {
      const lines = stdout.split('\n');
      let WSL_IPV4 = null;
      let isWSLAdapter = false;

      // Find the WSL IPv4 address
      for (const line of lines) {
        if (line.includes('vEthernet (WSL):')) {
          isWSLAdapter = true;
        }

        if (isWSLAdapter && line.trim().startsWith('IPv4 Address')) {
          const match = line.match(/(\d+\.\d+\.\d+\.\d+)/);
          if (match) {
            WSL_IPV4 = match[1];
            break;
          }
        }
      }

      if (!WSL_IPV4) {
        console.log('WSL IPv4 Address not found.');
        return;
      }

      console.log(`WSL IPv4 Address: ${WSL_IPV4}`);

      const envFilePath = path.resolve(envDir, '.env'); 
      let envContent = '';

      // Read the existing .env file
      try {
        envContent = await fs.readFile(envFilePath, 'utf-8');
      } catch (err) {
        console.log('.env file not found. Creating a new one.');
      }

      // Check and update the WSL_IPV4 key
      const envLines = envContent.split('\n');
      const updatedEnvLines = envLines.map(line => {
        if (line.startsWith('WSL_IPV4=')) {
          return `WSL_IPV4=${WSL_IPV4}`; 
        }
        return line;
      });

      // Write the updated content back to the .env file
      await fs.writeFile(envFilePath, updatedEnvLines.join('\n'));
      console.log(`WSL IPv4 updated in .env file: WSL_IPV4=${WSL_IPV4}`);

    } catch (err) {
      console.error('Error in wslIpV4Discovery:', err);
    }
  });
}

// Execute the discovery
kafkaDiscovery();
wslIpV4Discovery();
