# Frontend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Build argument for API URL
ARG VITE_API_URL=/api

# Copy package files
COPY package*.json ./

# Install dependencies
FROM nginx:alpine

# Serve prebuilt static files
WORKDIR /usr/share/nginx/html

# Copy prebuilt dist (must exist in build context)
COPY dist/ /usr/share/nginx/html/

# Copy nginx config into main nginx config (contains events/http blocks)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
