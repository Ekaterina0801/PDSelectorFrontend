FROM node:22

# создание директории приложения
WORKDIR /usr/src/app

# установка зависимостей
# символ астериск ("*") используется для того чтобы по возможности
# скопировать оба файла: package.json и package-lock.json
COPY package*.json ./

ARG ENV_FILE=.env.prod
COPY ${ENV_FILE} .env

RUN npm install
# Если вы создаете сборку для продакшн
RUN npm ci --omit=dev

# копируем исходный код
COPY . .
RUN npm install -D @vitejs/plugin-basic-ssl@^1.0.0

RUN npm run build
EXPOSE 5173
CMD npm run --host preview