FROM ubuntu:15.04

RUN apt update && apt -y install curl
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -

RUN apt install -y \
    nodejs \

RUN npm install -g npm@latest

WORKDIR /app
ADD . /app

CMD ["sh", "-c", "npm start"]
