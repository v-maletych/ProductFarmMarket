FROM node:20-alpine AS build
    WORKDIR /app
    COPY package.json package-lock.json ./
    RUN npm ci
    COPY . .
    RUN npm run build

    FROM nginx:stable-alpine
    # Змінюємо шлях на 'build', що є типовим для React
    COPY --from=build /app/build /usr/share/nginx/html 

    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
