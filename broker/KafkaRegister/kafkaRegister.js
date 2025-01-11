const Consul = require('consul');

const CONSUL_HOST = '100.112.124.71';
const CONSUL_PORT = 8500;
const SERVICE_NAME = 'kafka';
const SERVICE_PORT = 9092;

async function registerKafka() {
    const consul = new Consul({ host: CONSUL_HOST, port: CONSUL_PORT });

    // Register the service with Consul
    consul.agent.service.register({
      id: `${SERVICE_NAME}-${SERVICE_PORT}`,
      name: SERVICE_NAME,
      address: SERVICE_NAME,
      port: SERVICE_PORT,
    }, (err) => {
      if (err) {
        console.error('Error registering kafka with Consul:', err);
        return;
      }
      console.log(`${SERVICE_NAME} registered with Consul`);
    });
}

registerKafka();