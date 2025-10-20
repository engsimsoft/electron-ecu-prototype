# Архитектура системы

Описание архитектуры Electron ECU Data Prototype.

## Обзор

Приложение построено на **Electron** и использует multi-process архитектуру:

```
┌─────────────────────────────────────────────────────────────┐
│                    Electron Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌─────────────────────────┐  │
│  │  Main Process    │◄───────►│  Renderer Process       │  │
│  │  (Node.js)       │   IPC   │  (Chromium)             │  │
│  │                  │         │                         │  │
│  │ • Data Generator │         │ • UI Components         │  │
│  │ • PrecisionTimer │         │ • uPlot Charts (x3)     │  │
│  │ • Pino Logger    │         │ • FPS Monitor           │  │
│  │ • MessagePort    │         │ • Circular Buffers      │  │
│  └──────────────────┘         └─────────────────────────┘  │
│           ▲                              ▲                  │
│           │                              │                  │
│           │    ┌──────────────────┐     │                  │
│           └────│ Preload Script   │─────┘                  │
│                │ (contextBridge)  │                        │
│                └──────────────────┘                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Main Process (Node.js)

**Файл:** [src/main.ts](../src/main.ts)

**Ответственность:**
- Создание и управление BrowserWindow
- Генерация данных ЭБУ (300 параметров @ 25Hz)
- Отправка данных в Renderer через MessagePort
- Performance logging (Pino)

**Текущее состояние (Stage 1):**
```typescript
// src/main.ts
import { app, BrowserWindow } from 'electron';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,      // ✅ Безопасность
      nodeIntegration: false,       // ✅ Безопасность
      sandbox: true                 // ✅ Безопасность
    }
  });

  // Vite dev server в dev режиме
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(...);
  }
};

app.whenReady().then(createWindow);
```

**Планируется (Stage 2):**
- `DataGenerator` класс (генерация 300 параметров)
- `PrecisionTimer` класс (25Hz с drift compensation)
- `types.ts` (интерфейсы DataPacket)

## Preload Script

**Файл:** [src/preload.ts](../src/preload.ts)

**Ответственность:**
- Безопасный мост между Main и Renderer
- Expose только необходимые API через `contextBridge`
- Получение MessagePort для IPC

**Текущее состояние:**
```typescript
// src/preload.ts
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Будет заполнено в Stage 3
});
```

**Планируется (Stage 3):**
```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  onPortReceived: (callback) => { /* ... */ },
  startSimulation: () => { /* ... */ },
  stopSimulation: () => { /* ... */ }
});
```

## Renderer Process (Chromium)

**Файлы:**
- [src/renderer.ts](../src/renderer.ts) - логика UI
- [index.html](../index.html) - разметка
- [src/index.css](../src/index.css) - стили

**Ответственность:**
- Отображение UI (графики, метрики, кнопки)
- Прием данных через MessagePort
- Rendering графиков с 60 FPS через uPlot
- FPS мониторинг
- Управление CircularBuffers

**Текущее состояние:**
Базовый HTML с styles, без логики.

**Планируется:**
- **Stage 3:** Прием данных через MessagePort
- **Stage 4:** UI компоненты (кнопки, метрики)
- **Stage 5:** uPlot графики (3 charts)
- **Stage 5:** CircularBuffer для хранения данных

## IPC Коммуникация

### MessagePort (Stage 3)

**Почему MessagePort, а не ipcRenderer?**
- ✅ **10% быстрее** традиционного ipcRenderer
- ✅ **Single serialization** (не через Main Process)
- ✅ **Direct channel** между процессами
- ✅ **Float64Array support** (structured clone)

**Data Flow:**
```
Main Process                    Renderer Process
    │                                  │
    │  1. Create MessageChannel        │
    │     const {port1, port2}         │
    │                                  │
    │  2. Send port2 ─────────────────►│
    │     postMessage('port', [port2]) │ 3. Receive port
    │                                  │    onPortReceived()
    │                                  │
    │  4. Generate data (25Hz)         │
    │     timer.tick()                 │
    │     packet = generator.create()  │
    │                                  │
    │  5. Send data ──────────────────►│ 6. Receive & render
    │     port1.postMessage(packet)    │    handlePacket()
    │                                  │    updateCharts()
    │                                  │
    └──────────────────────────────────┴──────────────────────
