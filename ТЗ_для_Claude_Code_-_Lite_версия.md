# Техническое задание: ECU Tuner Lite Version

**Версия:** 2.0  
**Дата:** 27 октября 2025  
**Для:** Claude Code  
**От:** Инженер проекта  
**GitHub:** https://github.com/engsimsoft/electron-ecu-prototype

---

## 🎯 Цель

Создать **облегченную версию** ECU Tuner для старых компьютеров Windows на основе **существующего Electron проекта**. Lite версия будет работать через браузер пользователя вместо Electron.

## ⚠️ ВАЖНО: Проект УЖЕ существует!

**Существующий проект на GitHub:**
- Репозиторий: https://github.com/engsimsoft/electron-ecu-prototype
- Структура: TypeScript + Electron + Vite + uPlot
- Статус: Full версия (Electron) полностью реализована и протестирована
- Тесты: Стресс-тест с 300 параметрами пройден успешно ✅

**Твоя задача:**
- ❌ НЕ создавать проект с нуля
- ✅ АДАПТИРОВАТЬ существующий код для Lite версии
- ✅ ИСПОЛЬЗОВАТЬ существующие компоненты (web/, логика обработки данных)
- ✅ СОЗДАТЬ новую папку `lite/` в корне проекта

---

## 📋 Контекст

### Существующий проект (Full версия)

**Текущая реализация в GitHub:**
```
electron-ecu-prototype/
├── src/
│   ├── main/
│   │   ├── main.ts              ← Electron main process
│   │   ├── data-generator.ts    ← Генерация 300 параметров
│   │   ├── precision-timer.ts   ← 25Hz таймер
│   │   └── types.ts             ← TypeScript типы
│   ├── renderer/
│   │   ├── renderer.ts          ← UI логика
│   │   ├── chart-manager.ts     ← uPlot графики (3 штуки)
│   │   └── circular-buffer.ts   ← Буфер для данных
│   ├── preload/
│   │   └── preload.ts           ← IPC bridge
│   └── index.html               ← UI разметка
├── forge.config.ts              ← Electron Forge
├── package.json
└── tsconfig.json
```

**Характеристики Full версии:**
- Electron 34.0.0
- Node.js 20.18.1
- TypeScript 5.3.3
- Vite 5.4.21 (bundler)
- uPlot 1.6.30 (графики)
- Размер: ~150 MB
- Требования: Windows 10/11 (64-bit)
- Статус: ✅ Полностью реализована и протестирована

**Результаты тестов:**
- ✅ 300 параметров @ 25Hz
- ✅ Стресс-тест 5 минут пройден
- ✅ FPS: 60 (стабильно)
- ✅ CPU: <40%
- ✅ Memory: стабильная (no leaks)

### Проблема

**При попытке установить на старые Windows компьютеры:**
- Не удалось даже установить Node.js 18+
- Причина: Node.js 18+ требует Windows 8.1+ (64-bit)
- ~5% клиентов имеют Windows 7 SP1

### Решение: Lite версия

**ECU_Tuner_Lite.exe (новая реализация):**
- Node.js 16 (поддерживает Windows 7 SP1+)
- Размер: ~10-15 MB
- Работает через браузер пользователя (Chrome/Firefox/Edge)
- Локальный веб-сервер на localhost
- **Использует существующий код из `src/renderer/`** (95% общий!)
- Тот же функционал что и Full версия

---

## ✅ ОТВЕТЫ НА ВОПРОСЫ CLAUDE CODE

### 1. Целевая среда пользователей

#### Версии Windows
- **Минимальная:** Windows 7 SP1 (64-bit)
- **Целевые версии:** Windows 7 SP1, 8.1, 10, 11
- **Статистика клиентов:**
  - 90% - Windows 10/11 (используют Full версию)
  - 2% - Windows 8.1 (используют Full версию)
  - 5% - Windows 7 (используют Lite версию)
  - 3% - другие/проблемные (требуют помощи техподдержки)

#### Chrome/браузер
- **Требование:** ✅ Да, Chrome/Firefox/Edge должен быть установлен
- **Минимальная версия:** Chrome 90+ (2021), Firefox 88+ (2021), Edge 90+ (2021)
- **Prerequisite:** Да, можно требовать наличие браузера
- **Обоснование:** 
  - 95%+ пользователей Windows имеют современный браузер
  - Chrome установлен у ~80% пользователей Windows
  - Firefox/Edge - альтернативы

