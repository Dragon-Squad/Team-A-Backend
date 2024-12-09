#!/bin/sh

# Auth Service
echo "Create a Service for Auth Service"
curl -i -X POST http://localhost:8001/services/ \
  --data "name=auth-service" \
  --data "url=http://auth_service:3000"

echo "Add a Route for Auth Service"
curl -i -X POST http://localhost:8001/routes \
  --data "paths[]=/auth" \
  --data "service.name=auth-service"

# Email Service
echo "Create a Service for Email Service"
curl -i -X POST http://localhost:8001/services/ \
  --data "name=email-service" \
  --data "url=http://email_service:3001"

echo "Add a Route for Email Service"
curl -i -X POST http://localhost:8001/routes \
  --data "paths[]=/email" \
  --data "service.name=email-service"

echo "Done!"
