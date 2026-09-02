FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# No usamos "npm run dev": el shim multiplataforma que genera npm en
# node_modules/.bin/vite falla en este contenedor con "node.exe: not found"
# (bug reproducido con npm 11.19.0 y 10.9.9). Invocamos Vite directamente
# con el node del contenedor para esquivarlo. Ver .agents/rules/documentar-divergencias-dev-vs-docker.md
CMD ["node", "node_modules/vite/bin/vite.js", "--host", "0.0.0.0", "--port", "5173"]