#### Миграция на Windows 10/11
- **Долгосрочное решение:** Рекомендовать клиентам обновление
- **Краткосрочное решение:** Lite версия для совместимости
- **Стратегия:** Поддерживать Windows 7 минимум 2 года (до ~2027)

---

### 2. Требования к приложению

#### UI и графики
- **Интерфейс:** ✅ Полноценный UI идентичный Full версии
- **Графики:** ✅ Те же 3 real-time графика uPlot
- **Библиотеки:**
  - uPlot для графиков (Canvas-based, очень быстрый)
  - Socket.IO для real-time коммуникации
  - Те же HTML/CSS/JS компоненты

#### Допустимость веб-приложения
- **Формат:** ✅ Веб-приложение в браузере ДОПУСТИМО
- **Важно:** Пользователь запускает .exe файл → автоматически открывается браузер
- **Опыт пользователя:** Максимально близкий к desktop приложению
- **Локальность:** 100% локально, интернет НЕ нужен

---

### 3. Ограничения

#### Размер дистрибутива
- **Целевой размер:** 10-15 MB
- **Максимальный размер:** 25 MB
- **Что включено:**
  - Node.js 16 runtime (~8 MB)
  - Веб-сервер (Express ~1 MB)
  - HTML/CSS/JS интерфейс (~2 MB)
  - Библиотеки (uPlot, Socket.IO ~2 MB)
  - SerialPort модуль (~1 MB)

#### Интернет
- **Требуется:** ❌ НЕТ
- **Работа:** 100% оффлайн
- **Сервер:** Локальный (localhost:3000)
- **Все файлы:** Упакованы в .exe

#### Архитектура
- **Тип:** ✅ Серверная архитектура (Node.js сервер + браузер как клиент)
- **Обоснование:** 
  - Node.js сервер работает с COM-портом
  - Браузер отображает UI
  - Коммуникация через WebSocket (localhost)
  - Всё работает локально

---

## 🏗️ Архитектура Lite версии

### Компоненты

```
ECU_Tuner_Lite.exe (10-15 MB)
│
├── Node.js 16 runtime (упакован)
│
├── server.js (main backend)
│   ├── Express HTTP сервер
│   ├── Socket.IO WebSocket сервер
│   ├── SerialPort (работа с COM-портом)
│   └── Auto-launch browser
│
└── web/ (frontend assets)
    ├── index.html
    ├── app.js (React/JS логика)
    ├── styles.css
    └── libraries/
        ├── uplot.min.js
        ├── socket.io.js
        └── chart-utils.js
```

### Процесс работы

```
1. Пользователь запускает ECU_Tuner_Lite.exe
   ↓
2. Node.js 16 стартует веб-сервер на localhost:3000
   ↓
3. Сервер открывает COM-порт (например, COM3)
   ↓
4. Автоматически запускается Chrome/Firefox
   ↓
5. Браузер загружает http://localhost:3000
   ↓
6. WebSocket соединение устанавливается
   ↓
7. Данные с COM-порта → Node.js → WebSocket → Браузер
   ↓
8. Команды из браузера → WebSocket → Node.js → COM-порт
```

---

## 💻 Техническая спецификация

### Backend (server.js)

**Технологии:**
- Node.js 16.20.2 (последняя LTS для Windows 7)
- Express 4.x (HTTP сервер)
- Socket.IO 4.x (WebSocket)
- SerialPort 12.x (COM-порт)
- Open 8.x (автозапуск браузера)

**Порты:**
- HTTP сервер: `localhost:3000`
- WebSocket: `localhost:3000` (тот же порт)

**Основные функции:**
```javascript
// 1. Запуск HTTP сервера
app.use(express.static('web'));
server.listen(3000);

// 2. Автозапуск браузера
const open = require('open');
open('http://localhost:3000');

// 3. Работа с COM-портом
const SerialPort = require('serialport');
const port = new SerialPort('COM3', { baudRate: 115200 });

// 4. WebSocket real-time
io.on('connection', (socket) => {
  // Отправка данных из COM-порта в браузер
  port.on('data', (data) => {
    socket.emit('ecu-data', parseECUData(data));
  });
  
  // Получение команд из браузера
  socket.on('send-command', (cmd) => {
    port.write(cmd);
  });
});
```

