FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the application source code to the working directory
COPY . .

# Build the application
RUN npm run build

## Use an official Node.js runtime for serving the application
#FROM node:16-alpine
#
## Set the working directory inside the container
#WORKDIR /app
#
## Install serve to serve the built application
#RUN npm install -g serve
#
## Copy the build folder from the previous stage
#COPY --from=0 /app/build /app/build
#
## Set the container to listen on port 3000
#EXPOSE 3000
#
## Start the application
#CMD ["serve", "-s", "build", "-l", "3000"]