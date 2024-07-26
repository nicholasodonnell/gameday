#!/bin/bash

cp -n .env{.example,}
cp -n docker-compose.override{.dev,}.yml
docker compose build --pull
