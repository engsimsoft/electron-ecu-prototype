# Troubleshooting - Решение проблем

Руководство по решению частых проблем при разработке и тестировании.

## Установка и запуск

### ❌ `npm install` fails with EACCES error

**Проблема:**
```
npm ERR! code EACCES
npm ERR! syscall access
npm ERR! path /usr/local/lib/node_modules
```

**Причина:** Недостаточно прав для установки глобальных пакетов.

**Решение:**
```bash
# НЕ используйте sudo npm install!

# Вариант 1: Использовать nvm (рекомендуется)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
npm install

# Вариант 2: Изменить npm prefix
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install
```

### ❌ `npm start` не запускается

**Симптомы:**
```
> electron-ecu-prototype@1.0.0 start
> electron-forge start

Error: Cannot find module '@electron-forge/cli'
```

**Причина:** Зависимости не установлены полностью.

**Решение:**
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### ❌ Окно Electron не открывается

**Симптомы:** `npm start` завершается, но окно не появляется.

**Диагностика:**
```bash
# Проверить логи
npm start 2>&1 | tee start.log
cat start.log | grep -i error

# Проверить что Vite сервер запустился
# Должно быть:
# ✔ Launched Vite dev servers for renderer process code
```

**Частые причины:**

**1. Порт 5173 занят**
```bash
# Проверить что использует порт
lsof -i:5173

# Убить процесс
lsof -ti:5173 | xargs kill -9
```

**2. Build failed**
```bash
# Очистить cache
rm -rf .vite
npm start
```

## TypeScript ошибки

### ❌ Cannot find module 'electron'

**Симптомы:**
```typescript
// src/main.ts
import { app } from 'electron';
// Error: Cannot find module 'electron' or its corresponding type declarations.
```

**Причина:** Это предупреждение IDE, но **не влияет на работу**.

**Решение:** Игнорировать. Vite корректно резолвит модуль при сборке.

**Если очень мешает:**
```bash
npm install --save-dev @types/electron
```

### ❌ Property 'electronAPI' does not exist on type 'Window'

**Причина:** TypeScript не знает о типах из preload.ts.

**Решение:** Добавить reference в renderer.ts:
```typescript
/// <reference path="../preload/preload.d.ts" />
```

Или обновить `src/preload/preload.d.ts`:
```typescript
declare global {
  interface Window {
    electronAPI: {
      startSimulation: () => void;
      stopSimulation: () => void;
      // ...
    };
  }
}
```

## HMR (Hot Module Replacement)

### ❌ HMR не работает - изменения не применяются

**Симптомы:** Изменяешь код, но в окне Electron ничего не меняется.

**Причина 1:** Main Process не поддерживает HMR (только Renderer).

**Решение:** Перезапустить main process:
```bash
# В терминале где запущен npm start:
rs + Enter
```

**Причина 2:** Vite dev server упал.

**Решение:**
```bash
# Ctrl+C
npm start
```

**Причина 3:** Browser cache.

**Решение:**
```bash
# DevTools → Application → Clear storage → Clear site data
# Или
# Cmd+Shift+R (hard reload)
```

## Performance проблемы

### ❌ FPS падает ниже 55

**Диагностика:**
```bash
# DevTools → Performance → Record 10 sec
# Найти bottleneck (обычно: rendering или IPC)
```

**Причина 1:** Слишком много точек на графике.

**Решение:** Decimation
```typescript
// CircularBuffer - уменьшить capacity
const buffer = new CircularBuffer(750); // 30 сек вместо 60

// Или показывать каждую N-ю точку
const decimatedData = data.filter((_, i) => i % 2 === 0);
```

**Причина 2:** uPlot настройки.

**Решение:**
```typescript
// Оптимизировать uPlot options
{
  cursor: { show: false }, // Отключить cursor
  legend: { show: false }, // Отключить legend
  hooks: {},               // Нет лишних hooks
  plugins: []              // Нет plugins
}
```

**Причина 3:** Слишком частое обновление.

**Решение:** Throttling
```typescript
// Обновлять графики 30 FPS вместо 60
const frameInterval = 1000 / 30; // 33ms
```

### ❌ CPU usage > 40%

**Диагностика:**
```bash
# Activity Monitor → CPU → фильтр "Electron"
# Смотреть какой процесс больше всего ест
```

**Причина 1:** GPU процесс загружен.

**Решение:** GPU acceleration
```css
/* styles.css */
.chart-container {
  transform: translateZ(0); /* Force GPU */
  will-change: transform;
}
```

**Причина 2:** Слишком много IPC вызовов.

**Решение:** Batching
```typescript
// Вместо postMessage на каждый пакет:
// Собирать batch и отправлять раз в 100ms
```

### ❌ Memory leak - память растет

**Диагностика:**
```bash
# DevTools → Memory → Heap Snapshot
# Сравнить снимки "до" и "после" 5 минут работы
```

**Причина 1:** CircularBuffer растет безконтрольно.

**Решение:**
```typescript
class CircularBuffer {
  constructor(private capacity: number) {
    this.buffer = new Array(capacity); // ✅ Fixed size
  }

  push(item) {
    this.buffer[this.writeIndex] = item;
    this.writeIndex = (this.writeIndex + 1) % this.capacity; // ✅ Circular
  }
}
```

**Причина 2:** Event listeners не удаляются.