### Frontend (web/)

**Технологии:**
- HTML5
- CSS3 (или Tailwind CSS)
- JavaScript (ES6+) или React
- uPlot (графики)
- Socket.IO Client (WebSocket)

**Структура:**
```
web/
├── index.html          (основная страница)
├── app.js              (основная логика)
├── styles.css          (стили)
├── components/
│   ├── header.js       (шапка приложения)
│   ├── charts.js       (3 графика uPlot)
│   ├── tables.js       (таблицы параметров)
│   └── controls.js     (кнопки управления)
└── libraries/
    ├── uplot.min.js
    ├── socket.io.js
    └── react.min.js    (если используем React)
```

**Основные функции:**
```javascript
// 1. Подключение к WebSocket
const socket = io('http://localhost:3000');

// 2. Получение данных в реальном времени
socket.on('ecu-data', (data) => {
  updateCharts(data);   // Обновление графиков
  updateTables(data);   // Обновление таблиц
});

// 3. Отправка команд
function sendCommand(command) {
  socket.emit('send-command', command);
}

// 4. Инициализация uPlot графиков
const chart1 = new uPlot(opts, data, document.getElementById('chart1'));
const chart2 = new uPlot(opts, data, document.getElementById('chart2'));
const chart3 = new uPlot(opts, data, document.getElementById('chart3'));
```

---

## 📦 Упаковка в .exe

### Инструмент: pkg (Vercel)

**Почему pkg:**
- Упаковывает Node.js + код в один .exe
- Поддерживает Node.js 16
- Может упаковать assets (папку web/)
- Размер итогового .exe: ~10-15 MB

**package.json:**
```json
{
  "name": "ecu-tuner-lite",
  "version": "1.0.0",
  "main": "server.js",
  "bin": "server.js",
  "engines": {
    "node": "16.x"
  },
  "pkg": {
    "assets": [
      "web/**/*"
    ],
    "targets": [
      "node16-win-x64"
    ],
    "outputPath": "dist"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.6.0",
    "serialport": "^12.0.0",
    "open": "^8.4.0"
  },
  "devDependencies": {
    "pkg": "^5.8.0"
  }
}
```

**Команда сборки:**
```bash
# Установка зависимостей
npm install

# Упаковка в .exe
npx pkg . --output ECU_Tuner_Lite.exe

# Результат: ECU_Tuner_Lite.exe (~10-15 MB)
```

---

## 🔄 Совместное использование кода с Full версией

### Что общего (95% кода)

**Интерфейс (100% общий):**
- HTML файлы
- CSS стили
- JavaScript логика UI
- React компоненты (если используем)
- uPlot графики
- Все assets (иконки, изображения)

**Бизнес-логика (90% общая):**
- Парсинг данных ЭБУ
- Форматирование параметров
- Расчеты и конвертации
- Валидация команд

### Что разное (5% кода)

**Обертка:**
- Full: `main.js` (Electron main process)
- Lite: `server.js` (Express + Socket.IO)

**Запуск:**
- Full: `BrowserWindow` (Electron)
- Lite: `open('http://localhost:3000')` (системный браузер)

**Упаковка:**
- Full: `electron-builder`
- Lite: `pkg`

### Стратегия разработки

```
Проект/
├── shared/                  (общий код)
│   ├── web/                 (UI - 100% общий)
│   ├── logic/               (бизнес-логика - 90% общая)
│   └── protocols/           (протоколы ЭБУ)
│
├── electron/                (Full версия)
│   ├── main.js
│   ├── preload.js
│   └── package.json
│
└── lite/                    (Lite версия)
    ├── server.js
    └── package.json
```

**Процесс:**
1. Разрабатываем UI в `shared/web/` → работает в обеих версиях
2. Бизнес-логику в `shared/logic/` → используется обеими
3. Только обертки (main.js / server.js) разные

---

## 🎯 План реализации

### ВАЖНО: Используй существующий код!

