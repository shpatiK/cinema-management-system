# Imazh më i sigurt dhe i përditësuar automatikisht
FROM node:lts-slim

# Vendos direktorinë e punës
WORKDIR /app

# Kopjo vetëm skedarët e paketës për të përfituar nga layer cache
COPY package*.json ./

# Instalo varësitë
RUN npm install

# Kopjo të gjithë kodin e aplikacionit
COPY . .

# Porta default (mund të shtosh EXPOSE 3000 nëse përdor këtë port)
EXPOSE 3000

# Starto aplikacionin në development mode
CMD ["npm", "run", "dev"]
