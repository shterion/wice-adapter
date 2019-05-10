FROM node:8.11.1-alpine
LABEL NAME="wice-adapter"
LABEL MAINTAINER Shterion Yanev "syanev@wice.de"
LABEL SUMMARY="This image is used to start the Wice CRM for OIH"

RUN apk --no-cache add \
    python \
    make \
    g++ \
    libc6-compat

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install --production

COPY . /usr/src/app

RUN chown -R node:node .

USER node

ENTRYPOINT ["npm", "start"]