**Что уже есть и НУЖНО переиспользовать:**
- ✅ `src/renderer/chart-manager.ts` - 3 графика uPlot (ГОТОВЫЕ!)
- ✅ `src/renderer/circular-buffer.ts` - буфер данных (ГОТОВЫЙ!)
- ✅ `src/main/data-generator.ts` - генерация 300 параметров (ГОТОВАЯ!)
- ✅ `src/main/precision-timer.ts` - 25Hz таймер (ГОТОВЫЙ!)
- ✅ `src/main/types.ts` - TypeScript типы DataPacket (ГОТОВЫЕ!)
- ✅ `index.html` - UI разметка (ГОТОВАЯ!)

**Что нужно СОЗДАТЬ:**
- 📁 Новая папка `lite/` в корне проекта
- 📄 `lite/server.ts` - Node.js сервер (Express + Socket.IO)
- 📄 `lite/package.json` - зависимости для Lite версии
- 📄 `lite/tsconfig.json` - TypeScript конфиг для Node.js 16
- 📁 `lite/web/` - копии файлов из `src/renderer/` (с минимальной адаптацией)

### Этап 1: Создание структуры Lite версии

**Задачи:**
1. Создать папку `lite/` в корне проекта
2. Создать `lite/package.json`:
   ```json
   {
     "name": "ecu-tuner-lite",
     "version": "1.0.0",
     "engines": {
       "node": "16.x"
     },
     "dependencies": {
       "express": "^4.18.2",
       "socket.io": "^4.6.0",
       "serialport": "^12.0.0",
       "open": "^8.4.0"
     }
   }
   ```
3. Создать `lite/tsconfig.json` для Node.js 16
4. Скопировать файлы из `src/renderer/` в `lite/web/`:
   - `chart-manager.ts` → `lite/web/chart-manager.js` (компилированный)
   - `circular-buffer.ts` → `lite/web/circular-buffer.js`
   - `renderer.ts` → `lite/web/app.js`
5. Скопировать `index.html` → `lite/web/index.html`

**Результат Этапа 1:**
```
lite/
├── server.ts               (СОЗДАТЬ)
├── package.json            (СОЗДАТЬ)
├── tsconfig.json           (СОЗДАТЬ)
└── web/                    (СОЗДАТЬ, скопировать из src/renderer/)
    ├── index.html          (копия из корня)
    ├── app.js              (адаптированный renderer.ts)
    ├── chart-manager.js    (скомпилированный)
    ├── circular-buffer.js  (скомпилированный)
    └── styles.css          (копия)
```

### Этап 2: Создание Node.js сервера

**Задачи:**
1. Создать `lite/server.ts` с Express:
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
   app.use(express.static(path.join(__dirname, 'web')));

   // Запускаем сервер
   server.listen(PORT, async () => {
     console.log(`Server: http://localhost:${PORT}`);
     
     // Автоматически открываем браузер
     await open(`http://localhost:${PORT}`);
   });

   // WebSocket для real-time данных
   io.on('connection', (socket) => {
     console.log('Client connected');
     // TODO: Этап 3 - интеграция генератора данных
   });
   ```

2. Скомпилировать TypeScript:
   ```bash
   cd lite/
   npm install
   npx tsc
   ```

3. Протестировать запуск:
   ```bash
   node dist/server.js
   ```

**Результат Этапа 2:**
- Запускается `node server.js`
- Открывается браузер на localhost:3000
- Отображается базовый интерфейс (пока без данных)

### Этап 3: Интеграция генератора данных

**Задачи:**
1. Скопировать логику из `src/main/data-generator.ts` в `lite/server.ts`:
   ```typescript
   import { DataGenerator } from '../src/main/data-generator';
   import { PrecisionTimer } from '../src/main/precision-timer';
   
   // Создаём генератор данных (существующий класс!)
   const dataGen = new DataGenerator();
   const timer = new PrecisionTimer(40); // 25Hz = 40ms
   
   // Отправляем данные в браузер через WebSocket
   timer.on('tick', () => {
     const data = dataGen.generatePacket();
     io.emit('ecu-data', data);
   });
   
   timer.start();
   ```

2. Убедиться что типы `DataPacket` импортируются из `src/main/types.ts`

3. Протестировать генерацию данных в браузере

**Результат Этапа 3:**
- Node.js генерирует 300 параметров @ 25Hz
- Данные отправляются в браузер через WebSocket
- Консоль браузера показывает входящие данные

### Этап 4: Интеграция графиков uPlot

**Задачи:**
1. Адаптировать `lite/web/app.js` для работы с Socket.IO:
   ```javascript
   import { ChartManager } from './chart-manager.js';
   import { CircularBuffer } from './circular-buffer.js';
   
   const socket = io('http://localhost:3000');
   
   // Используем СУЩЕСТВУЮЩИЙ ChartManager!
   const chartManager = new ChartManager(
     document.getElementById('chart1'),
     document.getElementById('chart2'),
     document.getElementById('chart3')
   );
   
   // Получаем данные и обновляем графики
   socket.on('ecu-data', (data) => {
     chartManager.updateCharts(data);
   });
   ```

2. Подключить uPlot библиотеку в `lite/web/index.html`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/uplot@1.6.30/dist/uPlot.iife.min.js"></script>
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uplot@1.6.30/dist/uPlot.min.css">
   ```

