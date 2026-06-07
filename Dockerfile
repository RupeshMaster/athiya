# Frontend: build the Vite/React app, then serve it with nginx

# --- Build stage ---
FROM node:22-alpine AS build

WORKDIR /app

# Install all dependencies (incl. dev) needed to build
COPY package*.json ./
RUN npm ci

# API requests are made to /api and proxied by nginx to the backend container.
# Baked in at build time since Vite env vars are compile-time.
ENV VITE_API_URL=/api

COPY . .
RUN npm run build

# --- Serve stage ---
FROM nginx:alpine

# SPA + API proxy config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
