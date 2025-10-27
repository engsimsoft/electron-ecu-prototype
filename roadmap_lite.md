# Roadmap: ECU Tuner Lite Version

**Версия:** v0.1.0-lite
**Дата создания:** 27 октября 2025
**Базовый проект:** Electron ECU Prototype v0.5.0
**Статус:** 🚧 В разработке

---

## 🎯 Цель проекта Lite версии

Создать **облегченную версию** ECU Tuner для старых компьютеров Windows на основе существующего Electron проекта. Lite версия будет работать через браузер пользователя вместо Electron.

**Ключевые отличия от Full версии:**
- **Размер:** ~10-15 MB (vs ~150 MB Electron)
- **Платформа:** Windows 7 SP1+ (vs Windows 10/11 only)
- **Архитектура:** Node.js 16 + Express + Socket.IO + браузер пользователя
- **Упаковка:** pkg → ECU_Tuner_Lite.exe
- **Код:** 95% переиспользование из Full версии

---

## 📊 Текущий статус

- **Этап:** Этап 1 ЗАВЕРШЁН ✅ | Этап 2 готов к старту
- **Прогресс:** 6/21 задач выполнено (28.6%)
- **Текущая задача:** Этап 1 завершён, готов к Этапу 2
- **Блокеры:** Нет
- **Git tag:** v0.1.0-lite-stage1

### Прогресс по этапам:
- ✅ **Этап 1:** Создание структуры lite/ (6/6 задач) - ЗАВЕРШЁН
- ⏳ **Этап 2:** Node.js сервер (0/5 задач)
- ⏳ **Этап 3:** Интеграция DataGenerator (0/4 задач)
- ⏳ **Этап 4:** Интеграция графиков uPlot (0/6 задач)

---

## 🎯 Критерии успеха

### KPI для Lite версии:

| KPI | Целевое значение | Приоритет |
|-----|------------------|-----------|
| **Размер .exe** | <15 MB | Высокий |
| **Совместимость** | Windows 7 SP1+ | Критичный |
| **Запуск** | <5 секунд | Средний |
| **Загрузка UI** | <2 секунд | Средний |
| **FPS графиков** | ≥55 FPS | Высокий |
| **Latency** | <50ms | Высокий |
| **Функционал** | = Full версия | Критичный |

### Критерии приемки Proof of Concept:

- ✅ Запускается на Windows 7 SP1 (64-bit)
- ✅ Автоматически открывает браузер
- ✅ Отображает 3 графика uPlot в реальном времени
- ✅ Обрабатывает 300 параметров @ 25 Hz без тормозов
- ✅ 100% оффлайн работа (интернет не нужен)
- ✅ Использует существующий код (DataGenerator, ChartManager)

---

## 🌿 Git Workflow - Безопасная разработка

### ⚠️ ВАЖНО: Защита существующего проекта!

**Проблема:** Full версия (v0.5.0) работает идеально. Нельзя её сломать при разработке Lite версии!

**Решение:** Работаем в отдельной ветке `lite-version` с частыми коммитами.

### Стратегия веток

```
main (Full версия v0.5.0, стабильная)
  │
  └─ lite-version (Lite версия v0.1.0, разработка)
       │
       ├─ Этап 1: структура lite/
       ├─ Этап 2: Node.js сервер
       ├─ Этап 3: DataGenerator
       └─ Этап 4: Графики uPlot
```

### Правила безопасности

1. ✅ **Создаём отдельную ветку** `lite-version` перед началом
2. ✅ **НЕ трогаем файлы Full версии** - только добавляем новые в `lite/`
3. ✅ **Коммитим после КАЖДОЙ задачи** из roadmap (21 коммит минимум)
4. ✅ **Можно откатиться** на любую задачу назад
5. ✅ **Мёрж в main** только после успешных тестов Этапа 4

### Когда делать коммиты

| Момент | Команда | Сообщение коммита |
|--------|---------|-------------------|
| **Перед началом** | `git checkout -b lite-version` | - |
| **После задачи 1.1** | `git add lite/ && git commit` | `feat(lite): create lite/ folder structure` |
| **После задачи 1.2** | `git add lite/package.json && git commit` | `feat(lite): add package.json with dependencies` |
| **После задачи 1.3** | `git add lite/tsconfig.json && git commit` | `feat(lite): add TypeScript configuration` |
| **После задачи 1.6** | `git add lite/package-lock.json && git commit` | `chore(lite): install npm dependencies` |
| **После Этапа 1** | `git tag v0.1.0-lite-stage1` | - |
| **После Этапа 2** | `git tag v0.1.0-lite-stage2` | - |
| **После Этапа 3** | `git tag v0.1.0-lite-stage3` | - |
| **После Этапа 4** | `git tag v0.1.0-lite-stage4` | - |