3. Протестировать отображение графиков

**Результат Этапа 4:**
- 3 графика отображаются в браузере
- Обновляются в реальном времени @ 25Hz
- Используется существующий код `ChartManager`!

### Этап 5: Интеграция COM-порта (опционально для прототипа)

**Задачи:**
1. Добавить SerialPort в `lite/server.ts`:
   ```typescript
   import { SerialPort } from 'serialport';
   
   const port = new SerialPort({
     path: 'COM3',
     baudRate: 115200
   });
   
   port.on('data', (data) => {
     // Парсим реальные данные с ЭБУ
     const ecuData = parseECUData(data);
     io.emit('ecu-data', ecuData);
   });
   ```

2. Добавить UI для выбора COM-порта

3. Протестировать с реальным устройством (если доступно)

**Результат Этапа 5:**
- Lite версия может работать с реальным COM-портом
- Или продолжать использовать симуляцию

### Этап 6: Упаковка в .exe

**Задачи:**
1. Установить `pkg`:
   ```bash
   npm install -g pkg
   ```

2. Обновить `lite/package.json`:
   ```json
   {
     "bin": "dist/server.js",
     "pkg": {
       "assets": [
         "web/**/*"
       ],
       "targets": [
         "node16-win-x64"
       ]
     }
   }
   ```

3. Собрать .exe:
   ```bash
   cd lite/
   pkg . --output ECU_Tuner_Lite.exe
   ```

4. Протестировать .exe на Windows 7:
   - Двойной клик на .exe
   - Должен открыться браузер
   - Всё должно работать

**Результат Этапа 6:**
- `ECU_Tuner_Lite.exe` (~10-15 MB)
- Работает на Windows 7 SP1+
- Автоматически открывает браузер
- Полный функционал

---

## 🔄 Переиспользование существующего кода

### ⚠️ КРИТИЧЕСКИ ВАЖНО: НЕ ПЕРЕПИСЫВАЙ ГОТОВЫЙ КОД!

**В проекте УЖЕ есть:**
- ✅ Генератор данных (300 параметров @ 25Hz) - ГОТОВ
- ✅ 3 графика uPlot - ГОТОВЫ
- ✅ Circular buffer - ГОТОВ
- ✅ Precision timer - ГОТОВ
- ✅ UI интерфейс - ГОТОВ

**Твоя задача:**
- Скопировать эти файлы в `lite/`
- Минимально адаптировать для работы с Socket.IO вместо IPC
- Всё остальное - БЕЗ изменений!

### Карта файлов: что откуда брать

| Существующий файл (Full) | Использование в Lite | Изменения |
|--------------------------|---------------------|-----------|
| `src/main/data-generator.ts` | `lite/server.ts` (импорт) | ✅ Без изменений |
| `src/main/precision-timer.ts` | `lite/server.ts` (импорт) | ✅ Без изменений |
| `src/main/types.ts` | `lite/server.ts` (импорт) | ✅ Без изменений |
| `src/renderer/chart-manager.ts` | `lite/web/chart-manager.js` | ⚠️ Убрать TypeScript типы |
| `src/renderer/circular-buffer.ts` | `lite/web/circular-buffer.js` | ⚠️ Убрать TypeScript типы |
| `src/renderer/renderer.ts` | `lite/web/app.js` | ⚠️ Заменить IPC на Socket.IO |
| `index.html` | `lite/web/index.html` | ⚠️ Подключить Socket.IO CDN |

### Что менять в renderer.ts → app.js

