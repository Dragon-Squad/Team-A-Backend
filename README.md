# Team-A-Backend

## Tech Stack

![Consul](https://img.shields.io/badge/Consul-FF3D00?style=for-the-badge&logo=consul&logoColor=white)
![Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-6772E5?style=for-the-badge&logo=stripe&logoColor=white)
![Ngrok](https://img.shields.io/badge/Ngrok-000000?style=for-the-badge&logo=ngrok&logoColor=white)
![Kong](https://img.shields.io/badge/Kong-343434?style=for-the-badge&logo=kong&logoColor=white)

## Run

### 1. Clone the project

Begin by cloning the repository to your local machine. This will download the necessary files for the backend services.

```sh
git clone https://github.com/Dragon-Squad/Team-A-Backend.git
```

Once the repository is cloned, navigate to the project directory:

```sh
cd Team-A-Backend
```

<hr>

### 2. Init Data for all the Databases

To set up the required data for all databases, run the initialization script. This will ensure that all necessary database tables and configurations are properly set up before starting the services.
Execute this if you are using Linux/MacOs

```sh
sudo chmod +x ./initDB.sh
./initDB.sh
```

or Execute this if you are using Window

```sh
.\initDB.bat
```

<hr>

### 3. Run BackEnd

The backend will be run in multiple devices:
-   Device 1: `Server Discovery`, `Kafka`, `Gateway`
-   Device 2: `Microservices`
-   Device 3: `Redis`
-   Device 4: `Front End`

#### Server Discovery - Kafka (Device 1)

Execute this if you are using Linux/MacOs

```sh
sudo chmod +x ./consul_and_kafka.sh
./consul_and_kafka.sh
```

or Execute this if you are using Window

```sh
.\consul_and_kafka.bat
```

<hr>

#### Redis (Device 3)

````sh
docker-compose -f redis/docker-compose.yml up -d --build
````


#### Microservices (Device 2)

Execute this if you are using Linux/MacOs

```sh
sudo chmod +x ./microservices.sh
./microservices.sh
```

or Execute this if you are using Window

```sh
.\microservices.bat
```

<hr>

#### Gateway (Device 1)

Execute this if you are using Linux/MacOs

```sh
sudo chmod +x ./kong.sh
./kong.sh
```

or Execute this if you are using Window

```sh
.\kong.bat
```

To verify that the services were added successfully, you can access: http://localhost:8001/services
To verify that the routes were added successfully, you can access: http://localhost:8001/routes

<hr>


Install tailscale: https://tailscale.com/download

On each of the service(Email Service, Donation Service, Project Management Service and Shard Project Service) and gateway devices (Device 1 and Device 2), execute this to generate the tailscale certificates

````sh
tailscale cert <machine_name>.<tailnetname>
````
Then double-click to the generated certificate to download


Waiting for Kong setup to complete and turn on the tailscale funnel for the gateway (Device 1)

````sh
tailscale funnel --https=10000 localhost:8000
````
