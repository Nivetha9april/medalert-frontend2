# Frontend Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Serve the build using a simple HTTP server
RUN npm install -g serve
EXPOSE 3000

CMD ["serve", "-s", "dist"]