**Было (Electron IPC):**
```typescript
// src/renderer/renderer.ts
window.electronAPI.onECUData((data: DataPacket) => {
  chartManager.updateCharts(data);
});
```

**Стало (Socket.IO):**
```javascript
// lite/web/app.js
const socket = io('http://localhost:3000');

socket.on('ecu-data', (data) => {
  chartManager.updateCharts(data);
});
```

### Что менять в index.html

**Добавить в `<head>`:**
```html
<!-- Socket.IO Client -->
<script src="https://cdn.socket.io/4.6.0/socket.io.min.js"></script>

<!-- uPlot (уже есть в Full версии, но добавь CDN) -->
<script src="https://cdn.jsdelivr.net/npm/uplot@1.6.30/dist/uPlot.iife.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uplot@1.6.30/dist/uPlot.min.css">
```

### ChartManager - использовать БЕЗ изменений!

**Класс `ChartManager` УЖЕ готов и протестирован!**

```typescript
// src/renderer/chart-manager.ts (ГОТОВЫЙ КОД!)
export class ChartManager {
  private chart1: uPlot;
  private chart2: uPlot;
  private chart3: uPlot;
  
  constructor(container1: HTMLElement, container2: HTMLElement, container3: HTMLElement) {
    // Инициализация 3 графиков - ГОТОВО
  }
  
  updateCharts(data: DataPacket) {
    // Обновление всех 3 графиков - ГОТОВО
  }
}
```

**Просто скомпилируй его в JavaScript и используй в Lite версии!**

### DataGenerator - использовать БЕЗ изменений!

**Класс `DataGenerator` УЖЕ готов и протестирован!**

```typescript
// src/main/data-generator.ts (ГОТОВЫЙ КОД!)
export class DataGenerator {
  private data: Float64Array;
  
  constructor() {
    this.data = new Float64Array(300);
  }
  
  generatePacket(): DataPacket {
    // Генерация 300 параметров - ГОТОВО
    // Плавные переходы - ГОТОВО
    // Реалистичные значения - ГОТОВО
  }
}
```

**Просто импортируй его в `lite/server.ts`!**

### Пример server.ts с импортами готового кода

```typescript
// lite/server.ts
import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import open from 'open';

// ИМПОРТИРУЕМ ГОТОВЫЕ КЛАССЫ из Full версии!
import { DataGenerator } from '../src/main/data-generator';
import { PrecisionTimer } from '../src/main/precision-timer';
import { DataPacket } from '../src/main/types';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);
const PORT = 3000;

// Раздаём статические файлы
app.use(express.static('web'));

// ИСПОЛЬЗУЕМ ГОТОВЫЙ ГЕНЕРАТОР!
const dataGen = new DataGenerator();
const timer = new PrecisionTimer(40); // 25Hz

// ИСПОЛЬЗУЕМ ГОТОВЫЙ ТАЙМЕР!
timer.on('tick', () => {
  const packet: DataPacket = dataGen.generatePacket();
  io.emit('ecu-data', packet); // Отправляем в браузер
});

server.listen(PORT, async () => {
  console.log(`Server: http://localhost:${PORT}`);
  timer.start(); // Запускаем генерацию
  await open(`http://localhost:${PORT}`); // Открываем браузер
});

io.on('connection', (socket) => {
  console.log('Client connected');
});
```

**Видишь? Мы ИСПОЛЬЗУЕМ готовый код, а не пишем заново!**

---

## 🔧 Технические детали

### SerialPort конфигурация

```javascript
const SerialPort = require('serialport');

const port = new SerialPort('COM3', {
  baudRate: 115200,      // Скорость ЭБУ
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  autoOpen: true
});

// Парсер для бинарных данных
const parser = port.pipe(new SerialPort.parsers.ByteLength({ length: 64 }));

parser.on('data', (data) => {
  const ecuData = parseECUData(data);
  io.emit('ecu-data', ecuData);
});
```

### WebSocket протокол

**События от сервера к клиенту:**
```javascript
// Данные ЭБУ в реальном времени
socket.emit('ecu-data', {
  timestamp: Date.now(),
  rpm: 2500,
  throttle: 45,
  // ... 300 параметров
});

// Статус подключения к COM-порту
socket.emit('com-status', {
  connected: true,
  port: 'COM3'
});

