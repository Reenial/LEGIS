FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=10000
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
EXPOSE 10000
CMD ["node", "src/server.js"]
