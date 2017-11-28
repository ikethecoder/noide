FROM node:8.7

RUN npm install -g fs

RUN useradd -ms /bin/bash pm2user
RUN groupadd pm2grp
RUN usermod -a -G pm2grp pm2user

USER pm2user
WORKDIR /home/pm2user

RUN mkdir -p noide


WORKDIR /home/pm2user/noide

USER pm2user

RUN canzea --reset

COPY docker/config/env.json /home/pm2user/.ecosystem-catalog/env.json
COPY docker/config/config.json /home/pm2user/.ecosystem-catalog/config.json

COPY package.json .
COPY lib lib/.
COPY public public/.
COPY docker/lib/app.js .

RUN npm install isarray
RUN npm install

# Install all the plugins
RUN mkdir -p /home/pm2user/.node-red

WORKDIR /home/pm2user/.node-red

RUN git clone https://github.com/ikethecoder/node-red-contrib-canzea-vars.git && echo "v0.0.5"
RUN npm install ./node-red-contrib-canzea-vars

RUN git clone https://github.com/ikethecoder/node-red-contrib-canzea-elasticsearch.git
RUN npm install ./node-red-contrib-canzea-elasticsearch

RUN git clone https://github.com/ikethecoder/node-red-biglib.git
RUN npm install ./node-red-biglib

RUN npm install node-red-contrib-http-request node-red-dashboard node-red-nodes node-red-contrib-graphs node-red-contrib-influxdb node-red-contrib-selenium-webdriver node-red-contrib-bigtimer node-red-contrib-cron node-red-contrib-bigexec node-red-node-mongodb node-red-contrib-postgres node-red-contrib-json-schema node-red-contrib-chatbot node-red-contrib-counter

WORKDIR /home/pm2user/flows-gateway

RUN ls -l
RUN ls -l lib

ENV PORT 8000
ENV NODE_ENV production

ENV VAULT_TLS_CERT /etc/vault/ssl/vault.cert
ENV VAULT_TLS_KEY /etc/vault/ssl/vault.key
ENV VAULT_TLS_CA_CERT /etc/vault/ssl/ca.cert
ENV VAULT_URI https://vault.service.dc1.consul:8200/

USER root
RUN apt-get install -y vim

RUN chown -R pm2user:pm2user /home/pm2user

USER pm2user

CMD ["node", "app.js"]

