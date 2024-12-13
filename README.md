# Team-A-Backend

## Run 
#### 1. Clone the project
Begin by cloning the repository to your local machine. This will download the necessary files for the backend services.
```` sh
git clone https://github.com/Dragon-Squad/Team-A-Backend.git
````
Once the repository is cloned, navigate to the project directory:
```` sh
cd Team-A-Backend
````

#### 2. Init Data for all the Databases
To set up the required data for all databases, run the initialization script. This will ensure that all necessary database tables and configurations are properly set up before starting the services.
```` sh
cd initDB
npm install
node scripts.js
````

#### 3. Create the network
Next, create a custom Docker network to enable communication between different microservices. This step is essential for setting up a network environment for the services to interact securely.
```` sh
docker network create microservice-network
````
To verify that the network was created successfully, you can list all Docker networks:
```` sh
docker network ls
````
You should see an output similar to the following, confirming that the microservice-network has been created:
```
NETWORK ID     NAME                   DRIVER    SCOPE
68b9bdb5ccb0   microservice-network   bridge    local
```

#### 4. Run Kafka
Kafka is required for messaging between the services. To start the Kafka broker, use Docker Compose to bring up the necessary containers. Ensure you are in the root directory of the project, then execute the following command:
```` sh
cd ../Team-A-Backend
docker-compose -f broker/docker-compose.yml up -d
````
This command will start the Kafka broker and ensure it's running in detached mode.

#### 5. Run the Microservices
Then, bring up the microservices by running Docker Compose with the appropriate configuration. This will start all the microservices defined in the docker-compose.yml file.
```` sh
docker-compose -f microservices/docker-compose.yml up -d
````

#### 6. Setup the Kong API Gateway
Finally, setup the gateway by composing the Gateway Container. This will setup the Kong API Gateway, add all the services and routes.
```` sh
docker-compose -f gateway/docker-compose.yml up -d
````
To verify that the services were added successfully, you can access the `http://localhost:8001/services`:
````
{
    "next": null,
    "data": [
        {
            "retries": 5,
            "path": null,
            "tags": null,
            "port": 3003,
            "write_timeout": 60000,
            "protocol": "http",
            "client_certificate": null,
            "name": "ProjectManagementService",
            "connect_timeout": 60000,
            "read_timeout": 60000,
            "tls_verify_depth": null,
            "host": "172.30.208.1",
            "created_at": 1733804835,
            "updated_at": 1733805059,
            "enabled": false,
            "ca_certificates": null,
            "id": "33ddddb2-6838-4fad-9ff8-868178bafbf6",
            "tls_verify": null
        },
        {
            "retries": 5,
            "path": null,
            "tags": null,
            "port": 3001,
            "write_timeout": 60000,
            "protocol": "http",
            "client_certificate": null,
            "name": "EmailService",
            "connect_timeout": 60000,
            "read_timeout": 60000,
            "tls_verify_depth": null,
            "host": "172.30.208.1",
            "created_at": 1733804835,
            "updated_at": 1733805061,
            "enabled": false,
            "ca_certificates": null,
            "id": "ad83713c-4bd5-442e-8423-d4696b92a9ec",
            "tls_verify": null
        }
        ...
    ]
}
````
To verify that the routes were added successfully, you can access the `http://localhost:8001/routes`:
````
{
    "next": null,
    "data": [
        {
            "snis": null,
            "created_at": 1733805625,
            "tags": null,
            "preserve_host": false,
            "updated_at": 1733805625,
            "sources": null,
            "protocols": [
                "http",
                "https"
            ],
            "destinations": null,
            "methods": null,
            "regex_priority": 0,
            "name": "513e2762-e74b-4018-a2f3-b61920cde63f-route",
            "request_buffering": true,
            "response_buffering": true,
            "https_redirect_status_code": 426,
            "strip_path": true,
            "headers": null,
            "paths": [
                "/project/active"
            ],
            "service": {
                "id": "513e2762-e74b-4018-a2f3-b61920cde63f"
            },
            "id": "c1fbde3a-84fb-4c68-9975-0bd883bb19dc",
            "hosts": null,
            "path_handling": "v0"
        }
        ...
    ]
}
````