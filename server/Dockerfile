# Backend: Express API
FROM node:22-alpine

WORKDIR /app

# Install production dependencies using the lockfile
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# API port (overridable via the PORT env var)
EXPOSE 5001

CMD ["node", "index.js"]
