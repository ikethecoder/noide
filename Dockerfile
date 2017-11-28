FROM node:6.9.4

ENV PORT 7000
ENV NODE_ENV production

COPY package.json .
RUN mkdir noide

WORKDIR noide

COPY package.json .

RUN npm install

COPY server server
COPY client client
COPY config config
COPY index.js .

CMD ["node", "index.js"]
