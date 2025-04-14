FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Create directory for SQLite database
RUN mkdir -p /app/data

# Copy package files and install production dependencies only
COPY package.json bun.lock ./
RUN npm install --omit=dev

# Copy compiled code from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production

# Expose the API port
EXPOSE 3000

# Start the server
CMD ["node", "dist/main"]