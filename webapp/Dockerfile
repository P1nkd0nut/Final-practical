FROM node:18-alpine
WORKDIR /app

# Copy dependencies
COPY package.json ./
RUN npm install

# Copy specific files to avoid 'Recursive Copy' security hotspots
COPY server.js ./
COPY 10-million-password-list-top-1000.txt ./
COPY public ./public

# Fix 'Root User' security hotspot by switching to the built-in node user
USER node

EXPOSE 8080
CMD ["npm", "start"]
