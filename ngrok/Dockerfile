# Use a lightweight base image
FROM alpine:latest

# Install curl to download ngrok
RUN apk add --no-cache curl

# Download and install ngrok
RUN curl -sSL https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-stable-linux-amd64.zip -o ngrok.zip && \
    unzip ngrok.zip && \
    mv ngrok /usr/local/bin/ && \
    rm ngrok.zip

# Set the NGROK authtoken
RUN ngrok config add-authtoken 2qIXJmZmfbafahDA6qTkdoZzKmv_4xS9wp3sHzAMfSDjfzWJr

# Expose the port ngrok will forward
EXPOSE 8000

# Command to run ngrok with the desired settings
CMD ["ngrok", "http", "--url=crack-rightly-cow.ngrok-free.app", "8000"]
