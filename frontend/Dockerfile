FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with a lightweight server
FROM node:22-alpine

WORKDIR /app

# Install a lightweight server
RUN npm install -g serve

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the frontend port
EXPOSE 4321

# Start the server
CMD ["serve", "-s", "dist", "-l", "4321"]