### Формат коммит сообщений

Используем **Conventional Commits**:

```bash
# Новая функция
git commit -m "feat(lite): описание новой функции"

# Исправление бага
git commit -m "fix(lite): описание исправления"

# Документация
git commit -m "docs(lite): обновление roadmap_lite.md"

# Настройки/зависимости
git commit -m "chore(lite): установка express и socket.io"

# Рефакторинг
git commit -m "refactor(lite): улучшение структуры server.ts"
```

**Префикс `(lite)`** показывает что изменения касаются только Lite версии.

### Детальный план коммитов

#### Этап 1: Структура (6 коммитов)

```bash
# Задача 1.1
mkdir lite
git add lite/
git commit -m "feat(lite): create lite/ folder structure"

# Задача 1.2
# ... создать package.json ...
git add lite/package.json
git commit -m "feat(lite): add package.json with Node.js 16 dependencies"

# Задача 1.3
# ... создать tsconfig.json ...
git add lite/tsconfig.json
git commit -m "feat(lite): add TypeScript configuration for Node.js 16"

# Задача 1.4
mkdir lite/web
git add lite/web/
git commit -m "feat(lite): create web/ folder for frontend assets"

# Задача 1.5
# ... создать .gitignore ...
git add lite/.gitignore
git commit -m "chore(lite): add .gitignore for lite/"

# Задача 1.6
cd lite && npm install
git add lite/package-lock.json
git commit -m "chore(lite): install npm dependencies (express, socket.io, open)"

# После Этапа 1
git tag v0.1.0-lite-stage1
```

#### Этап 2: Node.js сервер (5 коммитов)

```bash
# Задача 2.1
# ... создать server.ts ...
git add lite/server.ts
git commit -m "feat(lite): add Express server with Socket.IO and auto-launch browser"

# Задача 2.2
# ... создать index.html ...
git add lite/web/index.html
git commit -m "feat(lite): add basic HTML interface with Socket.IO client"

# Задача 2.3
# ... создать styles.css ...
git add lite/web/styles.css
git commit -m "feat(lite): add dark theme CSS styles"

# Задача 2.4
# ... создать app.js ...
git add lite/web/app.js
git commit -m "feat(lite): add Socket.IO client logic with connection status"

# Задача 2.5
# ... скомпилировать и протестировать ...
git add lite/dist/
git commit -m "build(lite): compile TypeScript to JavaScript"

# После Этапа 2
git tag v0.1.0-lite-stage2
```

#### Этап 3: DataGenerator (4 коммита)

```bash
# Задача 3.1
# ... добавить импорты в server.ts ...
git add lite/server.ts
git commit -m "feat(lite): import DataGenerator and PrecisionTimer from Full version"

# Задача 3.2
# ... инициализировать DataGenerator ...
git add lite/server.ts
git commit -m "feat(lite): initialize DataGenerator with 300 parameters @ 25Hz"

# Задача 3.3
# ... добавить команды Start/Stop ...
git add lite/server.ts
git commit -m "feat(lite): add Start/Stop simulation WebSocket commands"

# Задача 3.4
# ... обработчик в app.js ...
git add lite/web/app.js
git commit -m "feat(lite): add ecu-data event handler in frontend"

# После Этапа 3
git tag v0.1.0-lite-stage3
```

#### Этап 4: Графики uPlot (6 коммитов)

```bash
# Задача 4.1
# ... скопировать circular-buffer.ts ...
git add lite/web/circular-buffer.js
git commit -m "feat(lite): add CircularBuffer from Full version (adapted to JS)"

# Задача 4.2
# ... скопировать chart-manager.ts ...
git add lite/web/chart-manager.js
git commit -m "feat(lite): add ChartManager from Full version (adapted to JS)"

# Задача 4.3
# ... обновить index.html ...
git add lite/web/index.html
git commit -m "feat(lite): add 3 chart containers to HTML"

# Задача 4.4
# ... обновить app.js ...
git add lite/web/app.js
git commit -m "feat(lite): initialize ChartManager and connect to ecu-data stream"

# Задача 4.5
# ... добавить кнопки Start/Stop ...
git add lite/web/index.html lite/web/app.js lite/web/styles.css
git commit -m "feat(lite): add Start/Stop buttons to control panel"

# Задача 4.6
# ... протестировать ...
# (никаких изменений файлов, просто тест)

# После Этапа 4
git tag v0.1.0-lite-stage4
```

### Как откатиться назад

