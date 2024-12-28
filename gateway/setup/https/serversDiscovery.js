const Consul = require('consul');
const { exec } = require('child_process');

const CONSUL_PORT = 8500;

async function getConsulHost() {
    return new Promise((resolve, reject) => {
        exec('docker network inspect microservice-network', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return reject(error);
            }

            try {
                const networkInfo = JSON.parse(stdout);

                // Locate the Consul container by its name
                const containers = networkInfo[0].Containers;
                let consulIP = null;

                for (const containerId in containers) {
                    if (containers[containerId].Name === 'consul_server') {
                        consulIP = containers[containerId].IPv4Address.split('/')[0];
                        break;
                    }
                }

                if (!consulIP) {
                    console.error('Consul container IP not found');
                    return reject(new Error('Consul container IP not found'));
                }

                resolve(consulIP);
            } catch (parseError) {
                console.error('Error parsing Docker network inspect output:', parseError);
                reject(parseError);
            }
        });
    });
}

async function serversDiscovery(serviceMap) {
    try {
      const consulHost = await getConsulHost();
      const consul = new Consul({ host: consulHost, port: CONSUL_PORT });
      const instances = new Map();
  
      // Use a for...of loop to properly handle async/await inside the loop
      for (const [key, serverName] of serviceMap) {
        const result = await consul.catalog.service.nodes(key);
        if (!result || result.length === 0) {
          throw new Error(`No Result from Consul for service: ${key}`);
        }
  
        const node = result[0];
        const instance = `http://${node.ServiceAddress}:${node.ServicePort}`;
  
        instances.set(key, instance);  
      }
  
      return instances;  
    } catch (error) {
      console.error('Error discovering services from Consul:', error);
      throw error;
    }
  }
  

module.exports = { serversDiscovery };