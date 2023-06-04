FROM nodered/node-red:latest
USER root
RUN chmod 777 /data
COPY ./src/nr-server /data
RUN npm install
RUN npm install json-refs