// Ошибки
socket.emit('error', {
  message: 'COM port disconnected'
});
```

**События от клиента к серверу:**
```javascript
// Отправка команды в ЭБУ
socket.emit('send-command', {
  command: 'READ_RPM',
  data: [0x01, 0x02, 0x03]
});

// Запрос списка COM-портов
socket.emit('list-ports');
```

### Оптимизация производительности

**Батчинг данных (для 300 параметров):**
```javascript
// Вместо отправки каждого параметра отдельно
let buffer = [];
let lastEmit = Date.now();

parser.on('data', (data) => {
  buffer.push(parseECUData(data));
  
  // Отправляем батчем каждые 50ms
  if (Date.now() - lastEmit > 50) {
    io.emit('ecu-data-batch', buffer);
    buffer = [];
    lastEmit = Date.now();
  }
});
```

**Ограничение истории графиков:**
```javascript
// В браузере храним только последние N точек
const MAX_POINTS = 1000;

let chartData = {
  time: [],
  rpm: [],
  throttle: []
};

socket.on('ecu-data', (data) => {
  chartData.time.push(data.timestamp);
  chartData.rpm.push(data.rpm);
  chartData.throttle.push(data.throttle);
  
  // Удаляем старые точки
  if (chartData.time.length > MAX_POINTS) {
    chartData.time.shift();
    chartData.rpm.shift();
    chartData.throttle.shift();
  }
  
  chart.setData(chartData);
});
```

---

## 📱 Пользовательский опыт

### Первый запуск

```
1. Пользователь скачивает ECU_Tuner_Lite.exe

2. Двойной клик на .exe файл

3. Windows может показать предупреждение:
   "Windows защитил ваш компьютер"
   → Нажать "Подробнее" → "Выполнить в любом случае"

4. Автоматически открывается Chrome с localhost:3000

5. Пользователь видит интерфейс ECU Tuner

6. Всё работает! Интернет не нужен.
```

### Обычное использование

```
1. Двойной клик ECU_Tuner_Lite.exe

2. Через 2-3 секунды открывается браузер

3. Интерфейс загружается (<1 секунда)

4. Работа с ЭБУ как обычно

5. Закрыть вкладку браузера = остановить приложение
```

### Если браузер не установлен

```
При запуске .exe появится сообщение:

"Браузер не найден!

ECU Tuner Lite требует установленный браузер:
- Chrome (рекомендуется)
- Firefox
- Edge

Пожалуйста, установите один из браузеров и попробуйте снова.

