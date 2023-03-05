# vk-minesweeper

Тестовое задание для команды Mini-apps фронтенда ВКонтакте

## Используемые технологии

- React + vite
- Redux Toolkit
- TypeScript
- Emotion

## Реализованные фичи

- Всё, что требовалось в задании
- "poking" ячеек: при нажатии на открытую ячейку, нажимаются все её соседи. Удобно для быстрого прохождения поля.
- Изменение размера ячеек

## Локальный запуск

1. Склонируйте репозиторий
   ```bash
   git clone https://github.com/jarvis394/vk-minesweeper.git
   ```
2. Установите зависимости
   ```bash
   yarn  # или npm install
   ```
3. Запустите проект
   ```bash
   yarn start:dev
   ```

## Сценарии

### `start`

Запускает приложение

### `build`

Билдит приложение. Для того, чтобы запустить собранное приложение, можно, например, установить утилиту `serve`:

```bash
npm i serve -g
serve -s build
```

### `lint`

Производит линтинг и форматирование кода

## Результат

Выложен на хостинг Vercel: [vk-minesweeper.vercel.app](https://vk-minesweeper.vercel.app)
