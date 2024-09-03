FROM node:20.12.0-alpine AS builder

WORKDIR /frontend

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

RUN npm run build

FROM nginx:alpine

COPY --from=builder /frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

ENV VITE_API_URL=teste
EXPOSE 5173