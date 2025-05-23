# Imagen base con Node.js y Chrome preinstalado
FROM zenika/alpine-chrome:with-node

# Crea y define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias primero
COPY package*.json ./

# Instala las dependencias sin descargar Chromium
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Exponer el puerto (debe coincidir con el que usas en tu app: 10000)
EXPOSE 10000

# Comando para arrancar la app
CMD ["node", "index.js"]