#### Откатиться на 1 коммит назад:
```bash
git log --oneline  # посмотреть историю
git reset --hard HEAD~1  # откатиться на 1 коммит
```

#### Откатиться на конкретный этап:
```bash
# Посмотреть все теги
git tag

# Откатиться на Этап 2
git checkout v0.1.0-lite-stage2

# Вернуться к разработке
git checkout lite-version
```

#### Откатиться на конкретную задачу:
```bash
# Посмотреть историю с сообщениями
git log --oneline --grep="lite"

# Найти хеш нужного коммита, например abc1234
git reset --hard abc1234
```

#### Полный откат - удалить всё и начать заново:
```bash
# Вернуться в main (Full версия)
git checkout main

# Удалить ветку lite-version
git branch -D lite-version

# Создать заново
git checkout -b lite-version
```

### Защита от ошибок

#### ✅ Что безопасно:
- Создавать папку `lite/` - новая папка, не влияет на Full версию
- Создавать файлы в `lite/` - все файлы изолированы
- Импортировать классы из `src/main/` - только чтение, без изменений
- Делать коммиты в ветке `lite-version`

#### ❌ Что НЕЛЬЗЯ делать:
- ❌ Изменять файлы в `src/` (Full версия)
- ❌ Изменять `package.json` в корне (только для Full версии)
- ❌ Изменять `index.html` в корне (только для Full версии)
- ❌ Удалять файлы из `src/`, `docs/`
- ❌ Коммитить в `main` напрямую

### Мёрж в main после завершения

```bash
# После успешного тестирования Этапа 4:

# 1. Убедиться что всё работает
npm start  # в lite/

# 2. Переключиться в main
git checkout main

# 3. Смержить lite-version
git merge lite-version

# 4. Создать релизный тег
git tag v0.1.0-lite

# 5. Запушить (если нужно)
git push origin main
git push origin v0.1.0-lite
```

### Проверка статуса

```bash
# Текущая ветка
git branch

# Список изменённых файлов
git status

# История коммитов
git log --oneline --graph --decorate

# Все теги
git tag

# Список файлов в lite/
ls -la lite/
```

### Пример полного процесса

```bash
# ========================================
# НАЧАЛО РАБОТЫ
# ========================================

# 1. Проверить текущую ветку
git branch
# * main

# 2. Создать ветку lite-version
git checkout -b lite-version
# Switched to a new branch 'lite-version'

# ========================================
# ЭТАП 1 - Задача 1.1
# ========================================

# 3. Создать папку
mkdir lite

# 4. Коммит
git add lite/
git commit -m "feat(lite): create lite/ folder structure"

# ========================================
# ЭТАП 1 - Задача 1.2
# ========================================

# 5. Создать package.json
cat > lite/package.json << 'EOF'
{
  "name": "ecu-tuner-lite",
  ...
}
EOF

# 6. Коммит
git add lite/package.json
git commit -m "feat(lite): add package.json with Node.js 16 dependencies"

# ... продолжать для всех задач ...

# ========================================
# ПОСЛЕ ЭТАПА 1
# ========================================

# 7. Создать тег
git tag v0.1.0-lite-stage1

# 8. Проверить историю
git log --oneline
# abc1234 feat(lite): install npm dependencies
# def5678 feat(lite): add .gitignore
# ...

# ========================================
# ЕСЛИ ЧТО-ТО СЛОМАЛОСЬ
# ========================================

# 9. Откатиться на Этап 1
git checkout v0.1.0-lite-stage1

# 10. Вернуться к разработке
git checkout lite-version
```

---

## 🚀 Этапы разработки

---

### Этап 1: Создание структуры lite/ ✅ ЗАВЕРШЁН

**Цель:** Создать базовую структуру проекта Lite версии

**Задачи:**

- [X] **1.1** Создать папку `lite/` в корне проекта (5 мин) ✅
  - Путь: `/Users/mactm/Projects/electron_prototype/lite/`
  - Команда: `mkdir lite`
  - Коммит: `92de832`

- [X] **1.2** Создать `lite/package.json` (10 мин) ✅
  - Коммит: `e0c0e8b`
  ```json
  {
    "name": "ecu-tuner-lite",
    "version": "0.1.0-lite",
    "description": "ECU Tuner Lite - Node.js server version",
    "main": "dist/server.js",
    "bin": "dist/server.js",
    "engines": {
      "node": "16.x"
    },
    "scripts": {
      "build": "tsc",
      "start": "node dist/server.js",
      "dev": "tsc && node dist/server.js"
    },
    "dependencies": {
      "express": "^4.18.2",
      "socket.io": "^4.6.0",
      "open": "^8.4.0"
    },
    "devDependencies": {
      "typescript": "^5.3.3",
      "@types/node": "^20.10.0",
      "@types/express": "^4.17.21"
    }
  }
  ```