Скачать Chrome: https://www.google.com/chrome"
```

---

## 🚨 Обработка ошибок

### COM-порт не найден

```javascript
port.on('error', (err) => {
  if (err.message.includes('Port does not exist')) {
    io.emit('error', {
      type: 'COM_NOT_FOUND',
      message: 'COM-порт не найден. Проверьте подключение.'
    });
  }
});
```

### Браузер не открывается

```javascript
try {
  await open('http://localhost:3000');
} catch (err) {
  console.error('Не удалось открыть браузер. Откройте вручную: http://localhost:3000');
}
```

### Порт 3000 занят

```javascript
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('Порт 3000 занят. Закройте другие приложения.');
    process.exit(1);
  }
});
```

---

## ✅ Критерии приемки

### Функциональность

- ✅ Запускается на Windows 7 SP1 (64-bit)
- ✅ Автоматически открывает браузер
- ✅ Работает с COM-портом (чтение + запись)
- ✅ Отображает 3 графика uPlot в реальном времени
- ✅ Обрабатывает 300 параметров без тормозов
- ✅ 100% оффлайн работа (интернет не нужен)
- ✅ Тот же функционал что Full версия

### Производительность

- ✅ Размер .exe: <15 MB
- ✅ Запуск приложения: <5 секунд
- ✅ Загрузка интерфейса: <2 секунд
- ✅ Обновление графиков: 60 FPS
- ✅ Задержка данных: <50ms
- ✅ RAM usage: <100 MB

### Совместимость

- ✅ Windows 7 SP1 (64-bit)
- ✅ Windows 8.1 (64-bit)
- ✅ Windows 10 (64-bit)
- ✅ Windows 11 (64-bit)
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+

### Надежность

- ✅ Корректная обработка ошибок COM-порта
- ✅ Graceful shutdown при закрытии браузера
- ✅ Автоматический реконнект WebSocket
- ✅ Нет memory leaks
- ✅ Нет crashes при длительной работе (8+ часов)

---

## 📚 Дополнительные материалы

### Ссылки на документацию

- **Node.js 16:** https://nodejs.org/docs/latest-v16.x/
- **Express:** https://expressjs.com/
- **Socket.IO:** https://socket.io/docs/v4/
- **SerialPort:** https://serialport.io/docs/
- **uPlot:** https://github.com/leeoniya/uPlot
- **pkg:** https://github.com/vercel/pkg

### Примеры кода

- **Electron to Browser:** https://github.com/electron/electron/blob/main/docs/tutorial/web-embeds.md
- **Node.js server + browser:** https://github.com/socketio/socket.io/tree/main/examples

---

## 🎉 Заключение

**Claude Code, у тебя есть ГОТОВАЯ кодовая база!**

### Что делать дальше:

1. **Клонируй репозиторий:**
   ```bash
   git clone https://github.com/engsimsoft/electron-ecu-prototype.git
   cd electron-ecu-prototype
   ```

2. **Изучи существующую структуру:**
   ```bash
   # Посмотри что уже есть
   ls -la src/
   
   # Изучи готовые классы
   cat src/main/data-generator.ts
   cat src/main/precision-timer.ts
   cat src/renderer/chart-manager.ts
   ```

3. **Создай ветку для Lite версии:**
   ```bash
   git checkout -b lite-version
   ```

4. **Начни с Этапа 1** - создай папку `lite/`:
   ```bash
   mkdir lite
   cd lite
   npm init -y
   ```

5. **Следуй плану реализации по этапам**
   - Не переходи к следующему этапу пока не работает текущий
   - Тестируй после каждого этапа
   - Делай коммиты после каждого этапа

6. **Используй готовый код максимально**
   - НЕ переписывай DataGenerator
   - НЕ переписывай ChartManager
   - НЕ переписывай PrecisionTimer
   - Просто импортируй и используй!

### Ключевые моменты:

🎯 **Цель:** Lite версия для старых Windows компьютеров  
🏗️ **Архитектура:** Node.js 16 + Express + Socket.IO + Browser  
📦 **Упаковка:** pkg → ECU_Tuner_Lite.exe (~10-15 MB)  
✅ **Критерий успеха:** Работает на Windows 7 SP1+, тот же функционал  
🔄 **Переиспользование:** 95% кода общий с Full версией!

### Структура, которую нужно создать:

```
electron-ecu-prototype/ (СУЩЕСТВУЮЩИЙ РЕПОЗИТОРИЙ)
│
├── src/                    (УЖЕ ЕСТЬ - Full версия)
│   ├── main/
│   ├── renderer/
│   └── preload/
│
├── lite/                   (СОЗДАТЬ - Lite версия)
│   ├── server.ts           (СОЗДАТЬ)
│   ├── package.json        (СОЗДАТЬ)
│   ├── tsconfig.json       (СОЗДАТЬ)
│   └── web/                (СОЗДАТЬ - скопировать из src/renderer/)
│       ├── index.html      (копия + Socket.IO CDN)
│       ├── app.js          (renderer.ts с Socket.IO)
│       ├── chart-manager.js
│       └── circular-buffer.js
│
└── package.json            (УЖЕ ЕСТЬ)
```

### Первые команды для старта:

```bash
# 1. Клонируй
git clone https://github.com/engsimsoft/electron-ecu-prototype.git
cd electron-ecu-prototype

# 2. Установи зависимости Full версии (для импорта классов)
npm install

# 3. Создай папку Lite
mkdir lite
cd lite

# 4. Создай package.json
cat > package.json << 'EOF'
{
  "name": "ecu-tuner-lite",
  "version": "1.0.0",
  "main": "dist/server.js",
  "engines": {
    "node": "16.x"
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
EOF

# 5. Установи зависимости Lite версии
npm install

# 6. Создай tsconfig.json
cat > tsconfig.json << 'EOF'
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
EOF

# 7. Теперь можешь создавать server.ts!
```

**Удачи! 🚀**

---

**Контакт:** Если есть вопросы по ТЗ - обратись к инженеру проекта  
**GitHub Issues:** Создавай issues в репозитории если что-то непонятно  
**Документация Full версии:** Смотри README.md и docs/ в репозитории
