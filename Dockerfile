FROM node

WORKDIR /usr/src/fashion

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "fashion.js" ]