```

## Data Types

**Будет создано в Stage 2:**

```typescript
// src/main/types.ts
interface DataPacket {
  timestamp: number;           // Когда пакет создан (ms)
  values: Float64Array;        // 300 параметров
  sequenceNumber: number;      // Порядковый номер
}
```

**Почему Float64Array?**
- ✅ **2x быстрее** с structured clone vs JSON
- ✅ **Меньше memory overhead** vs обычные массивы
- ✅ **Оптимизирован** для числовых данных

## Build System (Vite + Electron Forge)

### Vite Configuration

**3 отдельных конфига:**

1. **vite.main.config.ts** - Main Process
```typescript
export default {
  build: {
    rollupOptions: {
      external: ['electron']  // Не бандлить Electron
    }
  }
};
```

2. **vite.preload.config.ts** - Preload Script
```typescript
export default {
  build: {
    rollupOptions: {
      external: ['electron']
    }
  }
};
```

3. **vite.renderer.config.ts** - Renderer Process
```typescript
export default {
  // Стандартный web build
  // Поддержка CSS, HTML, TypeScript
};
```

### Electron Forge Configuration

**Файл:** [forge.config.ts](../forge.config.ts)

```typescript
export default {
  packagerConfig: {},
  makers: [
    { name: '@electron-forge/maker-zip' },
    { name: '@electron-forge/maker-dmg' },
    // ...
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          { entry: 'src/main.ts', config: 'vite.main.config.ts' },
          { entry: 'src/preload.ts', config: 'vite.preload.config.ts' }
        ],
        renderer: [
          { name: 'main_window', config: 'vite.renderer.config.ts' }
        ]
      }
    }
  ]
};
```

## Performance Optimizations

### Current (Stage 1)
- ✅ Vite bundler (быстрая компиляция)
- ✅ HMR (мгновенные обновления при разработке)
- ✅ TypeScript strict mode (меньше runtime ошибок)

### Planned

**Stage 2:** PrecisionTimer
- Self-adjusting timer с `process.hrtime.bigint()`
- Drift compensation

**Stage 5:** Charts Optimization
- CircularBuffer (fixed memory)
- Decimation (уменьшение точек на графике)
- requestAnimationFrame (60 FPS rendering loop)

**Stage 6:** Logging
- Pino (async, <1% overhead)
- Rotating file stream (автоматическая ротация)

## Security

### Настройки безопасности (из коробки):

```typescript
webPreferences: {
  contextIsolation: true,    // ✅ Изолированный контекст
  nodeIntegration: false,    // ✅ Нет прямого доступа к Node.js
  sandbox: true              // ✅ Sandbox для Renderer
}
```

**Что это дает:**
- Renderer Process не может напрямую вызывать Node.js API
- Все IPC проходит через безопасный contextBridge
- Защита от XSS и code injection

### Content Security Policy

**Добавлено в index.html:**
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'">
```

## Troubleshooting Architecture Issues

### Проблема: "Cannot find module 'electron'"

**Решение:** Это нормально в src/. Vite бандлит всё правильно.

### Проблема: HMR не подхватывает изменения

**Причина:** Main Process не поддерживает HMR (только Renderer)

**Решение:** Перезапустить через `rs` в терминале

См. полный список в [troubleshooting.md](troubleshooting.md).

## Диаграммы

### Deployment View
```
Development:
  npm start
    ↓
  Vite Dev Server (localhost:5173)
    ↓
  Electron loads from dev server

Production:
  npm run package
    ↓
  Vite build (static files)
    ↓
  Electron Forge package
    ↓
  out/electron-ecu-prototype.app
```

## Следующие этапы разработки

См. [roadmap.md](../roadmap.md) для полного плана:

- **Stage 2:** DataGenerator + PrecisionTimer
- **Stage 3:** MessagePort IPC
- **Stage 4:** UI Components
- **Stage 5:** uPlot Charts
- **Stage 6:** Pino Logging
- **Stage 7:** Testing & Optimization

## Ссылки

- [Electron Architecture](https://www.electronjs.org/docs/latest/tutorial/process-model)
- [Electron Security](https://www.electronjs.org/docs/latest/tutorial/security)
- [Vite Documentation](https://vitejs.dev/)
- [ADR 001: Electron Forge + Vite](decisions/001-electron-forge-vite.md)
