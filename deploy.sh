#!/bin/bash
set -ex
git pull

rm -rf dist
npm install
npm run build

docker build -t secret:v1 .
docker rm -f secret
docker run -p 8090:80 -d --name secret secret:v1
