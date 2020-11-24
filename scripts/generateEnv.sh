#!/bin/bash

touch .env
{
  echo "DATABASE_URL=$1"
  echo "REDIS_URL=$2"
} >> .env
