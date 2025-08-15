# Cosme Lab Website Development Container
# Static HTML/CSS/JS site with live reload server
# Architecture: Multi-arch (AMD64/ARM64)

FROM node:20-alpine

# Install additional tools
RUN apk add --no-cache \
    git \
    curl \
    bash

# Set working directory
WORKDIR /app

# Copy package.json if it exists
COPY package*.json ./

# Install Node.js development tools
RUN npm install -g live-server && \
    if [ -f package.json ]; then npm install; fi

# Create a non-root user (using higher UID to avoid conflicts with CI runners)
RUN addgroup -g 10001 cosme && \
    adduser -D -s /bin/bash -u 10001 -G cosme cosme

# Switch to non-root user
USER cosme

# Copy the website files
COPY --chown=cosme:cosme . .

# Expose port for live-server
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080 || exit 1

# Default command - start live-server
CMD ["live-server", "--port=8080", "--host=0.0.0.0", "--no-browser"]