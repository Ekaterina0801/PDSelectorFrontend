#!/bin/bash

set -e  # Прерывать выполнение при ошибке любой команды

# Отключаем цветной вывод для docker команд
export NO_COLOR=1

echo "Останавливаем контейнер pd-web..."
docker stop pd-web || echo "Контейнер pd-web не запущен или уже остановлен"

echo "Удаляем контейнер pd-web..."
docker rm pd-web || echo "Контейнер pd-web не существует или уже удален"

echo "Удаляем образ pd-web..."
docker image rm pd-web || echo "Образ pd-web не существует или уже удален"

echo "Собираем новый образ..."
docker build --no-cache -t pd-web .

echo "Запускаем контейнер..."
docker run --net=host -d --name=pd-web pd-web

# Сброс цветов и форматирования терминала
printf "\033[0m"

echo "Скрипт завершен успешно"