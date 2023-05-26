FROM node:18-alpine as builder
COPY . /app
RUN cd /app && npm i && npm run build

FROM nginx:latest
MAINTAINER EigenLabs
COPY --from=builder /app/dist /usr/share/nginx/html/

COPY default.conf /etc/nginx/conf.d/default.conf
COPY sitemap.xml  /usr/share/nginx/html/
