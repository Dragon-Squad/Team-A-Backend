#!/bin/bash

# TODO: combine .env from all service (ye we can do that too)

docker network create microservice-network

docker compose \
  up \
  --build \
  # -f $docker_path/docker-compose.yml \
  # --env-file .env \
  # --detach \
  # $opts