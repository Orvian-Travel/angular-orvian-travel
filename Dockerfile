# Stage 1: Build the Angular application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build básico para produção no Azure
RUN npx ng build --configuration production

# Debug: Verificar estrutura da pasta dist
RUN ls -la dist/

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove all default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy the built application
COPY --from=build /app/dist/angular-orvian-travel/browser/ /usr/share/nginx/html/

# Copy startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Replace the default nginx config with a simple SPA config
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 80;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name localhost;' >> /etc/nginx/conf.d/default.conf && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    index index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Use custom entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]