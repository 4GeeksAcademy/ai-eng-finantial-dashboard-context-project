FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["node", "node_modules/vite/bin/vite.js", "--host", "0.0.0.0", "--port", "5173"]
