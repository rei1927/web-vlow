# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to leverage cache
COPY package.json package-lock.json ./

# Install dependencies
# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_MINIO_ENDPOINT
ARG VITE_MINIO_BUCKET
ARG VITE_MINIO_ACCESS_KEY
ARG VITE_MINIO_SECRET_KEY
ARG VITE_MINIO_REGION

# Set environment variables during build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_MINIO_ENDPOINT=$VITE_MINIO_ENDPOINT
ENV VITE_MINIO_BUCKET=$VITE_MINIO_BUCKET
ENV VITE_MINIO_ACCESS_KEY=$VITE_MINIO_ACCESS_KEY
ENV VITE_MINIO_SECRET_KEY=$VITE_MINIO_SECRET_KEY
ENV VITE_MINIO_REGION=$VITE_MINIO_REGION

# Build the application
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