- [X] **1.3** Создать `lite/tsconfig.json` (5 мин) ✅
  - Коммит: `76a0589`
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "module": "commonjs",
      "lib": ["ES2020"],
      "outDir": "./dist",
      "rootDir": "./",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "moduleResolution": "node",
      "resolveJsonModule": true
    },
    "include": ["*.ts", "../src/main/*.ts"],
    "exclude": ["node_modules", "dist"]
  }
  ```

- [X] **1.4** Создать папку `lite/web/` (5 мин) ✅
  - Команда: `mkdir lite/web`
  - Эта папка будет содержать frontend файлы
  - Коммит: `900517a`

- [X] **1.5** Создать `lite/.gitignore` (2 мин) ✅
  - Коммит: `252c99e`
  ```
  node_modules/
  dist/
  *.log
  ```

- [X] **1.6** Установить зависимости (5 мин) ✅
  - Команда: `cd lite && npm install`
  - Проверка: `ls node_modules/` должен показать express, socket.io, open
  - Коммит: `8f184cd`
  - Установлено: 107 пакетов

**Результат Этапа 1:** ✅ ЗАВЕРШЁН
```
lite/
├── package.json       ✅ СОЗДАН
├── tsconfig.json      ✅ СОЗДАН
├── .gitignore         ✅ СОЗДАН
├── node_modules/      ✅ УСТАНОВЛЕНЫ
└── web/               ✅ СОЗДАНА (пустая)
```

**Критерий завершения:** `npm install` успешно выполнен без ошибок

---

### Этап 2: Node.js сервер с Express + Socket.IO ⏳

**Цель:** Создать работающий веб-сервер с автозапуском браузера

**Задачи:**

- [ ] **2.1** Создать `lite/server.ts` - базовый Express сервер (20 мин)
  ```typescript
  import express from 'express';
  import http from 'http';
  import { Server as SocketIO } from 'socket.io';
  import open from 'open';
  import path from 'path';

  const app = express();
  const server = http.createServer(app);
  const io = new SocketIO(server);
  const PORT = 3000;

  // Раздаём статические файлы из web/
  app.use(express.static(path.join(__dirname, '../web')));

  // Запускаем сервер
  server.listen(PORT, async () => {
    console.log(`[Server] Running at http://localhost:${PORT}`);

    // Автоматически открываем браузер
    try {
      await open(`http://localhost:${PORT}`);
      console.log('[Server] Browser opened automatically');
    } catch (err) {
      console.error('[Server] Failed to open browser. Please open manually: http://localhost:3000');
    }
  });

  // WebSocket connection handler
  io.on('connection', (socket) => {
    console.log('[WebSocket] Client connected');

    socket.on('disconnect', () => {
      console.log('[WebSocket] Client disconnected');
    });
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('[Server] Shutting down...');
    server.close(() => {
      console.log('[Server] Closed');
      process.exit(0);
    });
  });
  ```

- [ ] **2.2** Создать `lite/web/index.html` - базовый интерфейс (15 мин)
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ECU Tuner Lite v0.1.0</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <div id="app">
      <header>
        <h1>ECU Tuner Lite</h1>
        <p>Version 0.1.0-lite | Status: <span id="status">Connecting...</span></p>
      </header>

      <main>
        <div id="charts">
          <div class="chart-container" id="chart1"></div>
          <div class="chart-container" id="chart2"></div>
          <div class="chart-container" id="chart3"></div>
        </div>
      </main>
    </div>

    <!-- Socket.IO Client -->
    <script src="https://cdn.socket.io/4.6.0/socket.io.min.js"></script>

    <!-- uPlot -->
    <script src="https://cdn.jsdelivr.net/npm/uplot@1.6.30/dist/uPlot.iife.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uplot@1.6.30/dist/uPlot.min.css">

    <!-- App logic -->
    <script src="app.js"></script>
  </body>
  </html>
  ```

- [ ] **2.3** Создать `lite/web/styles.css` - базовые стили (10 мин)
  ```css
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #1a1a1a;
    color: #e0e0e0;
  }

  header {
    background: #2a2a2a;
    padding: 20px;
    border-bottom: 2px solid #3a3a3a;
  }

  header h1 {
    font-size: 24px;
    color: #4ade80;
  }

  #status {
    color: #fbbf24;
    font-weight: bold;
  }

  #charts {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .chart-container {
    background: #2a2a2a;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #3a3a3a;
  }
  ```

