# Base image
FROM node:18

RUN apt update 
RUN apt install -y -qq python3 python3-pip python3-netifaces python3-requests python3-bs4 netcat-traditional

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY content /content

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Start the server using the production build
CMD ["npm", "run", "start:prod"]