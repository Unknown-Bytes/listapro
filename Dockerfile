# Use uma imagem leve do Node.js com Alpine
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência (package.json e package-lock.json)
COPY package*.json ./

# Instala as dependências de produção (ignora devDependencies)
RUN npm ci --omit=dev

# Copia o restante do código para o container
COPY . .

# Expõe a porta que sua aplicação usa (ex: 3000 para Node.js)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]