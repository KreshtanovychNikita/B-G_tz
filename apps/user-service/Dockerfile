FROM node:20-alpine

WORKDIR /app

COPY tsconfig.json ./
COPY package*.json ./
RUN npm install

COPY . .

WORKDIR /app/apps/post-service
RUN npm run build

CMD ["node", "dist/apps/post-service/src/main.js"]