- [ ] **2.4** Создать `lite/web/app.js` - базовая логика Socket.IO (15 мин)
  ```javascript
  // Socket.IO connection
  const socket = io('http://localhost:3000');

  // Connection status
  const statusElement = document.getElementById('status');

  socket.on('connect', () => {
    console.log('[WebSocket] Connected');
    statusElement.textContent = 'Connected';
    statusElement.style.color = '#4ade80';
  });

  socket.on('disconnect', () => {
    console.log('[WebSocket] Disconnected');
    statusElement.textContent = 'Disconnected';
    statusElement.style.color = '#ef4444';
  });

  // Test message
  socket.on('test-message', (data) => {
    console.log('[WebSocket] Received:', data);
  });

  console.log('[App] Initialized');
  ```

- [ ] **2.5** Скомпилировать и протестировать (10 мин)
  - Команда: `cd lite && npm run build`
  - Команда: `npm start`
  - Проверка: Браузер открывается автоматически, показывает "Connected"

**Результат Этапа 2:**
- ✅ Express сервер работает на localhost:3000
- ✅ Браузер открывается автоматически
- ✅ Socket.IO подключение установлено
- ✅ Статус "Connected" в интерфейсе
- ✅ Нет ошибок в консоли

**Критерий завершения:** `npm start` → браузер открывается → статус "Connected"

---

### Этап 3: Интеграция DataGenerator ⏳

**Цель:** Подключить существующий DataGenerator для генерации 300 параметров @ 25Hz

**Задачи:**

- [ ] **3.1** Импортировать классы из Full версии в `lite/server.ts` (10 мин)
  ```typescript
  // Добавить в начало server.ts:
  import { DataGenerator } from '../src/main/data-generator';
  import { PrecisionTimer } from '../src/main/precision-timer';
  import { DataPacket } from '../src/main/types';
  ```

