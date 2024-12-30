# Team-A-Backend

## Tech Stack

| Technology        | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| ![Consul](https://img.shields.io/badge/Consul-FF3D00?style=for-the-badge&logo=consul&logoColor=white) | **Consul**: Service Discovery. |
| ![Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white) | **Kafka**: Real-time data streaming and microservice communication. |
| ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) | **Docker**: Containerization for consistent application deployment. |
| ![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) | **Node.js**: Backend JavaScript runtime for building scalable applications. |
| ![Express](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) | **Express.js**: Web application framework for Node.js, used for building APIs. |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) | **MongoDB**: NoSQL database for flexible and scalable data storage. |
| ![Stripe](https://img.shields.io/badge/Stripe-6772E5?style=for-the-badge&logo=stripe&logoColor=white) | **Stripe**: Payment processing service for online payments. |
| ![Ngrok](https://img.shields.io/badge/Ngrok-000000?style=for-the-badge&logo=ngrok&logoColor=white) | **Ngrok**: Tool for creating secure tunnels to localhost for testing. |
| ![Kong](https://img.shields.io/badge/Kong-343434?style=for-the-badge&logo=kong&logoColor=white) | **Kong**: API Gateway for managing and securing microservice traffic. |



## Run 
### 1. Clone the project
Begin by cloning the repository to your local machine. This will download the necessary files for the backend services.
```` sh
git clone https://github.com/Dragon-Squad/Team-A-Backend.git
````
Once the repository is cloned, navigate to the project directory:
```` sh
cd Team-A-Backend
````

<hr>

### 2. Init Data for all the Databases
To set up the required data for all databases, run the initialization script. This will ensure that all necessary database tables and configurations are properly set up before starting the services.
Navigate to the `initDB` direcory:
```` sh
cd initDB
````
Install the required dependencies:
```` sh
npm install
````
Run the initialization script:
```` sh
node scripts.js
````

<hr>

###  3. Run Consul
Consul is used for service discovery in this setup. Docker Compose is utilized to deploy Consul as a containerized service. Follow the steps below to start Consul:
Navigate to Consul Directory
```` sh
cd ..\consul\
````
Execute docker compose
```` sh
docker-compose up -d --build
````
Verify that Consul is running by checking if port 8005 is accessible. You can do this by visiting the following URL: https://localhost:8005

<hr>

### 4. Run Kafka
Kafka is required for messaging between the services. Ensure you are in the root directory of the project, then execute the following commands:
Navigate to broker directory
```` sh
cd ..\broker\
````
Start the Kafka broker and ensure it's running in detached mode.
```` sh
docker-compose up -d --build
````
Create Cluster
   - Using the Kafka-Manager to create the cluster, Kafka Manager is available at: https://localhost:9000
   - Using this credentails to login to the page:
         username: admin
         password: bigbang
   - Click on "Add Cluster"
   - Fill in the Cluster Name and Cluster Zookeeper Hosts
         Cluster Name: MyCluster
         Cluster Zookeeper Hosts: zookeeper:2181
   - Then Enable the JMX Pilling option under the Kafka Version
   - Click on Save
   - Click to Cluster View
   - Click on the number next to Topic
   - Verify if you can see all the topics registered
    ![Image Description](./Image/topics.png)

Register Kafka with Consul
```` sh
node KafkaRegister/kafkaRegister.js
````

<hr>

### 5. Create the network
Next, create a custom Docker network to enable communication between different microservices. This step is essential for setting up a network environment for the services to interact securely.
Create the network
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

<hr>

### 6. Run the Microservices
Then, bring up the microservices by running Docker Compose with the appropriate configuration.
Navigate to microservice directory
````sh
cd ..\microservices\
````
Setup before run docker
```` sh
node Setup/setup.js
````
Execute the docker compose file
```` sh
docker-compose up -d --build
````
Register all the Services with Consul
```` sh
node Setup/serversRegister.js
````

<hr>

#### 7. Setup the Kong API Gateway
Setup the gateway by composing the Gateway Container. This will setup the Kong API Gateway, add all the services and routes.


```` sh
docker-compose -f gateway/docker-compose.yml up -d
````
To verify that the services were added successfully, you can access: http://localhost:8001/services
To verify that the routes were added successfully, you can access: http://localhost:8001/routes

<hr>

### 8. Stripe Login
Login to Stripe
```` sh
docker-compose -f stripe/docker-compose.yml up -d
````

<hr>

### 9. Setup ngrok
Installation
- Get ngrok from this link: `https://download.ngrok.com/windows`

Config and run:
- Add Authtoken: 
````
ngrok config add-authtoken 2qIXJmZmfbafahDA6qTkdoZzKmv_4xS9wp3sHzAMfSDjfzWJr
````
- Start Endpoint:
````
ngrok http --url=crack-rightly-cow.ngrok-free.app 8000
````