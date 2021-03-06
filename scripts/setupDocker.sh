#!/bin/bash

docker build --build-arg DATABASE_URL="$1" --build-arg REDIS_URL="$2" -t cards-api-test -f Dockerfile.test .
docker tag cards-api-test cards-api-test:latest
docker-compose up -d