- [ ] **3.2** Инициализировать DataGenerator и PrecisionTimer (15 мин)
  ```typescript
  // Добавить после создания io:

  // Инициализация генератора данных
  const dataGen = new DataGenerator(300); // 300 параметров
  let sequenceNumber = 0;
  let isRunning = false;

  // Precision timer 40ms (25Hz)
  const timer = new PrecisionTimer(40);

  timer.on('tick', () => {
    if (!isRunning) return;

    // Генерируем пакет данных
    const packet: DataPacket = dataGen.generatePacket(sequenceNumber++);

    // Отправляем в браузер через WebSocket
    io.emit('ecu-data', packet);

    // Логируем каждый 100-й пакет
    if (sequenceNumber % 100 === 0) {
      console.log(`[DataGen] Sent packet #${sequenceNumber}`);
    }
  });
  ```

- [ ] **3.3** Добавить команды Start/Stop через WebSocket (15 мин)
  ```typescript
  // Добавить в io.on('connection'):

  socket.on('start-simulation', () => {
    console.log('[Server] Starting simulation...');
    sequenceNumber = 0;
    isRunning = true;
    timer.start();
    socket.emit('simulation-status', { running: true });
  });

  socket.on('stop-simulation', () => {
    console.log('[Server] Stopping simulation...');
    isRunning = false;
    timer.stop();
    socket.emit('simulation-status', { running: false });
  });
  ```

- [ ] **3.4** Добавить обработчик в `lite/web/app.js` (10 мин)
  ```javascript
  // Добавить после socket.on('disconnect'):

  // Получение данных ЭБУ
  socket.on('ecu-data', (packet) => {
    console.log('[Data] Received packet:', packet.sequenceNumber);
    // TODO: Этап 4 - отправить в графики
  });

  // Тестовая команда
  setTimeout(() => {
    console.log('[Test] Starting simulation...');
    socket.emit('start-simulation');
  }, 2000);
  ```

**Результат Этапа 3:**
- ✅ DataGenerator генерирует 300 параметров
- ✅ PrecisionTimer работает @ 25Hz
- ✅ Данные отправляются в браузер через WebSocket
- ✅ Команды Start/Stop работают
- ✅ Консоль браузера показывает входящие пакеты

**Критерий завершения:** Консоль браузера логирует "Received packet: 0, 1, 2, ..." каждые 40ms

---

### Этап 4: Интеграция графиков uPlot ⏳

**Цель:** Подключить существующий ChartManager для отображения 3 графиков в реальном времени

**Задачи:**

- [ ] **4.1** Скопировать `src/renderer/circular-buffer.ts` → `lite/web/circular-buffer.js` (10 мин)
  - Команда: `cp src/renderer/circular-buffer.ts lite/web/circular-buffer.ts`
  - Убрать TypeScript типы, оставить только логику
  - Экспортировать как ES6 module

- [ ] **4.2** Скопировать `src/renderer/chart-manager.ts` → `lite/web/chart-manager.js` (15 мин)
  - Команда: `cp src/renderer/chart-manager.ts lite/web/chart-manager.ts`
  - Убрать TypeScript типы
  - Заменить импорты: `import uPlot from 'uplot'` → использовать глобальный `window.uPlot`
  - Экспортировать как ES6 module

- [ ] **4.3** Обновить `lite/web/index.html` - добавить контейнеры графиков (10 мин)
  ```html
  <!-- Заменить <div id="charts"> на: -->
  <div id="charts">
    <div class="chart-wrapper">
      <h3>Chart 1: Parameters 0-2</h3>
      <div class="chart-container" id="chart1"></div>
    </div>
    <div class="chart-wrapper">
      <h3>Chart 2: Parameters 3-5</h3>
      <div class="chart-container" id="chart2"></div>
    </div>
    <div class="chart-wrapper">
      <h3>Chart 3: Parameters 6-8</h3>
      <div class="chart-container" id="chart3"></div>
    </div>
  </div>
  ```

- [ ] **4.4** Обновить `lite/web/app.js` - инициализировать ChartManager (20 мин)
  ```javascript
  // Импортировать модули
  import { ChartManager } from './chart-manager.js';

  // Инициализация графиков после загрузки DOM
  let chartManager = null;

  document.addEventListener('DOMContentLoaded', () => {
    const containers = [
      document.getElementById('chart1'),
      document.getElementById('chart2'),
      document.getElementById('chart3')
    ];

    chartManager = new ChartManager(containers);
    console.log('[Charts] Initialized');
  });

  // Обновить обработчик ecu-data:
  socket.on('ecu-data', (packet) => {
    if (chartManager) {
      chartManager.updateCharts(packet);
    }
  });
  ```

- [ ] **4.5** Добавить кнопки Start/Stop в интерфейс (15 мин)
  ```html
  <!-- Добавить в <header> после <p>: -->
  <div class="controls">
    <button id="startBtn" class="btn btn-primary">Start Simulation</button>
    <button id="stopBtn" class="btn btn-secondary">Stop Simulation</button>
  </div>
  ```

  ```javascript
  // Добавить в app.js:
  document.getElementById('startBtn').addEventListener('click', () => {
    socket.emit('start-simulation');
  });

  document.getElementById('stopBtn').addEventListener('click', () => {
    socket.emit('stop-simulation');
  });
  ```

- [ ] **4.6** Протестировать полный цикл (15 мин)
  - Запустить: `npm start`
  - Нажать "Start Simulation"
  - Проверить: 3 графика обновляются плавно @ 25Hz
  - Проверить: нет ошибок в консоли
  - Нажать "Stop Simulation"
  - Проверить: графики перестали обновляться

**Результат Этапа 4:**
- ✅ 3 графика uPlot отображаются в браузере
- ✅ Графики обновляются в реальном времени @ 25Hz
- ✅ 300 параметров обрабатываются без тормозов
- ✅ Кнопки Start/Stop работают
- ✅ ChartManager использует существующий код!
- ✅ FPS стабильно ≥55

**Критерий завершения:**
- Все 3 графика работают плавно
- Нет ошибок в консоли браузера и Node.js
- Визуально плавное обновление (без лагов)

---

## 🔧 Технические детали

### Архитектура Lite версии

```
┌─────────────────────────────────────────┐
│         Browser (Chrome/Firefox)         │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Frontend (lite/web/)              │ │
│  │  - index.html (UI)                 │ │
│  │  - app.js (Socket.IO client)       │ │
│  │  - chart-manager.js (uPlot)        │ │
│  │  - circular-buffer.js              │ │
│  └────────────────────────────────────┘ │
│                                          │
└──────────────┬───────────────────────────┘
               │ WebSocket (Socket.IO)
