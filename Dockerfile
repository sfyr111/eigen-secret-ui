FROM nginx:latest

MAINTAINER EigenLabs
#RUN npm run build-preview

COPY default.conf /etc/nginx/conf.d/default.conf

COPY dist/  /usr/share/nginx/html/
COPY sitemap.xml  /usr/share/nginx/html/
