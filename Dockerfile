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
COPY glupe.js .
COPY bin bin

RUN npm run build

ENV PORT 8000
EXPOSE 8000

CMD ["node", "index.js"]
