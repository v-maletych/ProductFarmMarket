#FROM node:20-alpine AS build
#WORKDIR /app
#
## 1. КОПІЮВАННЯ ТА ВСТАНОВЛЕННЯ ЗАЛЕЖНОСТЕЙ
#COPY package.json package-lock.json ./
#
## 2. ВСТАНОВЛЕННЯ БЕЗ НАВ'ЯЗУВАННЯ НАТИВНОГО КОДУ
## Використовуємо npm ci з прапором, щоб не встановлювати опціональні нативні модулі.
#RUN npm ci --legacy-peer-deps
#
## 3. КОПІЮВАННЯ ВИХІДНОГО КОДУ
#COPY . .
#
## 4. ЗБИРАННЯ ПРОЄКТУ (ФІКС: Використовуємо npm run build для пошуку локального бінарного файлу vite)
## Змінна середовища, яка збільшує пам'ять для збирання
## ВИПРАВЛЕННЯ: Замінили прямий виклик vite на npm run build
#RUN NODE_OPTIONS='--max-old-space-size=4096' npm run build
#
## ----- СТАДІЯ ВИКОНАННЯ -----
#FROM nginx:stable-alpine
#COPY --from=build /app/dist /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]


FROM node:20-alpine AS build
WORKDIR /app

# 1. КОПІЮВАННЯ ТА ВСТАНОВЛЕННЯ ЗАЛЕЖНОСТЕЙ
COPY package.json package-lock.json ./

# 2. ВСТАНОВЛЕННЯ (Без --omit=optional, щоб Rollup працював на ARM64)
RUN npm ci --legacy-peer-deps

# 3. КОПІЮВАННЯ ВИХІДНОГО КОДУ
COPY . .

# 4. ЗБИРАННЯ ПРОЄКТУ
RUN NODE_OPTIONS='--max-old-space-size=4096' npm run build

# ----- СТАДІЯ ВИКОНАННЯ -----
FROM nginx:stable-alpine
# КРОК ВИПРАВЛЕННЯ: Копіюємо нашу нову конфігурацію Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Копіюємо зібраний додаток
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]