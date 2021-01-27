FROM node:14.15.3-stretch
RUN mkdir -p /var/www/ /var/www

ADD ./package.json /var/www/package.json
WORKDIR /var/www
RUN npm i -g typescript ts-node jest
RUN npm install
