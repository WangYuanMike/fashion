FROM node

WORKDIR /usr/src/fashion

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["./run_fashion.sh"]
