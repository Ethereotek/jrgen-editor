FROM nodered/node-red:latest

WORKDIR /data

COPY ./src /data

ENV PORT 9000
ENV BASE_URL ""

