FROM nginx:1.19.8-alpine

ENV NGINX_PORT=80
EXPOSE 80

COPY . /usr/share/nginx/html