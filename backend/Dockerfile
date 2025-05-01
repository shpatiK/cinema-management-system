# Image bazë
FROM node:18.20.0-alpine


# Krijo direktorinë e aplikacionit në container
WORKDIR /app

# Kopjo file-t e nevojshëm
COPY package*.json ./
RUN npm install

# Kopjo gjithë kodin
COPY . .

# Starto aplikacionin
CMD ["npm", "run", "dev"]
