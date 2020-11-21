#!/bin/bash

touch .env
{
  echo "DATABASE_URL=$1"
} >> .env
