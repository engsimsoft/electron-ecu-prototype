# Changelog

Все значительные изменения проекта документируются в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/),
версионирование следует [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Planned
- Этап 4: UI и Control Panel (частично реализован)
- Этап 5: Графики с uPlot (3 charts)
- Этап 6: Performance Logging с Pino
- Этап 7: Тестирование и оптимизация (5 минут, 15 минут тесты)
- Windows/Linux тестирование

---

## [0.3.0] - 2025-10-20

### Added
- **MessagePort IPC коммуникация** для real-time передачи данных
  - MessageChannel setup в Main Process
  - MessagePort forwarding через preload (решение проблемы contextBridge)
  - Callback-based data streaming в Renderer
  - Файлы: `src/main/main.ts`, `src/preload/preload.ts`, `src/renderer/renderer.ts`

- **UI Control Panel с real-time метриками**
  - Кнопки Start/Stop Simulation
  - Метрики: Packets Received, Dropped Packets, Avg Latency, Uptime
  - Автообновление каждую секунду
  - Темная тема с зелеными/красными акцентами
  - Файлы: `index.html`, `src/renderer/styles.css`

- **Статистика и мониторинг**
  - Отслеживание dropped packets через sequenceNumber
  - Измерение latency (Date.now() - packet.timestamp)
  - Uptime counter (mm:ss формат)
  - Финальная статистика при остановке
  - Логирование каждого 100-го пакета в консоль

### Changed
- **Preload API**: `onPortReceived` → `onDataPacket`
  - MessagePort обрабатывается в preload, данные форвардятся через callback
  - Решение проблемы потери методов MessagePort после contextBridge

- **Main Process**: Event handling для MessagePort
  - Использование `dom-ready` + fallback на `did-finish-load` для Vite dev server
  - `port1.start()` для активации MessageChannel
  - Улучшенное логирование с префиксами [Main]

### Fixed
- **MessagePort + contextBridge проблема** (критическая!)
  - Проблема: MessagePort терял метод `.start()` после contextBridge
  - Решение: Вызов `port.start()` и установка `onmessage` в preload контексте
  - Данные форвардятся в renderer через callback, а не прямую передачу port

- **Vite dev server + Electron события**
  - Проблема: `did-finish-load` не срабатывал с `loadURL(http://localhost:5173)`
  - Решение: Использование `dom-ready` как primary event + fallback

### Performance
**Этап 3 Test Results (198 секунд, 20.10.2025 23:28):**
- ✅ **Duration:** 198.49s (~3 минуты 18 секунд)
- ✅ **Packets received:** 4962 из 4962 (100% success!)
- ✅ **Dropped packets:** 0 (0.00%) ← ИДЕАЛЬНО!
- ✅ **Average latency:** 0.31ms (цель <10ms, достигнуто превышение в 32x!)
- ✅ **Min latency:** 0.00ms
- ✅ **Max latency:** 1.00ms

**Технические детали:**
- MessagePort IPC работает без потерь пакетов
- Субмиллисекундная latency достигнута
- Стабильная работа 3+ минуты без деградации
- UI метрики обновляются плавно в real-time

**Решенные проблемы:**
1. MessagePort не передавался через contextBridge → forwarding в preload ✅
2. События Electron не срабатывали с Vite → dom-ready + fallback ✅
3. Данные не доходили до Renderer → port.start() в нужном месте ✅

### Status
- ✅ **Этап 3 завершен:** IPC коммуникация через MessagePort
- ✅ **Все критерии выполнены:**
  - Renderer получает все пакеты без пропусков ✅
  - Latency <10ms (достигнута 0.31ms) ✅
  - Кнопки Start/Stop работают ✅
  - Нет ошибок в консоли ✅

### Next Steps
- Этап 4: UI и Control Panel (FPS мониторинг, детальная статистика)
- Этап 5: Графики с uPlot (3 real-time charts)

---

## [0.2.0] - 2025-10-20

### Added
- **DataGenerator класс** для генерации 300 параметров ЭБУ
  - Плавные переходы значений (smooth transitions)
  - Три категории параметров: быстрые (0-50), средние (51-100), медленные (101-300)
  - Использование Float64Array для оптимизации
  - Файл: `src/main/data-generator.ts`

- **PrecisionTimer класс** с drift compensation
  - Наносекундная точность через `process.hrtime.bigint()`
  - Самокорректирующийся алгоритм (compensates drift)
  - Target interval: 40ms (25 Hz)
  - Файл: `src/main/precision-timer.ts`

- **TypeScript типы** для data packets
  - Интерфейс `DataPacket` (timestamp, values, sequenceNumber)
  - Интерфейс `PerformanceMetrics` (для будущего логирования)
  - Файл: `src/main/types.ts`

- **UI для отображения результатов теста**
  - Секция "Test Status" с real-time updates
  - Секция "Test Results" с итоговыми метриками
  - Темная тема интерфейса
  - Файлы: `index.html`, `src/renderer/styles.css`, `src/renderer/renderer.ts`

- **IPC для передачи данных в Renderer**
  - Preload script с contextBridge API
  - Event `test-message` для передачи логов из Main → Renderer
  - Безопасный IPC через `contextBridge.exposeInMainWorld`
  - Файлы: `src/preload/preload.ts`, `src/preload/preload.d.ts`

### Changed
- **forge.config.ts**: Исправлены entry points для main и preload
  - Было: `src/main.ts`, `src/preload.ts`
  - Стало: `src/main/main.ts`, `src/preload/preload.ts`

- **main.ts**: Использование Vite dev server вместо загрузки файла
  - Development: `win.loadURL('http://localhost:5173')`
  - Production: `win.loadFile(...)` (fallback)
  - Отключен sandbox для работы IPC (`sandbox: false`)

### Fixed
- Ошибка "preload.js not found" - исправлен путь в BrowserWindow options
- Ошибка "empty chunk preload" - исправлены entry points в forge.config.ts
- TypeScript ошибка в `padStart()` - добавлен второй аргумент `padStart(4, '0')`

### Performance
**Этап 2 Test Results (10 секунд):**
- ✅ **Длительность:** 10.01s (target: 10s)
- ✅ **Пакетов:** 250 (expected: 250)
- ✅ **Средний интервал:** 40.02ms (target: 40ms ±2ms)
- ✅ **Drift:** 0.02ms (excellent!)
- ✅ **Test Status:** PASSED
- ✅ **Intervals:** 40ms ±2ms ✓
- ✅ **Packet count:** 240-260 ✓

**Технические детали:**
- PrecisionTimer drift compensation работает идеально (0.02ms отклонение)
- Float64Array обеспечивает быструю генерацию 300 параметров
- Плавные переходы значений реализованы успешно

### Status
- ✅ **Этап 2 завершен:** Генерация данных ЭБУ
- ✅ **Все критерии выполнены** (40ms ±2ms, 250 пакетов, Float64Array)
- ✅ **UI тестирования работает** (отображение в окне Electron)

### Next Steps
- Этап 3: IPC коммуникация через MessagePort для real-time передачи данных

---

## [0.1.0] - 2025-10-20

### Added
- Базовая структура проекта с Electron Forge + Vite
- TypeScript 5.3.3 конфигурация
- Electron 34.0.0 (latest stable)
- Main process setup ([src/main.ts](src/main.ts))
- Preload script с contextBridge ([src/preload.ts](src/preload.ts))
- Renderer process базовый setup ([src/renderer.ts](src/renderer.ts))
- Vite конфигурации для main/preload/renderer процессов
- HTML и CSS базовая разметка
- npm скрипты: `start`, `package`, `make`, `lint`
- Зависимости для будущих этапов:
  - uPlot 1.6.30 (charts)
  - Pino 9.4.0 (logging)
  - rotating-file-stream 3.2.0 (log rotation)

### Changed
- **Миграция с ручной компиляции TypeScript на Vite bundler**
  - Причина: стандартная компиляция TypeScript → CommonJS не работала с Electron из-за проблем с резолвингом модуля 'electron'
  - Решение: использование официального шаблона Electron Forge + Vite
  - Результат: ✅ Electron запускается успешно с hot-reload

### Technical Details
- **Build system:** Electron Forge 7.10.2 с плагином @electron-forge/plugin-vite
- **Dev mode:** Vite dev server с HMR на http://localhost:5173
- **TypeScript:** ES6 imports работают корректно благодаря Vite
- **Security:** contextIsolation: true, nodeIntegration: false, sandbox: true

### Development Notes
- Обнаружена проблема: `require('electron')` в скомпилированном TypeScript возвращает путь к бинарнику, а не API
- Решение найдено через изучение официальной документации Electron
- Использован официальный шаблон: `npx create-electron-app --template=vite-typescript`

### Performance
- Electron запускается за ~10 секунд (включая Vite build)
- HMR работает мгновенно (<1 секунда)
- Размер .vite/build: ~50KB (main.js + preload.js)

### Status
- ✅ **Этап 1 завершен:** Базовая структура проекта
- ✅ **Критерий завершения:** `npm start` успешно запускает Electron окно
- ✅ **TypeScript компилируется** без ошибок
- ✅ **Окно отображается** с базовым UI

### Next Steps
- Этап 2: Генерация 300 параметров @ 25Hz с PrecisionTimer
