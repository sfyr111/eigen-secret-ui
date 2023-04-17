#!/bin/bash
set -ex
git pull

rm -rf dist
yarn
npm run build

docker build -t secret:v2 .
docker rm -f secret
docker run -p 8090:80 -d --name secret secret:v2


# ieigen/secret:v2
