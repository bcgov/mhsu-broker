FROM alpine:3.4
MAINTAINER leo.lou@gov.bc.ca

RUN apk update \
  && apk add alpine-sdk nodejs \
  && npm install -g browserify bower grunt-cli serve

RUN mkdir -p /app
  
WORKDIR /app
ADD . /app
RUN npm install && npm update
RUN adduser -S broker
RUN chown -R broker:0 /app && chmod -R 770 /app
RUN apk del --purge alpine-sdk  

USER broker
EXPOSE 8080
CMD node server.js