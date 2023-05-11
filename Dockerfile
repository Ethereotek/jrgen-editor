FROM nginx:1.23.4-alpine

RUN apk update && add --no-cache "nodejs>=18.4.1-r0"

ENV PORT 9000
ENV BASE_URL ""

