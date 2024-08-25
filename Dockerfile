# pull official base image
FROM node:13.12.0-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app/frontend
# Copy the package.json and package-lock.json files
COPY package*.json ./
# Install the dependencies
RUN npm install
# Copy the app files
COPY . .
# Build the app
RUN npm run build
# Expose the port
EXPOSE 3000
# Run the app
CMD ["npm", "start"]

# Use NGINX as a lightweight base image to serve the app
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=builder /usr/src/app/frontend/build /usr/share/nginx/html

# Expose port 80 to the outside world (default for HTTP)
EXPOSE 80

# CMD is not needed as NGINX image has a default CMD to start the server