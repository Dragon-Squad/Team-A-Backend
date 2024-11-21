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
Finally, bring up the microservices by running Docker Compose with the appropriate configuration. This will start all the microservices defined in the docker-compose.yml file.
```` sh
docker-compose -f microservices/docker-compose.yml up
````
