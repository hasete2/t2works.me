FROM node:26-trixie

RUN apt-get update && apt-get install -y vim
COPY .bashrc .

COPY ./app /opt/app
WORKDIR /opt/app
