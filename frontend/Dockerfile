FROM node:20-alpine AS builder
WORKDIR /app
# Vite reads VITE_* at build time; Render passes env vars as build args.
# VITE_API_URL stays empty in Docker: the app calls /api on its own origin and nginx proxies it.
ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
# The official image renders templates/*.template into conf.d/ at startup (API_UPSTREAM).
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
ENV NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