**Решение:**
```typescript
// При stopSimulation:
dataPort.removeEventListener('message', handleMessage);
dataPort.close(); // ✅ Закрыть MessagePort
```

**Причина 3:** Detached DOM nodes.

**Решение:**
```typescript
// При destroyCharts:
charts.forEach(chart => chart.destroy()); // ✅ Очистить uPlot
chartContainers.forEach(el => el.innerHTML = ''); // ✅ Очистить DOM
```

## IPC проблемы

### ❌ MessagePort не получает сообщения

**Симптомы:** Console показывает "Port received", но `onmessage` не срабатывает.

**Причина:** Забыли вызвать `port.start()`.

**Решение:**
```typescript
window.electronAPI.onPortReceived((port) => {
  dataPort = port;
  dataPort.onmessage = (event) => {
    handleDataPacket(event.data);
  };
  dataPort.start(); // ✅ ОБЯЗАТЕЛЬНО!
});
```

### ❌ Latency > 50ms

**Диагностика:**
```typescript
// В renderer.ts
function handleDataPacket(packet) {
  const latency = Date.now() - packet.timestamp;
  console.log('Latency:', latency, 'ms');
}
```

**Причина 1:** Main Process перегружен.

**Решение:** Упростить генерацию данных
```typescript
// Использовать TypedArray вместо обычного массива
const values = new Float64Array(300); // ✅ Быстрее
```

**Причина 2:** Structured clone медленный.

**Решение:** Уже используем Float64Array (быстрее JSON в 2 раза).

## Build проблемы

### ❌ `npm run package` fails

**Симптомы:**
```
Error: Application entry file "dist/main/main.js" does not exist.
```

**Причина:** Vite не скомпилировал файлы.

**Решение:**
```bash
rm -rf .vite
npm run package
```

### ❌ Packaged app не запускается

**Диагностика:**
```bash
# macOS: Открыть Console.app
# Фильтр: "electron-ecu-prototype"
# Смотреть ошибки
```

**Частая причина:** Не хватает зависимостей.

**Решение:** Проверить что все production dependencies в package.json:
```json
{
  "dependencies": {
    "pino": "^9.4.0",           // ✅
    "uplot": "^1.6.30",         // ✅
    "rotating-file-stream": "^3.2.0" // ✅
  }
}
```

## Логирование

### ❌ Логи не создаются

**Симптомы:** Папка `logs/` пустая после теста.

**Причина 1:** Папка не создана.

**Решение:**
```bash
mkdir -p logs
```

**Причина 2:** Pino logger не инициализирован.

**Решение:**
```typescript
// Проверить src/main/logger.ts (Stage 6)
import { createStream } from 'rotating-file-stream';

const stream = createStream('performance-main.log', {
  path: './logs' // ✅ Должна существовать папка
});
```

### ❌ `scripts/analyze-logs.js` не находит данные

**Причина:** NDJSON формат логов.

**Решение:**
```javascript
// analyze-logs.js
const fs = require('fs');
const logFile = process.argv[2];

fs.readFileSync(logFile, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .forEach(line => {
    const log = JSON.parse(line); // ✅ Парсить каждую строку
    console.log(log);
  });
```

## macOS специфичные проблемы

### ❌ App не запускается после build

**Симптомы:** Двойной клик по `.app` → ничего не происходит.

**Диагностика:**
```bash
# Запустить из терминала
open -a /path/to/electron-ecu-prototype.app
# Смотреть ошибки в терминале
```

**Причина:** Gatekeeper блокирует.

**Решение:**
```bash
# Разрешить запуск
xattr -cr /path/to/electron-ecu-prototype.app

# Или через System Preferences:
# Security & Privacy → General → "Open Anyway"
```

## Получить помощь

### Checklist перед тем как искать помощь:

- [ ] Проверил что `node --version` >= 20.0.0
- [ ] Удалил `node_modules` и переустановил
- [ ] Очистил `.vite` кеш
- [ ] Проверил DevTools Console на ошибки
- [ ] Прочитал этот troubleshooting guide
- [ ] Проверил [Issues на GitHub](https://github.com/electron/electron/issues)

### Где искать помощь:

1. **Electron Documentation**
   - https://www.electronjs.org/docs/latest/

2. **Electron Forge Issues**
   - https://github.com/electron/forge/issues

3. **Vite Issues**
   - https://github.com/vitejs/vite/issues

4. **Stack Overflow**
   - Tag: [electron] [vite] [typescript]

### Информация для bug report:

При создании Issue включи:
```bash
# Версии
node --version
npm --version
electron --version

# Операционная система
sw_vers (macOS)

# package.json
cat package.json

# Логи
npm start 2>&1 | tee debug.log
```

## Полезные команды для отладки

```bash
# Очистка всего
npm run clean
rm -rf node_modules .vite package-lock.json
npm install

# Проверка зависимостей
npm list --depth=0

# Проверка Electron
./node_modules/.bin/electron --version

# Запуск с debug логами
DEBUG=* npm start

# Профилирование
# DevTools → Performance → Record → Stop → Analyze
```

## Ссылки на другие документы

- [Setup Guide](setup.md) - детальная установка
- [Architecture](architecture.md) - как устроена система
- [Testing](testing.md) - как тестировать
- [Roadmap](../roadmap.md) - план разработки