┌──────────────┴───────────────────────────┐
│         Node.js 16 Server                 │
│         (lite/server.ts)                  │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │  Express HTTP Server               │  │
│  │  - Static files (lite/web/)        │  │
│  │  - Port: 3000                      │  │
│  └────────────────────────────────────┘  │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │  Socket.IO WebSocket               │  │
│  │  - Real-time data streaming        │  │
│  │  - Commands (start/stop)           │  │
│  └────────────────────────────────────┘  │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │  DataGenerator (ГОТОВЫЙ!)          │  │
│  │  - 300 параметров @ 25Hz           │  │
│  │  - Плавные переходы                │  │
│  └────────────────────────────────────┘  │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │  PrecisionTimer (ГОТОВЫЙ!)         │  │
│  │  - 40ms интервал                   │  │
│  │  - Drift compensation              │  │
│  └────────────────────────────────────┘  │
└───────────────────────────────────────────┘
```

### Технологический стек

| Компонент | Технология | Версия | Назначение |
|-----------|-----------|--------|------------|
| **Runtime** | Node.js | 16.20.2 | Последняя LTS для Windows 7 |
| **HTTP Server** | Express | 4.18.2 | Раздача статических файлов |
| **WebSocket** | Socket.IO | 4.6.0 | Real-time коммуникация |
| **Графики** | uPlot | 1.6.30 | High-performance charts |
| **Автозапуск** | Open | 8.4.0 | Открытие браузера |
| **TypeScript** | TypeScript | 5.3.3 | Type safety |
| **Упаковка** | pkg | 5.8.0 | Node.js → .exe |

### Порты

- **HTTP Server:** `localhost:3000`
- **WebSocket:** `localhost:3000` (тот же порт)

---

## 📁 Карта файлов для переиспользования

Эта таблица показывает какие файлы из Full версии использовать в Lite версии:

| Существующий файл (Full) | Использование в Lite | Изменения |
|--------------------------|---------------------|-----------|
| `src/main/data-generator.ts` | `lite/server.ts` (импорт напрямую) | ✅ Без изменений |
| `src/main/precision-timer.ts` | `lite/server.ts` (импорт напрямую) | ✅ Без изменений |
| `src/main/types.ts` | `lite/server.ts` (импорт напрямую) | ✅ Без изменений |
| `src/renderer/chart-manager.ts` | `lite/web/chart-manager.js` | ⚠️ Убрать TypeScript типы, использовать window.uPlot |
| `src/renderer/circular-buffer.ts` | `lite/web/circular-buffer.js` | ⚠️ Убрать TypeScript типы |
| `src/renderer/renderer.ts` | `lite/web/app.js` | ⚠️ Заменить IPC на Socket.IO |
| `index.html` | `lite/web/index.html` | ⚠️ Подключить Socket.IO CDN, изменить стили |

### Что менять при адаптации

**Было (Electron IPC):**
```typescript
// src/renderer/renderer.ts
window.electronAPI.onDataPacket((packet: DataPacket) => {
  chartManager.updateCharts(packet);
});
```

**Стало (Socket.IO):**
```javascript
// lite/web/app.js
socket.on('ecu-data', (packet) => {
  chartManager.updateCharts(packet);
});
```

---

## 📦 Упаковка в .exe (Этап 5 - опционально)

**После успешного завершения Этапов 1-4, можно упаковать в .exe:**

### Установка pkg

```bash
npm install -g pkg
```

### Обновление package.json

```json
{
  "bin": "dist/server.js",
  "pkg": {
    "assets": [
      "web/**/*"
    ],
    "targets": [
      "node16-win-x64"
    ],
    "outputPath": "dist"
  }
}
```

### Сборка .exe

```bash
cd lite/
pkg . --output ECU_Tuner_Lite.exe
```

### Результат

- `ECU_Tuner_Lite.exe` (~10-15 MB)
- Работает на Windows 7 SP1+
- Включает Node.js 16 runtime
- Все зависимости упакованы

---

## ✅ Критерии приемки

### После Этапа 1:
- [ ] Папка `lite/` создана
- [ ] `package.json` и `tsconfig.json` созданы
- [ ] `npm install` выполнен успешно

### После Этапа 2:
- [ ] `npm start` запускает сервер
- [ ] Браузер открывается автоматически
- [ ] WebSocket подключение установлено
- [ ] Статус "Connected" отображается

### После Этапа 3:
- [ ] DataGenerator генерирует данные
- [ ] PrecisionTimer работает @ 25Hz
- [ ] Данные передаются в браузер через WebSocket
- [ ] Команды Start/Stop работают

### После Этапа 4 (Proof of Concept):
- [ ] 3 графика uPlot отображаются
- [ ] Графики обновляются плавно @ 25Hz
- [ ] 300 параметров обрабатываются без тормозов
- [ ] FPS ≥55
- [ ] Нет ошибок в консоли
- [ ] Кнопки Start/Stop работают корректно

---

## 🛠️ Команды для работы

### Разработка

```bash
# Установка зависимостей
cd lite/
npm install

# Компиляция TypeScript
npm run build

# Запуск сервера
npm start

# Режим разработки (компиляция + запуск)
npm run dev
```

### Отладка

```bash
# Проверка структуры
ls -la lite/

