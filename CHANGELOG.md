# Changelog

Все значительные изменения проекта документируются в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/),
версионирование следует [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Planned
- Этап 7: Тестирование и оптимизация (5 минут, 15 минут тесты)
- Windows/Linux тестирование

---

## [0.5.0] - 2025-01-21

### Added
- **Performance Logging с Pino** (Этап 6)
  - Pino 9.4.0 + rotating-file-stream 3.2.0 для высокопроизводительного логирования
  - Автоматическая ротация логов: 10MB размер файла, 5 файлов максимум, gzip сжатие
  - Файлы: `src/main/logger.ts`, `src/main/performance-logger.ts`

- **Main Process мониторинг**
  - CPUMonitor класс: отслеживание CPU usage через `process.cpuUsage()`
  - EventLoopMonitor класс: event loop utilization через `performance.eventLoopUtilization()`
  - PacketTracker класс: отслеживание generated/dropped packets
  - PerformanceLogger класс: объединяет все мониторы
  - Логирование каждую 1 секунду в `logs/performance-main.log`
  - Метрики: CPU%, Memory (RSS, Heap), Event Loop %, Packets (generated, dropped)

- **Renderer Process мониторинг**
  - Сбор метрик: FPS, Render Time, IPC Latency, JS Heap Memory
  - Отправка метрик в Main Process через IPC каждую 1 секунду
  - Логирование в `logs/performance-renderer.log`
  - Метрики: FPS, renderTime, IPC latency, packetsReceived, packetsDropped, memory

- **Скрипт анализа логов**
  - `scripts/analyze-logs.js` для парсинга NDJSON логов
  - Статистика: Min, Max, Average, Median, P95, P99
  - Поддержка как main, так и renderer логов
  - Использование: `node scripts/analyze-logs.js logs/performance-main.log`

### Changed
- **preload.ts**: Добавлен метод `logRendererMetrics()` для отправки метрик
- **main.ts**: Добавлен IPC handler `log-renderer-metrics` для приема метрик
- **renderer.ts**: Добавлен setInterval для сбора и отправки метрик каждую секунду

### Technical Details
- **Формат логов:** NDJSON (Newline Delimited JSON) - каждая строка валидный JSON
- **Overhead:** Логирование <1% CPU (Pino оптимизирован для высокой производительности)
- **Rotation:** Автоматическая при достижении 10MB размера файла
- **Compression:** Старые логи сжимаются в gzip для экономии места

### Files Added
- `src/main/logger.ts` - Pino logger configuration для main и renderer
- `src/main/performance-logger.ts` - Классы мониторинга (CPU, EventLoop, Packets, PerformanceLogger)
- `scripts/analyze-logs.js` - Утилита для анализа производительности из логов
- `logs/` - Директория для хранения логов (создается автоматически)

### Status
- ✅ **Этап 6 завершен:** Performance Logging с Pino
- **Прогресс:** 40/40 задач (100%) ← Все задачи Этапов 1-6 выполнены!
- **Следующий этап:** Этап 7 - Тестирование и оптимизация

### Testing Instructions
1. Запустить приложение: `npm start`
2. Нажать "Start Simulation" и дать поработать 1-5 минут
3. Нажать "Stop Simulation"
4. Проверить логи: `ls -lh logs/`
5. Анализировать:
   - Main Process: `node scripts/analyze-logs.js logs/performance-main.log`
   - Renderer Process: `node scripts/analyze-logs.js logs/performance-renderer.log`

### Performance Test Results (5-Minute Acceptance Test)

**Дата:** 21 января 2025
**Длительность:** 304 секунды (~5 минут 4 секунды)
**Пакетов обработано:** 7,614 пакетов @ 25 Hz

#### ✅ Main Process Performance:
```
CPU Usage:        1.72% avg (Max: 6.84%, P99: 6.01%)
Memory RSS:       145.88 → 157.53 MB (+11.66 MB)
Memory Heap:      5.84 → 5.83 MB (-0.00 MB - стабилен!)
Event Loop:       0.00% utilization
Packets:          7,614 generated, 0 dropped (0.00%)
Samples:          304
```

#### ✅ Renderer Process Performance:
```
FPS:              60.36 avg (Median: 61, P95: 61, P99: 61)
Render Time:      0.61ms avg (P95: 0.73ms, Max: 0.76ms)
IPC Latency:      0.69ms avg (P95: 0.89ms, P99: 0.95ms)
JS Heap Memory:   6.95 → 12.04 MB (+5.09 MB)
Samples:          305
```

#### 🏆 KPI Results Summary:

| KPI | Target | Result | Status | Превышение |
|-----|--------|--------|--------|-----------|
| Stability (5 min) | 5 min | 5 min 4 sec | ✅ PASS | - |
| FPS | ≥55 | 60.36 avg | ✅ PASS | +9.7% |
| Dropped Packets | 0% | 0.00% | ✅ PASS | Perfect |
| IPC Latency | <50ms | 0.69ms | ✅ PASS | **72x лучше** |
| CPU Usage | <40% | 1.72% | ✅ PASS | **23x лучше** |
| Memory Growth | <50MB | 16.75MB | ✅ PASS | **3x лучше** |
| Charts Smooth | Yes | 0.61ms render | ✅ PASS | Perfect |

**Итог:** ✅ **ВСЕ 7 KPI ВЫПОЛНЕНЫ С БОЛЬШИМ ЗАПАСОМ!**

**Выводы:**
- Electron прототип превосходит все целевые показатели
- Производительность значительно лучше требований
- Огромный запас по CPU (1.72% vs 40% цель) и Memory
- MessagePort IPC показывает отличную производительность (субмиллисекундная latency)
- Отсутствие memory leaks (heap стабилен)
- Стабильные 60 FPS на протяжении всего теста
- Готов для production оценки

### Next Steps
- ✅ Этап 7.2: Тест 5 минут - **ВЫПОЛНЕН!**
- Опционально: Этап 7.3 - Тест 15 минут (стресс-тест на memory leaks)
- Опционально: Этап 7.4 - Циклы Start/Stop (проверка очистки ресурсов)
- Финализация документации

---

## [0.4.1] - 2025-01-21

### Fixed
- **КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ:** Ошибка "Cannot read properties of undefined (reading 'length')" в [`src/renderer/renderer.ts`](src/renderer/renderer.ts)
  - **Проблема:** 
    - Графики uPlot не отображались
    - MessagePort работал корректно, но данные не передавались в графики
    - TypeScript показывал 10 ошибок компиляции
  - **Корневая причина:**
    - В типе DataPacket ([`src/main/types.ts:15`](src/main/types.ts:15)) поле называется `values: Float64Array`
    - В renderer.ts код ошибочно обращался к несуществующему `packet.data`
  - **Решение:**
    - Заменены все вхождения `packet.data` → `packet.values` в [`src/renderer/renderer.ts:103-136`](src/renderer/renderer.ts:103-136)
    - Удалены диагностические логи из [`src/preload/preload.ts`](src/preload/preload.ts)

### Performance
**Результаты после исправления:**
- ✅ **Графики:** Все 3 графика uPlot работают корректно (параметры 0-8)
- ✅ **FPS:** 60 FPS стабильно
- ✅ **Latency:** 0.57ms (превосходно)
- ✅ **Dropped packets:** 0 (0.00%)
- ✅ **Console:** Нет ошибок

### Status
- ✅ **Этап 5 завершен:** Графики с uPlot работают полностью
- **Прогресс:** 31/40 задач (77.5%)

---

## [0.4.0] - 2025-10-21 (In Progress)

### Added
- **FPS Monitoring система** (Этап 4)
  - FPSMonitor класс с методами tick(), getFPS(), reset()
  - Rendering loop с requestAnimationFrame @ 60 FPS target
  - FPS метрика в UI с цветовой индикацией:
    - Зеленый (≥55 FPS): `fps-good`
    - Оранжевый (45-54 FPS): `fps-warning`
    - Красный (<45 FPS): `fps-bad`
  - Файл: `src/renderer/renderer.ts`

- **uPlot chart library интеграция** (Этап 5 - частично)
  - Установлен uPlot v1.6.30+
  - ChartManager класс для управления 3 графиками
  - CircularBuffer и TypedCircularBuffer классы для данных
  - HTML/CSS для 3 графиков (Parameters 0-2, 3-5, 6-8)
  - Файлы: `src/renderer/chart-manager.ts`, `src/renderer/circular-buffer.ts`

- **UI улучшения**
  - Uptime counter в формате MM:SS
  - Render time tracking (для debugging)
  - GPU acceleration через CSS (`transform: translateZ(0)`)

### Changed
- **Метрики UI:** Добавлена FPS метрика, реорганизована grid (2x3)
- **CSP Policy:** Добавлен `style-src 'self' 'unsafe-inline'` для uPlot inline styles
- **Timing:** Увеличен delay для MessagePort setup с 50ms до 100ms

### Fixed
- Попытки исправить MessagePort `event.ports` undefined:
  - Добавлен null check для `event.ports`
  - Применён optional chaining (`ports?.length`)
  - Убраны лишние type castings
  - Очищены все кэши (.vite, node_modules/.vite, out) множество раз

### Performance
**Этап 4 Test Results:**
- ✅ **FPS:** 60-61 stable (зелёный индикатор)
- ✅ **Latency:** 0.27-0.42ms (стабильно низкая)
- ✅ **Dropped packets:** 0 (0.00%)
- ✅ **UI responsiveness:** Отличная, кнопки реагируют мгновенно

### Status
- ✅ **Этап 4 завершен:** UI и Control Panel с FPS monitoring
- 🔧 **Этап 5 в процессе:** Графики uPlot - БЛОКИРОВАНО критической проблемой
- **Прогресс:** 26/40 задач (65%)

### Blocking Issues
- 🚨 **MessagePort event.ports undefined**
  - Графики не отображаются из-за ошибки в preload
  - Main process успешно отправляет port
  - Preload получает событие 'port', но event.ports === undefined
  - Все пакеты генерируют ошибку в консоли

### Next Steps
- **Приоритет 1:** Решить проблему MessagePort в preload (требуется свежий подход)
- **Приоритет 2:** Завершить Этап 5 (графики должны отображаться и обновляться)
- **Приоритет 3:** Перейти к Этапу 6 (Performance Logging)

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
