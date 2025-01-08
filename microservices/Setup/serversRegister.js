require("dotenv").config();
const Consul = require('consul');

const WSL_IPV4 = process.env.WSL_IPV4;
const CONSUL_HOST = 'localhost';
const CONSUL_PORT = 8500;

// Map of services and their ports
const serverMap = new Map([
  ['email', process.env.EMAIL_SERVER_PORT],
  ['project', process.env.PROJECT_SERVER_PORT],
  ['donation', process.env.DONATION_SERVER_PORT],
  ['shard', process.env.SHARD_SERVER_PORT],
  ['statistic', process.env.STATISTIC_SERVER_PORT],
]);

function registerServices() {
    console.log(serverMap);

    if (!WSL_IPV4) {
        console.log('Container IPv4 Address not found.');
        return;
    }

    console.log(`WSL IPv4 Address: ${WSL_IPV4}`);

    const consul = new Consul({ host: CONSUL_HOST, port: CONSUL_PORT });

    // Register services in Consul
    for (const [serviceName, servicePort] of serverMap) {
        if (!servicePort) {
        console.error(`Service port for ${serviceName} is not defined`);
        continue;
        }

        consul.agent.service.register(
        {
            id: `${serviceName}-${servicePort}`,
            name: serviceName,
            address: WSL_IPV4,
            port: parseInt(servicePort, 10),
        },
        (err) => {
            if (err) {
            console.error(`Error registering ${serviceName}:`, err);
            } else {
            console.log(`${serviceName} registered with Consul at ${WSL_IPV4}:${servicePort}`);
            }
        }
        );
    }
}

registerServices();
