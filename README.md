# Team-A-Backend

## Run 
#### 1. Grant Permission to execute ``run_docker.sh`` file
- For Linux/MacOs:
```sh
chmod +x ./run_docker.sh
```

- For Win:
  1. Right-click on run_docker.sh
  2. Select "Properties" 
  3. Go to the "Security" tab
  4. Click "Edit" 
  5. Select your user group (e.g., "Users")
  6. Check the "Execute" box under "Allow" in the permissions list
  7. Click "Apply" and "OK" on all open windows

#### 2. Execute ``run_docker.sh`` file
```sh
./run_docker.sh
```

## Check the container
#### 1. Check the docker contrainer
- Check the status and IP addresses of the containers within the network
```sh
docker network inspect microservice-network
```

- Output example:
```
...
    "Containers": {
        "6a4d41e67ef3a524493b8168549245f6c320931c5efeadd1ecd6209ecff70c68": {
            "Name": "email_service",
            "IPv4Address": "172.18.0.3/16",
        },
        "e6e4b3e0137f2452eadfa7ebe58275452853050eb003da3fc649d10b99256fe0": {
            "Name": "auth_service",
            "IPv4Address": "172.18.0.2/16",
        }
    },
```

#### 2. Modify the IP address
- Stop the container
```sh
docker compose down
```

- Modify the IP in the fetch
```js
    // Send OTP email via EmailService
    fetch('http://172.18.0.3:3001/charitan/api/v1/send/verify-email', {
      ...
```

- Execute the ``run_docker.sh`` again
```sh
./run_docker.sh
```

Note: The IP of each containers is not the same each time compose-up. Make sure that you clarify the container's IP each time.
