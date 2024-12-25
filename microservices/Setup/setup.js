const { exec } = require('child_process');
const fs = require('fs').promises;  
const path = require('path');

// Define the environment directory relative to the script
const envDir = path.join(__dirname, '../');  

exec('docker network inspect microservice-network', async (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }

  try {
    const networkInfo = JSON.parse(stdout);

    // Locate the Kafka container by its name
    const containers = networkInfo[0].Containers;
    let kafkaIP = null;

    for (const containerId in containers) {
      if (containers[containerId].Name === 'kafka') {
        kafkaIP = containers[containerId].IPv4Address.split('/')[0];
        break;
      }
    }

    if (!kafkaIP) {
      console.error('Kafka container IP not found');
      return;
    }

    console.log(`Kafka IP found: ${kafkaIP}`);

    // Write the Kafka IP to the .env file
    const envFilePath = path.resolve(envDir, '.env');
    const envContent = `BROKERS=${kafkaIP}:9092`;

    try {
      await fs.appendFile(envFilePath, envContent);
      console.log(`Kafka IP written to .env file: ${envContent}`);
    } catch (writeError) {
      console.error('Error writing to .env file:', writeError);
    }

  } catch (parseError) {
    console.error('Error parsing Docker network inspect output:', parseError);
  }
});
