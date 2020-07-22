
FROM ubuntu:18.04

RUN apt-get update && apt-get -y install curl gnupg && curl -sL https://deb.nodesource.com/setup_13.x  | bash - && apt-get -y install nodejs


WORKDIR /app
COPY ./build /app/build
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./server.js /app/server.js

RUN npm install 

CMD npm start