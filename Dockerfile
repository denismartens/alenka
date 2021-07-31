FROM node:16-slim AS webpack
WORKDIR /alenka
RUN npm install webpack webpack-cli expose-loader css-loader style-loader url-loader
COPY . /alenka/
RUN ./node_modules/webpack/bin/webpack.js -c ./webpack.config.js

FROM nginx:1.19.8-alpine AS dev
ENV NGINX_PORT=80
EXPOSE 80
COPY index.html /usr/share/nginx/html
COPY assets/css /usr/share/nginx/html/assets/css/
COPY --from=webpack /alenka/dist /usr/share/nginx/html/dist/

FROM scratch AS webpack-out
COPY --from=webpack /alenka/dist .