# Проверка зависимостей
cd lite/ && npm list

# Просмотр логов сервера
npm start | tee server.log
```

### Тестирование

```bash
# Запуск в другом браузере
open -a Firefox http://localhost:3000
open -a "Google Chrome" http://localhost:3000

# Проверка порта
lsof -i :3000

# Убить процесс на порту 3000
kill $(lsof -t -i:3000)
```

---

## 🚨 Troubleshooting

### Проблема: Порт 3000 занят

**Ошибка:** `Error: listen EADDRINUSE: address already in use :::3000`

**Решение:**
```bash
# Найти процесс
lsof -i :3000

# Убить процесс
kill $(lsof -t -i:3000)

# Или использовать другой порт в server.ts
const PORT = 3001;
```

### Проблема: Браузер не открывается

**Ошибка:** `Failed to open browser`

**Решение:**
- Открыть вручную: `http://localhost:3000`
- Проверить установку браузера: `which chrome`

### Проблема: WebSocket не подключается

**Ошибка:** `WebSocket connection failed`

**Решение:**
- Проверить что сервер запущен: `curl http://localhost:3000`
- Проверить firewall/антивирус
- Проверить консоль браузера на ошибки CORS

### Проблема: Графики не отображаются

**Ошибка:** `uPlot is not defined`

**Решение:**
- Проверить что uPlot CDN загружен в `index.html`
- Проверить консоль браузера: `console.log(window.uPlot)`
- Убедиться что ChartManager инициализируется после DOMContentLoaded

### Проблема: TypeScript ошибки компиляции

**Ошибка:** `Cannot find module '../src/main/data-generator'`

**Решение:**
- Проверить `tsconfig.json` - `include: ["*.ts", "../src/main/*.ts"]`
- Проверить путь импорта: `import { DataGenerator } from '../src/main/data-generator'`
- Запустить из корневой папки проекта, не из `lite/`

---

## 📝 Обновления документации

### ⚠️ ВАЖНО: После каждой задачи!

После **КАЖДОЙ** выполненной задачи из roadmap делать:

#### 1. Git коммит (обязательно!)

```bash
# Добавить изменённые файлы
git add lite/

# Сделать коммит с осмысленным сообщением
git commit -m "feat(lite): описание выполненной задачи"
```

**Примеры коммитов:**
- Задача 1.1: `git commit -m "feat(lite): create lite/ folder structure"`
- Задача 1.2: `git commit -m "feat(lite): add package.json with Node.js 16 dependencies"`
- Задача 2.1: `git commit -m "feat(lite): add Express server with Socket.IO"`

**Подробности:** См. секцию "Git Workflow - Безопасная разработка" выше.

#### 2. Обновить roadmap_lite.md (этот файл)

```markdown
# Отметить задачу как выполненную
- [X] 1.1 Создать папку lite/

# Обновить "Текущий статус"
- **Прогресс:** 1/21 задач выполнено (4.8%)
- **Текущая задача:** Задача 1.2 - package.json
```

#### 3. После каждого этапа - создать git tag

```bash
# После Этапа 1
git tag v0.1.0-lite-stage1

# После Этапа 2
git tag v0.1.0-lite-stage2

# И т.д.
```

#### 4. После завершения Этапов 1-4 обновить:

**CHANGELOG.md:**
```markdown
## [0.1.0-lite] - 2025-10-27

### Added
- Lite версия для Windows 7 SP1+
- Node.js 16 + Express + Socket.IO архитектура
- 95% переиспользование кода из Full версии
- 3 графика uPlot в браузере @ 25Hz
- 300 параметров обработка без тормозов

### Technical Details
- Размер: ~10-15 MB
- Browser-based UI
- WebSocket real-time communication
```

**AI_HANDOFF.md:**
- Обновить статус Lite версии
- Обновить "Прогресс" с количеством задач

---

## 📞 Контакты и помощь

**Если застрял на этапе:**
1. Прочитай секцию Troubleshooting выше
2. Проверь официальную документацию:
   - Express: https://expressjs.com/
   - Socket.IO: https://socket.io/docs/v4/
   - uPlot: https://github.com/leeoniya/uPlot
3. Изучи существующий код Full версии
4. Открой issue в репозитории

**Для восстановления контекста в новом чате:**
1. Открой `roadmap_lite.md` (этот файл)
2. Проверь "Текущий статус" - какие задачи выполнены
3. Продолжи с первой невыполненной задачи
4. Следуй инструкциям этапа

---

**Последнее обновление:** 27 октября 2025
**Версия документа:** 1.0
**Автор:** Claude Code AI Agent
