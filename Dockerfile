# Stage 1: Build Frontend
FROM node:20-slim as frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend and Final Image
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set up Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Set up backend
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend/ .

# Copy built frontend files from frontend-builder stage
COPY --from=frontend-builder /frontend/build /app/static

# Create directory for static files
RUN mkdir -p /app/staticfiles

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=10000

# Expose the port that render.com expects
EXPOSE 10000

# Copy the startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Start the application
CMD ["/start.sh"] 