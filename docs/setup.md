# Детальная установка и настройка

Подробная инструкция по установке и запуску Electron ECU Data Prototype.

## Prerequisites

### Обязательные требования:
- **Node.js 20+** (рекомендуется 20.10.0+)
- **npm 11+** (устанавливается вместе с Node.js)
- **macOS 10.15+** (текущая платформа тестирования)

### Проверка версий:
```bash
node --version   # должно быть v20.x.x
npm --version    # должно быть 11.x.x
```

### Если Node.js не установлен:
```bash
# macOS через Homebrew
brew install node@20

# Или скачать с официального сайта
# https://nodejs.org/
```

## Установка

### 1. Клонирование проекта
```bash
# Если используется Git
git clone <repo-url>
cd electron_prototype

# Или просто перейти в папку проекта
cd /path/to/electron_prototype
```

### 2. Установка зависимостей
```bash
npm install
```

**Время установки:** ~1-2 минуты (зависит от скорости интернета)

**Размер node_modules:** ~750 MB

**Установленные пакеты:**
- Electron 34.0.0 (~200 MB)
- Electron Forge + плагины (~100 MB)
- TypeScript 5.3.3
- Vite 5.4.21
- uPlot 1.6.30
- Pino 9.4.0
- И другие зависимости (см. [package.json](../package.json))

### 3. Проверка установки
```bash
# Проверить что все зависимости установлены
npm list --depth=0

# Должны быть видны:
# ├── @electron-forge/cli@7.10.2
# ├── electron@34.0.0
# ├── typescript@5.3.3
# ├── vite@5.4.21
# ├── uplot@1.6.30
# ├── pino@9.4.0
# └── ...
```

## Запуск

### Development режим (рекомендуется)
```bash
npm start
```

**Что происходит:**
1. Vite собирает TypeScript → JavaScript
2. Запускается dev server на http://localhost:5173
3. Запускается Electron приложение
4. **HMR (Hot Module Replacement) активен** - изменения видны мгновенно

**Время запуска:** ~10 секунд (первый раз), ~5 секунд (последующие)

**Признаки успешного запуска:**
```
✔ Launched Electron app. Type rs in terminal to restart main process.
```

**Должно открыться окно Electron** с заголовком "ECU Data Prototype".

### Production build
```bash
npm run package
```

Создает готовое приложение в папке `out/`.

### Создание дистрибутивов
```bash
npm run make
```

Создает установочные файлы:
- macOS: `.dmg`, `.zip`
- Windows: `.exe` (если запущено на Windows)
- Linux: `.deb`, `.rpm` (если запущено на Linux)

## Структура проекта после установки

```
electron_prototype/
├── node_modules/          # Установленные зависимости (~750 MB)
├── .vite/                 # Vite build cache
│   └── build/             # Скомпилированный код (main.js, preload.js)
├── src/                   # Исходный код TypeScript
│   ├── main.ts
│   ├── preload.ts
│   ├── renderer.ts
│   ├── index.css
│   └── ...
├── index.html             # UI разметка
├── forge.config.ts        # Electron Forge конфигурация
├── vite.*.config.ts       # Vite конфигурации
├── tsconfig.json          # TypeScript конфигурация
├── package.json           # npm зависимости
└── package-lock.json      # Locked versions
```

## Troubleshooting

### Проблема: `npm install` завершается с ошибкой

**Решение 1:** Очистить npm cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Решение 2:** Использовать другую версию Node.js
```bash
# Установить nvm (Node Version Manager)
# https://github.com/nvm-sh/nvm

nvm install 20
nvm use 20
npm install
```

### Проблема: `npm start` не запускается

**Проверка 1:** Убедиться что зависимости установлены
```bash
ls node_modules/@electron-forge
# Должна быть папка cli
```

**Проверка 2:** Убедиться что TypeScript скомпилировался
```bash
ls .vite/build/
# Должны быть файлы main.js, preload.js
```

**Решение:** Пересобрать проект
```bash
rm -rf .vite
npm start
```

### Проблема: Окно Electron не открывается

**Проверка:** Посмотреть логи в терминале
```bash
npm start 2>&1 | tee start.log
# Проверить start.log на наличие ошибок
```

**Типичные ошибки:**
- `Cannot find module 'electron'` → переустановить: `npm install electron --save-dev`
- `Port 5173 already in use` → убить процесс: `lsof -ti:5173 | xargs kill`

См. полный список проблем в [troubleshooting.md](troubleshooting.md).

### Проблема: HMR не работает

**Признаки:** Изменения в коде не отражаются автоматически

**Решение 1:** Перезапустить dev server
```bash
# В терминале где запущен npm start нажать:
rs + Enter
```

**Решение 2:** Полный перезапуск
```bash
# Ctrl+C чтобы остановить
npm start
```

### Проблема: Высокое использование CPU/Memory

**Это нормально для dev режима:**
- Dev server + HMR потребляют ресурсы
- В production build это не проблема

**Если критично:**
```bash
# Использовать production режим
npm run package
open out/electron-ecu-prototype-darwin-arm64/electron-ecu-prototype.app
```

## Дополнительные команды

### Lint (проверка кода)
```bash
npm run lint
```

Проверяет TypeScript код на ошибки через ESLint.

### Очистка проекта
```bash
# Удалить build артефакты
rm -rf .vite out

# Полная очистка (включая node_modules)
rm -rf node_modules .vite out package-lock.json
npm install
```

## Следующие шаги

После успешной установки и запуска:
1. Ознакомьтесь с [архитектурой проекта](architecture.md)
2. Изучите [план разработки](../roadmap.md)
3. Запустите [тесты производительности](testing.md)

## Полезные ссылки

- [Основной README](../README.md)
- [Electron Forge Документация](https://www.electronforge.io/)
- [Vite Документация](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
