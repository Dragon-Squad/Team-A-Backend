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
Execute this if you are using Linux/MacOs
````sh
sudo chmod +x ./initDB.sh
./initDB.sh
````
or Execute this if you are using Window
````sh
.\initDB.bat
````


<hr>

### 3. Setup Backend
Execute this if you are using Linux/MacOs
````sh
sudo chmod +x ./setup.sh
./setup.sh
````
or Execute this if you are using Window
````sh
.\setup.bat
````

<hr>

### 4. Run the Backend
Execute this if you are using Linux/MacOs
````sh
sudo chmod +x ./run.sh
./run.sh
````
or Execute this if you are using Window
````sh
.\run.bat
````
To verify that the services were added successfully, you can access: http://localhost:8001/services
To verify that the routes were added successfully, you can access: http://localhost:8001/routes

<hr>

### 5. Setup ngrok
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
