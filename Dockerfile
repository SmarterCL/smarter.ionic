# Dockerfile para Ionic Angular App con Node.js

# Etapa 1: Construir la aplicación Angular
FROM node:18-alpine as builder

WORKDIR /app

# Copiar archivos de configuración primero para aprovechar el cache
COPY package*.json ./
COPY ionic.config.json ./
COPY angular.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación para producción
RUN npm run build --prod

# Etapa 2: Crear la imagen final con Node.js para servir la app
FROM node:18-alpine

WORKDIR /app

# Copiar los archivos construidos desde la etapa anterior
COPY --from=builder /app/www ./www
COPY --from=builder /app/server.js ./
COPY --from=builder /app/package.json ./

# Instalar solo las dependencias de producción
RUN npm install --production

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "start"]