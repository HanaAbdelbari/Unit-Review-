# Use the official Node.js image as the base image for building the application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json ./
#COPY package-lock.json ./

# Install dependencies
RUN npm install && mkdir -p /cicd/coverage/output

# Copy the rest of the application code
COPY . .

# Build the application (if applicable, e.g., for TypeScript or other build steps)
# RUN npm run build

CMD ["npx", "nyc", "--reporter=text", "--reporter=cobertura", "--reporter=html", "--report-dir=/cicd/coverage/output", "node", "src/app.js"]

# Test stage
FROM node:18-alpine AS test
WORKDIR /usr/src/app
COPY --from=build /usr/src/app ./
# Set the command to run tests
CMD ["npx", "cucumberjs"]

# Use a smaller image for the production environment
FROM node:18-alpine AS production
# Set the working directory
WORKDIR /usr/src/app
# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app ./
# Expose the port the app runs on
EXPOSE 3000

# Copy configurations
COPY config/reviews_definition.json /pkg/reviews_definition.json
COPY docker/configure.sh /usr/bin/configure.sh
RUN chmod +x /usr/bin/configure.sh \
  && apk add --no-cache dos2unix \
  && dos2unix /pkg/reviews_definition.json \
  && dos2unix /usr/bin/configure.sh

# Start the application
CMD ["node", "src/app.js"]
