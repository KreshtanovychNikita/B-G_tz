FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/apps/post-service/src/main.js"]
