# Team-A Backend Setup Guide

## Instructions for Running the Service

# 1. Grant Execution Permissions for run_docker.sh

# For Linux/MacOS:
chmod +x ./run_docker.sh

# For Windows:
# Right-click on run_docker.sh
# Select "Properties"
# Go to the "Security" tab
# Click "Edit"
# Select your user group (e.g., "Users")
# Check "Execute" under "Allow" in the permissions list
# Click "Apply" and "OK" on all open windows

# 2. Run the run_docker.sh Script
# Execute the script to start the Docker containers:
./run_docker.sh

## Verifying and Configuring the Docker Containers

# 1. Verify Docker Containers
# Check the status and IP addresses of the containers within the network:
docker network inspect microservice-network

# This command will output a list of active containers. For example:
# "Containers": {
#   "6a4d41e67ef3a524493b8168549245f6c320931c5efeadd1ecd6209ecff70c68": {
#     "Name": "email_service",
#     "IPv4Address": "172.18.0.3/16"
#   },
#   "e6e4b3e0137f2452eadfa7ebe58275452853050eb003da3fc649d10b99256fe0": {
#     "Name": "auth_service",
#     "IPv4Address": "172.18.0.2/16"
#   }
# }

# 2. Update IP Address in Application Code
# If the IP addresses have changed, follow these steps:

# Stop the container
docker compose down

# Update the IP address in your fetch request in the code:
# // Send OTP email via EmailService
# fetch('http://172.18.0.3:3001/charitan/api/v1/send/verify-email', {
#   ...
# });

# Restart the containers
./run_docker.sh

# Note: The IP of each container may change each time `docker-compose up` is run.
# Be sure to verify the container's IP addresses and update your code as needed.
