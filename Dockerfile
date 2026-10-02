FROM node:22-alpine AS builder

WORKDIR /frontend

# o Vite embute VITE_API_URL no bundle durante o build: precisa existir aqui, não em runtime
ARG VITE_API_URL
RUN test -n "$VITE_API_URL" || (echo "Defina --build-arg VITE_API_URL=https://.../api/v1" && exit 1)
ENV VITE_API_URL=$VITE_API_URL

# dependências em camada separada para aproveitar o cache
COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN npm run build

# nginx sem root, servindo a SPA na porta 5173
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /frontend/dist /usr/share/nginx/html

EXPOSE 5173
