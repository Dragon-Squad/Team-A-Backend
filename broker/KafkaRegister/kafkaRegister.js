const { exec } = require('child_process');
const Consul = require('consul');

const CONSUL_HOST = 'localhost';
const CONSUL_PORT = 8500;
const SERVICE_NAME = 'kafka';
const SERVICE_PORT = 9092;

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

    const consul = new Consul({ host: CONSUL_HOST, port: CONSUL_PORT });

    // Register the service with Consul
    consul.agent.service.register({
      id: `${SERVICE_NAME}-${SERVICE_PORT}`,
      name: SERVICE_NAME,
      address: kafkaIP,
      port: SERVICE_PORT,
    }, (err) => {
      if (err) {
        console.error('Error registering service with Consul:', err);
        return;
      }
      console.log(`${SERVICE_NAME} registered with Consul at ${kafkaIP}`);
    });
  } catch (parseError) {
    console.error('Error parsing Docker network inspect output:', parseError);
  }
});