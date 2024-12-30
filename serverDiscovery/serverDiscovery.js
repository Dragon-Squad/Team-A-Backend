const Consul = require('consul');

// Consul configuration
const CONSUL_HOST = 'localhost';
const CONSUL_PORT = 8500;

const serviceNames = ['email', 'project', 'donation', 'shard'];

// Create Consul client
const consul = new Consul({ host: CONSUL_HOST, port: CONSUL_PORT });

async function getServiceUrl(serviceName) {
  const result = await consul.catalog.service.nodes(serviceName);

  const service = result[0];
  const serviceAddress = service.ServiceAddress || service.Address;
  const servicePort = service.ServicePort;
  const serviceUrl = `http://${serviceAddress}:${servicePort}`;

  return serviceUrl;

}

(async () => {
  try {
    serviceNames.forEach(async (serviceName) => {
        const url = await getServiceUrl(serviceName);
        console.log(`${serviceName} service URL: ${url}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
})();
