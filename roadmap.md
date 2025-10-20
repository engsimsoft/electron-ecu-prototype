# Roadmap: Electron ECU Data Prototype (Stress Test)

## 🎯 Цель проекта

Создать минимальный прототип на Electron для проверки производительности при обработке real-time данных с интервалом 40ms (25 Hz), имитирующих поток данных от ЭБУ двигателя.

**Стресс-тест:** 300 параметров в каждом пакете для оценки возможной миграции с Qt/QML на Electron.

**Критерии успеха:**
- ✅ **KPI-1:** Стабильная работа 5+ минут без сбоев (7500+ пакетов)
- ✅ **KPI-2:** FPS не падает ниже 55 (целевой 60 FPS)
- ✅ **KPI-3:** Отсутствие пропусков пакетов данных (все пакеты обработаны)
- ✅ **KPI-4:** Латентность данные→UI не более 50ms
- ✅ **KPI-5:** CPU usage не более 40% на macOS
- ✅ **KPI-6:** Память не растет более чем на 50MB за 5 минут работы
- ✅ **KPI-7:** Три графика обновляются синхронно и плавно

---

## 📊 Текущий статус

- **Этап:** Этап 4 / 7 (UI и Control Panel завершен ✅)
- **Прогресс:** 20/40 задач выполнено (50.0%)
- **Следующее:** Этап 5 - Графики с uPlot

---

## ⚠️ ВАЖНО: Правило работы при возникновении трудностей

**КРИТИЧНОЕ ПРАВИЛО для всех этапов разработки:**

При возникновении любых трудностей, ошибок, неожиданного поведения или вопросов "как правильно сделать":

### 🔍 Обязательные действия:

1. **СТОП** - не пытаться решить проблему "методом тыка"
2. **ИЗУЧИТЬ ОФИЦИАЛЬНУЮ ДОКУМЕНТАЦИЮ:**
   - Electron Docs: https://www.electronjs.org/docs/latest/
   - TypeScript Handbook: https://www.typescriptlang.org/docs/
   - uPlot Docs: https://github.com/leeoniya/uPlot
   - Pino Docs: https://getpino.io/
3. **ИЗУЧИТЬ BEST PRACTICES:**
   - Electron Performance: https://www.electronjs.org/docs/latest/tutorial/performance
   - Electron Security: https://www.electronjs.org/docs/latest/tutorial/security
   - Real-world примеры из GitHub
4. **ИСПОЛЬЗОВАТЬ Task TOOL** для исследования:
   - Запустить отдельный research agent
   - Найти примеры кода, решения проблем
   - Изучить GitHub issues для библиотек
5. **ТОЛЬКО ПОСЛЕ ИЗУЧЕНИЯ** - приступать к реализации решения

### Примеры ситуаций:

**❌ НЕПРАВИЛЬНО:**
```
Проблема: MessagePort не передает данные
Действие: Пробовать разные варианты кода наугад
Результат: Потеря времени, код не работает
```

**✅ ПРАВИЛЬНО:**
```
Проблема: MessagePort не передает данные
Действия:
1. Прочитать Electron MessagePorts Tutorial
2. Изучить примеры из официальной документации
3. Проверить GitHub issues: "MessagePort not working"
4. Найти working example в official electron samples
5. Применить правильное решение на основе документации
Результат: Проблема решена правильным способом
```

### 📚 Основные источники документации:

| Технология | Документация | Best Practices |
|------------|-------------|----------------|
| **Electron** | [Docs](https://www.electronjs.org/docs/latest/) | [Performance](https://www.electronjs.org/docs/latest/tutorial/performance), [Security](https://www.electronjs.org/docs/latest/tutorial/security) |
| **TypeScript** | [Handbook](https://www.typescriptlang.org/docs/) | [Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html) |
| **uPlot** | [GitHub + Demos](https://github.com/leeoniya/uPlot) | [Performance Tips](https://github.com/leeoniya/uPlot#performance) |
| **Pino** | [Docs](https://getpino.io/) | [Best Practices](https://getpino.io/#/docs/best-practices) |
| **Node.js APIs** | [process.hrtime](https://nodejs.org/api/process.html#processhrtimebigint), [perf_hooks](https://nodejs.org/api/perf_hooks.html) | [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices) |

### 🎯 Цель этого правила:

- ✅ Избежать "костылей" и неправильных решений
- ✅ Писать код согласно best practices
- ✅ Понимать КАК и ПОЧЕМУ работает код
- ✅ Создать maintainable и производительный код
- ✅ Сэкономить время (1 час изучения документации сэкономит 5 часов отладки)

**ЗАПОМНИ:** Качественный код на основе документации >>> быстрый код методом проб и ошибок

---

## 🚀 Этапы разработки

### Этап 0: Планирование и исследование ✅

**Цель:** Определить технический стек и архитектуру решения

**Задачи:**

- [X] **0.1** Исследовать Electron best practices для real-time приложений
- [X] **0.2** Выбрать библиотеку графиков (результат: uPlot)
- [X] **0.3** Определить IPC стратегию (результат: MessagePort)
- [X] **0.4** Выбрать logging решение (результат: Pino)
- [X] **0.5** Создать roadmap.md

**Результаты этапа:**
- ✅ Electron 34.x (Chromium 132, Node.js 20.18.1)
- ✅ uPlot для графиков (10% CPU vs 40% у Chart.js)
- ✅ MessagePort для IPC (на 10% быстрее традиционного ipcRenderer)
- ✅ Float64Array для данных (2x быстрее с structured clone)
- ✅ Pino для логирования (<1% overhead)

---

### Этап 1: Базовая структура проекта ✅ ЗАВЕРШЕН

**Цель:** TypeScript проект настроен, Electron запускается с пустым окном

**Задачи:**

- [X] **1.1** Создать структуру папок проекта (15 мин)
  ```
  electron_prototype/
  ├── src/
  │   ├── main/           # Main Process (Node.js)
  │   │   ├── main.ts
  │   │   ├── data-generator.ts
  │   │   ├── precision-timer.ts
  │   │   └── types.ts
  │   ├── preload/        # Preload scripts
  │   │   └── preload.ts
  │   └── renderer/       # Renderer Process (UI)
  │       ├── index.html
  │       ├── renderer.ts
  │       ├── chart-manager.ts
  │       ├── circular-buffer.ts
  │       └── styles.css
  ├── dist/               # Compiled TypeScript output
  ├── logs/               # Performance logs
  ├── scripts/            # Utility scripts
  │   └── analyze-logs.js
  ├── tsconfig.json
  ├── tsconfig.main.json
  ├── tsconfig.renderer.json
  ├── tsconfig.preload.json
  ├── package.json
  ├── roadmap.md
  └── README.md
  ```

- [X] **1.2** Настроить package.json с зависимостями (10 мин)
  - Electron 34.x ✅
  - TypeScript 5.3+ ✅
  - uPlot 1.6.30+ ✅
  - Pino 9.4+ ✅
  - rotating-file-stream 3.2+ ✅
  - @types/node 20.10+ ✅
  - Скрипты: `start`, `package`, `make`, `lint` ✅
  - **Изменение:** Использован Electron Forge вместо ручных скриптов

- [X] **1.3** Создать конфигурации Vite + TypeScript (10 мин)
  - `tsconfig.json` ✅
  - `vite.main.config.ts` ✅
  - `vite.renderer.config.ts` ✅
  - `vite.preload.config.ts` ✅
  - `forge.config.ts` ✅

- [X] **1.4** Создать минимальный main.ts и index.html (10 мин)
  - Инициализация BrowserWindow (1600x900)
  - Загрузка index.html
  - Настройки безопасности: `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`
  - Preload script подключен
  - Базовый HTML с заголовком "ECU Data Prototype" ✅
  - **Проверка:** `npm start` запускает пустое Electron окно без ошибок ✅

**Критерий завершения этапа:**
✅ Команда `npm start` успешно запускает Electron окно
✅ TypeScript компилируется без ошибок через Vite
✅ Окно отображает базовый HTML

**Результаты этапа:**
✅ **Electron Forge 7.10.2** + **Vite 5.4.21** настроены
✅ HMR (Hot Module Replacement) работает - мгновенные обновления
✅ Все зависимости установлены (Electron, uPlot, Pino, TypeScript)
✅ Документация создана: README.md, CHANGELOG.md, ADR 001
✅ **Решена проблема:** require('electron') через миграцию на bundler
✅ Dev server на http://localhost:5173 с instant reload

---

### Этап 2: Генерация данных ЭБУ ✅ ЗАВЕРШЕН

**Цель:** 300 параметров генерируются каждые 40ms с высокой точностью (25 Hz)

**Задачи:**

- [X] **2.1** Создать типы и интерфейсы (10 мин)
  - Файл `src/main/types.ts` ✅
  - Интерфейс `DataPacket`:
    * `timestamp: number` (когда пакет создан)
    * `values: Float64Array` (300 параметров)
    * `sequenceNumber: number` (порядковый номер пакета)
  - Экспорт типов для использования в других модулях

- [X] **2.2** Реализовать DataGenerator класс (20 мин)
  - Файл `src/main/data-generator.ts` ✅
  - Конструктор принимает `parameterCount: number` (300)
  - Метод `generatePacket(sequenceNumber: number): DataPacket`
  - Генерация реалистичных значений с плавными переходами:
    * Параметры 0-50: быстро меняющиеся (имитация оборотов, дроссель) - шаг ±50-100
    * Параметры 51-100: средне меняющиеся (давление, AFR) - шаг ±10-20
    * Параметры 101-300: медленно меняющиеся (температуры) - шаг ±1-5
  - Использование Float64Array для оптимизации ✅
  - Плавные изменения: текущее значение += случайное изменение ✅
  - Ограничение диапазонов (0-8000 для RPM, 0-200 для давления, 0-100 для температур) ✅

- [X] **2.3** Реализовать PrecisionTimer класс (20 мин)
  - Файл `src/main/precision-timer.ts` ✅
  - Самокорректирующийся таймер с `process.hrtime.bigint()` ✅
  - Свойства:
    * `targetInterval: number` (40ms для 25 Hz) ✅
    * `running: boolean` ✅
    * `nextTick: bigint` (время следующего вызова в наносекундах) ✅
  - Методы:
    * `start(callback: () => void): void` - запуск таймера ✅
    * `stop(): void` - остановка таймера ✅
    * `tick(callback: () => void): void` - внутренний метод с компенсацией drift ✅
  - Алгоритм drift compensation реализован ✅

- [X] **2.4** Интегрировать в main.ts и протестировать (10 мин)
  - Импортировать DataGenerator и PrecisionTimer ✅
  - Создать экземпляры: `const generator = new DataGenerator(300)` ✅
  - Запустить генерацию данных на 10 секунд для теста ✅
  - Логировать в консоль и окно Electron ✅
  - Добавлен UI для отображения результатов теста ✅
  - **Проверка 1:** За 10 секунд должно быть ~250 пакетов (25 Hz) ✅ **250 пакетов**
  - **Проверка 2:** Интервалы должны быть 40ms ±2ms ✅ **40.02ms (drift 0.02ms)**
  - **Проверка 3:** Каждый пакет содержит Float64Array с 300 значениями ✅

**Критерий завершения этапа:**
✅ Консоль показывает стабильные 25 пакетов/секунду - **ВЫПОЛНЕНО**
✅ Интервалы между пакетами: 40ms ±2ms - **ВЫПОЛНЕНО (40.02ms)**
✅ Каждый пакет содержит 300 параметров в Float64Array - **ВЫПОЛНЕНО**
✅ Значения параметров реалистично меняются (плавные переходы) - **ВЫПОЛНЕНО**

**Результаты этапа:**
✅ **Длительность теста:** 10.01s (целевая: 10s)
✅ **Всего пакетов:** 250 (ожидалось: 250)
✅ **Средний интервал:** 40.02ms (цель: 40ms ±2ms)
✅ **Drift:** 0.02ms (отличный результат!)
✅ **Test Status:** PASSED
✅ **Файлы созданы:**
- `src/main/types.ts` (интерфейсы DataPacket, PerformanceMetrics)
- `src/main/data-generator.ts` (генератор 300 параметров)
- `src/main/precision-timer.ts` (таймер с наносекундной точностью)
- UI для отображения результатов теста в окне Electron
- IPC для передачи сообщений в Renderer Process

---

### Этап 3: IPC коммуникация через MessagePort ✅ ЗАВЕРШЕН (30-45 минут)

**Цель:** Данные передаются из Main Process в Renderer Process с минимальной латентностью

**Задачи:**

- [X] **3.1** Настроить безопасный preload.ts (15 мин)
  - Файл `src/preload/preload.ts`
  - Использовать `contextBridge.exposeInMainWorld()`
  - Expose API в `window.electronAPI`:
    * `onPortReceived(callback: (port: MessagePort) => void)` - получить MessagePort
    * `startSimulation()` - отправить команду запуска симуляции
    * `stopSimulation()` - отправить команду остановки
  - Создать файл типов `src/preload/preload.d.ts`:
    * Расширить глобальный `Window` интерфейс с `electronAPI`
    * Обеспечить type safety в renderer

- [X] **3.2** Реализовать MessagePort IPC в main.ts (15 мин)
  - Импортировать `MessageChannelMain` из electron
  - После загрузки окна (`webContents.once('did-finish-load')`):
    1. Создать `MessageChannelMain`: `const { port1, port2 } = new MessageChannelMain()`
    2. Отправить `port2` в renderer: `webContents.postMessage('port', null, [port2])`
    3. Сохранить `port1` для отправки данных
  - В callback PrecisionTimer:
    * Генерировать пакет: `const packet = generator.generatePacket(sequenceNumber++)`
    * Отправлять через MessagePort: `port1.postMessage(packet)`
  - IPC handlers для управления:
    * `ipcMain.on('start-simulation')` → запустить timer
    * `ipcMain.on('stop-simulation')` → остановить timer

- [X] **3.3** Создать базовый renderer.ts для приема данных (15 мин)
  - Файл `src/renderer/renderer.ts`
  - Получить MessagePort:
    ```typescript
    window.electronAPI.onPortReceived((port) => {
      dataPort = port;
      dataPort.onmessage = (event) => {
        handleDataPacket(event.data);
      };
      dataPort.start();
    });
    ```
  - Реализовать `handleDataPacket(packet: DataPacket)`:
    * Счетчик принятых пакетов: `receivedCount++`
    * Логировать каждый 100-й пакет для проверки
    * Вычислить latency: `Date.now() - packet.timestamp`
  - Временные кнопки Start/Stop в HTML:
    * Обработчики кликов отправляют IPC команды через `electronAPI`
  - **Проверка:** Console должна показывать "Received packet #100, latency: 2.3ms"

**Критерий завершения этапа:**
✅ Renderer получает все пакеты без пропусков
✅ Console показывает: "Received packet #100, #200, #300..." с latency <10ms
✅ Кнопки Start/Stop корректно управляют симуляцией
✅ Нет ошибок в DevTools console

**Результаты этапа:**
✅ **Тест от 20.10.2025:**
- Duration: 198.49s (3 минуты 18 секунд)
- Packets received: **4962** (100% успех!)
- Expected packets: 4962
- **Dropped packets: 0 (0.00%)** ✅
- **Average latency: 0.31ms** ✅ (цель <10ms)
- Min latency: 0.00ms
- Max latency: 1.00ms

**Решенные проблемы:**
1. ❌ MessagePort не передавался через contextBridge
   - ✅ Решение: обработка MessagePort в preload с forwarding через callback
2. ❌ События did-finish-load не срабатывали с Vite dev server
   - ✅ Решение: использование dom-ready + fallback на did-finish-load

**Файлы:**
- [src/preload/preload.ts](src/preload/preload.ts) - MessagePort forwarding
- [src/main/main.ts](src/main/main.ts) - MessageChannel setup
- [src/renderer/renderer.ts](src/renderer/renderer.ts) - Data packet handling
- [index.html](index.html) - UI с метриками
- [src/renderer/styles.css](src/renderer/styles.css) - Стилизация

---

### Этап 4: UI и Control Panel ✅ ЗАВЕРШЕН (30-45 минут)

**Цель:** Полноценный интерфейс с кнопками управления и real-time метриками

**Задачи:**

- [X] **4.1** Создать HTML разметку в index.html (15 мин)
  - **Header секция:**
    * Заголовок: "ECU Data Prototype - 300 Parameters Stress Test"
    * Версия Electron и технологии
  - **Control Panel секция:**
    * Кнопка "Start Simulation" (зеленая)
    * Кнопка "Stop Simulation" (красная, disabled по умолчанию)
    * Метрики (spans с id для обновления):
      - Packets Received: `<span id="packet-count">0</span>`
      - FPS: `<span id="fps-count" class="fps-indicator">0</span>`
      - Uptime: `<span id="uptime">00:00</span>`
      - Dropped Packets: `<span id="dropped-packets">0 (0%)</span>`
  - **Charts секция:**
    * 3 div контейнера для графиков:
      - `<div id="chart-1" class="chart-container"></div>` (Parameters 0-2)
      - `<div id="chart-2" class="chart-container"></div>` (Parameters 3-5)
      - `<div id="chart-3" class="chart-container"></div>` (Parameters 6-8)
    * Подписи под каждым графиком
  - Подключить uPlot CSS (из node_modules или CDN)

- [X] **4.2** Добавить стили в styles.css (10 мин)
  - **Layout:**
    * Body: flexbox, column direction
    * Control Panel: flexbox row, spacing между элементами
    * Charts: CSS Grid (1 row, 3 columns, равные размеры)
  - **Компоненты:**
    * Кнопки: padding, border-radius, cursor pointer, hover effects
    * Метрики: font-size увеличен, bold для значений
  - **FPS цветовая индикация:**
    * `.fps-good` (FPS ≥55): color: green
    * `.fps-warning` (FPS 45-54): color: orange
    * `.fps-bad` (FPS <45): color: red
  - **Графики:**
    * `.chart-container`: height 300px, background: #f5f5f5, border
  - **Responsive:** работает на разрешении 1600x900

- [X] **4.3** Реализовать логику Control Panel в renderer.ts (15 мин)
  - **FPSMonitor класс:**
    * Массив `frames: number[]` для хранения timestamp'ов кадров
    * Метод `tick()`: добавить текущий timestamp, удалить старые (>1 сек)
    * Метод `getFPS()`: вернуть `frames.length`
  - **Uptime tracking:**
    * Переменная `startTime: number` при запуске симуляции
    * Функция `formatUptime(ms: number): string` → "05:23" формат
    * Обновление каждую секунду
  - **Dropped packets calculation:**
    * Expected packets = `(uptime_ms / 40) (теоретическое количество)`
    * Dropped = `expected - received`
    * Dropped % = `(dropped / expected) * 100`
  - **DOM обновления:**
    * Функция `updateMetrics()` вызывается каждую секунду через `setInterval`
    * Обновление `textContent` для всех span элементов
    * Изменение className для FPS индикатора (`fps-good/warning/bad`)
  - **Кнопки Start/Stop:**
    * Обработчики событий: `addEventListener('click')`
    * Toggle состояния кнопок (disabled/enabled)
    * Отправка IPC команд через `window.electronAPI`

**Критерий завершения этапа:**
✅ UI отображается корректно, все элементы на месте
✅ Счетчики Packets, FPS, Uptime обновляются в real-time
✅ FPS счетчик показывает ~60 (даже без графиков пока)
✅ FPS индикатор меняет цвет в зависимости от значения
✅ Кнопки Start/Stop работают корректно, меняют состояние
✅ Dropped packets рассчитывается правильно (пока должно быть 0)

**Результаты этапа:**
✅ **Дата завершения:** 20 октября 2025
✅ **HTML UI:** Полноценный интерфейс с header, control panel, метриками
✅ **FPSMonitor класс:** Реализован с методами tick(), getFPS(), reset()
✅ **Rendering loop:** requestAnimationFrame с target 60 FPS
✅ **FPS цветовая индикация:**
- Зеленый (≥55 FPS) - `.fps-good`
- Оранжевый (45-54 FPS) - `.fps-warning`
- Красный (<45 FPS) - `.fps-bad`
✅ **Метрики обновляются каждую секунду:** Packets, FPS, Uptime, Dropped, Latency
✅ **Кнопки Start/Stop:** Корректное управление состоянием (disabled/enabled)
✅ **Uptime формат:** MM:SS (например, 05:23)

**Файлы обновлены:**
- [index.html](index.html) - добавлена FPS метрика
- [src/renderer/styles.css](src/renderer/styles.css) - CSS классы для FPS индикации
- [src/renderer/renderer.ts](src/renderer/renderer.ts) - FPSMonitor класс, rendering loop

---

### Этап 5: Графики с uPlot (60-90 минут)

**Цель:** 3 графика обновляются плавно при 60 FPS, отображают real-time данные

**Задачи:**

- [ ] **5.1** Установить и подключить uPlot (10 мин)
  - `npm install uplot`
  - Импортировать в renderer.ts: `import uPlot from 'uplot'`
  - Импортировать CSS: `import 'uplot/dist/uPlot.min.css'`
  - Проверка: библиотека доступна, типы работают

- [ ] **5.2** Реализовать CircularBuffer класс (20 мин)
  - Файл `src/renderer/circular-buffer.ts`
  - Generic класс `CircularBuffer<T>`:
    ```typescript
    class CircularBuffer<T> {
      private buffer: T[];
      private writeIndex: number;
      private size: number;
      constructor(private capacity: number);
      push(item: T): void;
      getAll(): T[];
      clear(): void;
      get length(): number;
    }
    ```
  - Логика:
    * `push()`: добавить элемент, двигать writeIndex по кругу
    * Если буфер полон, перезаписывать старые данные (FIFO)
    * `getAll()`: вернуть данные в правильном порядке (от старых к новым)
  - **Оптимизация:** создать специализированную версию `TypedCircularBuffer` с Float64Array
  - Тесты: проверить capacity 5, добавить 10 элементов, getAll() должен вернуть последние 5

- [ ] **5.3** Создать ChartManager класс (30 мин)
  - Файл `src/renderer/chart-manager.ts`
  - Класс управляет 3 uPlot графиками
  - **Конструктор:**
    * Принимает массив контейнеров: `containers: HTMLElement[]`
    * Создает 3 экземпляра uPlot с оптимальной конфигурацией:
      ```typescript
      {
        width: container.clientWidth,
        height: 300,
        series: [
          {}, // time axis
          { label: "Param 0", stroke: "red", width: 2 },
          { label: "Param 1", stroke: "blue", width: 2 },
          { label: "Param 2", stroke: "green", width: 2 }
        ],
        axes: [
          { label: "Time (s)" },
          { label: "Value" }
        ],
        legend: { show: true },
        cursor: { show: true },
        // КРИТИЧНО для производительности:
        hooks: {},
        plugins: []
      }
      ```
    * Создать CircularBuffer для каждого графика (capacity: 1500 = 60 сек @ 25Hz)
  - **Методы:**
    * `addDataPoint(chartIndex: number, timestamp: number, values: number[])`:
      - Добавить данные в соответствующий CircularBuffer
      - НЕ вызывать update немедленно (batching)
    * `updateCharts()`:
      - Извлечь данные из всех buffers
      - Преобразовать в формат uPlot: `[timestamps[], series1[], series2[], series3[]]`
      - Вызвать `chart.setData(data)` для каждого графика
    * `destroy()`: очистка ресурсов
  - **Mapping параметров:**
    * Chart 1: параметры 0, 1, 2
    * Chart 2: параметры 3, 4, 5
    * Chart 3: параметры 6, 7, 8

- [ ] **5.4** Интегрировать с данными и rendering loop (20 мин)
  - В `renderer.ts` создать экземпляр ChartManager:
    ```typescript
    const chartManager = new ChartManager([
      document.getElementById('chart-1')!,
      document.getElementById('chart-2')!,
      document.getElementById('chart-3')!
    ]);
    ```
  - В обработчике `handleDataPacket()`:
    * Добавлять данные в ChartManager: `chartManager.addDataPoint(...)`
    * НЕ обновлять графики на каждый пакет
  - **Rendering loop с requestAnimationFrame:**
    ```typescript
    let lastFrameTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS; // ~16.67ms

    function renderLoop(currentTime: number) {
      const deltaTime = currentTime - lastFrameTime;

      if (deltaTime >= frameInterval) {
        lastFrameTime = currentTime - (deltaTime % frameInterval);

        // Обновить графики
        chartManager.updateCharts();

        // Обновить FPS counter
        fpsMonitor.tick();
      }

      requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);
    ```
  - **Измерение render time:**
    * `const startTime = performance.now()`
    * `chartManager.updateCharts()`
    * `const renderTime = performance.now() - startTime`
    * Сохранить для логирования

- [ ] **5.5** Оптимизация производительности (10 мин)
  - Открыть DevTools → Performance Monitor
  - Запустить симуляцию на 1 минуту
  - **Проверить метрики:**
    * CPU usage через Activity Monitor (должно быть <40%)
    * FPS в UI (должно быть ≥55)
    * Render time (должно быть <10ms)
  - **Если FPS падает:**
    * Decimation: уменьшить количество точек на графиках (каждую 2-ю или 3-ю точку)
    * Уменьшить capacity CircularBuffer (например, до 750 = 30 сек)
  - **Если CPU высокий:**
    * Добавить CSS `transform: translateZ(0)` для GPU acceleration графиков
    * Проверить что uPlot options правильные (animation: false, parsing: false)
  - **Финальная проверка:** 3 графика обновляются плавно, синхронно, без лагов

**Критерий завершения этапа:**
✅ 3 графика отображаются и обновляются плавно
✅ FPS стабильно держится ≥55 (целевой 60)
✅ CPU usage <40% (проверено через Activity Monitor на macOS)
✅ Графики показывают последние 60 секунд данных (1500 точек)
✅ Render time <10ms
✅ Визуально: нет лагов, подвисаний, графики синхронны

---

### Этап 6: Performance Logging с Pino (30-45 минут)

**Цель:** Все метрики логируются в файлы для последующего анализа и сравнения с Qt

**Задачи:**

- [ ] **6.1** Настроить Pino logger в Main Process (15 мин)
  - Установить зависимости: `npm install pino rotating-file-stream`
  - Файл `src/main/logger.ts`:
    ```typescript
    import pino from 'pino';
    import { createStream } from 'rotating-file-stream';

    const stream = createStream('performance-main.log', {
      size: '10M',      // rotate at 10MB
      maxFiles: 5,      // keep max 5 files
      compress: 'gzip', // compress old logs
      path: './logs'
    });

    export const logger = pino({
      level: 'info',
      timestamp: pino.stdTimeFunctions.isoTime,
    }, stream);
    ```
  - Создать папку `logs/` если не существует
  - Тест: запустить logger, проверить что файл создается

- [ ] **6.2** Реализовать метрики Main Process (15 мин)
  - **CPUMonitor класс:**
    ```typescript
    class CPUMonitor {
      private previousCPU = process.cpuUsage();
      private previousTime = Date.now();

      getCPUPercentage(): number {
        const currentCPU = process.cpuUsage(this.previousCPU);
        const currentTime = Date.now();
        const timeDiff = currentTime - this.previousTime;
        const totalCPU = (currentCPU.user + currentCPU.system) / 1000;
        const cpuPercent = (totalCPU / timeDiff) * 100;

        this.previousCPU = process.cpuUsage();
        this.previousTime = currentTime;

        return parseFloat(cpuPercent.toFixed(2));
      }
    }
    ```
  - **EventLoopMonitor класс:**
    ```typescript
    import { performance } from 'perf_hooks';

    class EventLoopMonitor {
      private previousELU = performance.eventLoopUtilization();

      getUtilization() {
        const currentELU = performance.eventLoopUtilization(this.previousELU);
        this.previousELU = performance.eventLoopUtilization();
        return {
          utilization: (currentELU.utilization * 100).toFixed(2),
          active: currentELU.active,
          idle: currentELU.idle
        };
      }
    }
    ```
  - **PacketTracker:**
    * Счетчики: `receivedCount`, `expectedCount`
    * Методы: `onPacketGenerated()`, `getDroppedCount()`, `getDroppedPercentage()`
  - **PerformanceLogger класс:**
    * Объединить все мониторы
    * Метод `start(intervalMs)`: запустить логирование каждые N мс
    * Метод `logMetrics()`: собрать все метрики и записать одним вызовом `logger.info()`
    * Формат лога:
      ```json
      {
        "timestamp": 1729353601234,
        "process": "main",
        "cpu": 12.5,
        "memory": {
          "heapUsed": 45678912,
          "heapTotal": 67890123,
          "rss": 156234567
        },
        "eventLoop": {
          "utilization": "15.23",
          "active": 152300000,
          "idle": 847700000
        },
        "packets": {
          "received": 150,
          "expected": 150,
          "dropped": 0,
          "droppedPercent": 0
        }
      }
      ```
  - Запустить логирование каждую **1 секунду** (не чаще, чтобы минимизировать overhead)

- [ ] **6.3** Реализовать метрики Renderer Process (15 мин)
  - **Вариант 1: Logger в Renderer (проще для прототипа):**
    * Аналогично main process, но отдельный файл `performance-renderer.log`
    * Может быть ограничение sandbox - в этом случае использовать вариант 2
  - **Вариант 2: Отправка метрик в Main через IPC (рекомендуется):**
    * Renderer собирает метрики
    * Отправляет через `window.electronAPI.logPerformance(metrics)`
    * Main Process записывает в общий или отдельный лог
  - **Метрики Renderer:**
    * FPS (из FPSMonitor)
    * Render time (последнее измерение)
    * Memory: `performance.memory.usedJSHeapSize` (если доступно)
    * IPC latency: `Date.now() - packet.timestamp`
  - **Формат лога:**
    ```json
    {
      "timestamp": 1729353601234,
      "process": "renderer",
      "fps": 59,
      "renderTime": 8.5,
      "memory": {
        "usedJSHeapSize": 45889012,
        "totalJSHeapSize": 67890123
      },
      "ipc": {
        "latency": 2.3
      }
    }
    ```
  - Логировать каждую **1 секунду**

- [ ] **6.4** Создать скрипт анализа логов (опционально, 15 мин)
  - Файл `scripts/analyze-logs.js`
  - Парсинг NDJSON файлов (построчно, каждая строка = JSON)
  - Сбор статистики:
    * FPS: min, max, avg, median, p95, p99
    * CPU: min, max, avg
    * Memory: начальное, конечное, рост
    * Latency: min, max, avg, p95, p99
    * Dropped packets: total count, percentage
  - Вывод в консоль:
    ```
    Performance Statistics:
    =======================
    FPS:        min: 55, max: 60, avg: 58.5, p95: 59, p99: 60
    CPU (%):    min: 10, max: 35, avg: 25
    Memory (MB): start: 150, end: 180, growth: 30
    IPC Latency: min: 1.2ms, max: 8.5ms, avg: 2.3ms, p95: 4.1ms
    Packets:    total: 7500, dropped: 0 (0%)
    ```
  - Опционально: экспорт в CSV для импорта в Excel/Google Sheets

**Критерий завершения этапа:**
✅ Логи пишутся в `logs/performance-main.log` и `logs/performance-renderer.log`
✅ Формат: NDJSON (каждая строка - валидный JSON)
✅ Логи включают все необходимые метрики (CPU, Memory, FPS, Latency, Packets)
✅ Overhead от логирования <1% CPU (проверить с/без логирования)
✅ Скрипт анализа парсит логи и выводит статистику (опционально)

---

### Этап 7: Тестирование и оптимизация (45-60 минут)

**Цель:** Все 7 KPI выполнены, прототип готов к сравнению с Qt приложением

**Задачи:**

- [ ] **7.1** Тест 1: Короткий прогон (1 минута) (10 мин)
  - Запустить симуляцию: `npm start`
  - Нажать "Start Simulation"
  - Работать ровно 1 минуту
  - **Проверки:**
    * FPS: должен быть ≥55 весь период
    * Dropped packets: должно быть 0
    * Визуально: графики плавные, нет лагов, UI отзывчивый
    * Packets received: ~1500 пакетов (25 Hz × 60 сек)
  - Нажать "Stop Simulation"
  - Проверить DevTools Console: нет ошибок
  - **Результат:** записать в roadmap (например: "✅ FPS: 58-60, Dropped: 0")

- [ ] **7.2** Тест 2: Средний прогон (5 минут) - основной acceptance test (15 мин)
  - Запустить симуляцию на 5 минут
  - Открыть Activity Monitor (macOS): мониторить процессы Electron
  - **Проверки в реальном времени:**
    * CPU usage: должно быть <40% (суммарно Main + Renderer + GPU)
    * Memory (RSS): записать начальное значение, затем конечное
    * FPS: не должен падать ниже 55
    * Uptime: должен корректно показывать 05:00
    * Packets: ~7500 пакетов (25 Hz × 300 сек)
  - **Проверки после завершения:**
    * Memory growth: `final_memory - initial_memory` должно быть <50MB
    * Dropped packets: должно быть 0 или <1%
    * Логи: `logs/performance-main.log` и `logs/performance-renderer.log` созданы
  - Запустить `node scripts/analyze-logs.js logs/performance-renderer.log`
  - **Результаты записать в roadmap и в таблицу KPI**

- [ ] **7.3** Тест 3: Долгий прогон (15 минут) - опционально (20 мин)
  - Стресс-тест на 15 минут
  - **Цель:** проверить отсутствие memory leaks и деградации производительности
  - **Проверки:**
    * Memory growth: должен быть линейным или стабилизироваться
    * FPS: не должен деградировать со временем
    * Event loop lag: не должен расти (проверить в логах)
  - **Если есть проблемы:**
    * Memory leak: проверить CircularBuffers, event listeners, закрытие MessagePort
    * FPS degradation: профилирование через Chrome DevTools Performance
  - **Результат:** если тест пройден, прототип production-ready для длительной работы

- [ ] **7.4** Тест 4: Start/Stop циклы (10 мин)
  - 10 циклов: Start → работа 30 секунд → Stop → пауза 5 секунд → повторить
  - **Цель:** проверить корректность очистки ресурсов при остановке
  - **Проверки:**
    * Memory не растет после каждого цикла (утечки при restart)
    * Счетчики корректно сбрасываются
    * Нет ошибок в консоли
    * Графики корректно очищаются/обновляются
  - **Если memory растет:**
    * Проверить что timer останавливается: `timer.stop()`
    * Проверить что MessagePort закрывается
    * Проверить что CircularBuffers очищаются: `buffer.clear()`
    * Проверить что event listeners удаляются

- [ ] **7.5** Финальная оптимизация (опционально, 20 мин)
  - **Если FPS <55:**
    * Decimation: отображать каждую N-ю точку на графиках
    * Уменьшить buffer size (30 сек вместо 60)
    * Проверить uPlot настройки: все оптимизации включены?
  - **Если CPU >40%:**
    * Профилирование: Chrome DevTools → Performance → Record 10 sec
    * Найти bottleneck (обычно: рендеринг графиков или IPC)
    * Возможные решения:
      - OffscreenCanvas + Web Worker для рендеринга
      - Batching: обновлять графики каждые 32ms (30 FPS) вместо 16ms
  - **Если memory leak:**
    * Chrome DevTools → Memory → Take Heap Snapshot
    * Сравнить snapshot до/после 5-минутного теста
    * Искать detached DOM nodes, retained objects
  - **Финальная проверка:** запустить Тест 2 (5 минут) еще раз, все KPI должны быть ✅

- [ ] **7.6** Создать README.md с документацией (10 мин)
  - **Секции:**
    * **Overview:** что это, цель прототипа
    * **Requirements:** Node.js 20+, npm, macOS 10.15+
    * **Installation:**
      ```bash
      npm install
      npm run build
      ```
    * **Running:**
      ```bash
      npm start
      # Нажать "Start Simulation"
      # Дать поработать 5 минут
      # Нажать "Stop Simulation"
      ```
    * **Testing Scenarios:** ссылка на roadmap.md Этап 7
    * **Performance Metrics:** где найти логи, как анализировать
    * **Results:** таблица с результатами тестов (KPI)
    * **Comparison with Qt:** как интерпретировать результаты
    * **Architecture:** краткое описание Main/Renderer, IPC, технологий
  - Добавить скриншот UI (опционально)

**Критерий завершения этапа:**
✅ **KPI-1:** Работает стабильно 5+ минут без сбоев
✅ **KPI-2:** FPS ≥55 (целевой 60) на протяжении всего теста
✅ **KPI-3:** Dropped packets = 0 (или <1%)
✅ **KPI-4:** IPC Latency <50ms (avg <10ms желательно)
✅ **KPI-5:** CPU usage <40% (суммарно Electron процессы)
✅ **KPI-6:** Memory growth <50MB за 5 минут
✅ **KPI-7:** Три графика синхронны, плавные, без артефактов
✅ README.md готов с инструкциями

---

## 📝 Текущая сессия

### 2025-10-20:
- [X] Изучение технического задания `electron_prototype_spec.md`
- [X] Исследование Electron best practices (версия, IPC, производительность)
- [X] Исследование библиотек графиков (выбор: uPlot)
- [X] Исследование performance logging (выбор: Pino)
- [X] Создание roadmap.md
- [ ] **Следующее:** Начать Этап 1 - Создать базовую структуру проекта

---

## 🎯 KPI Tracking

| KPI | Target | Current | Status | Notes |
|-----|--------|---------|--------|-------|
| **KPI-1:** Stability (5 min) | ✅ Pass | - | ⏳ Pending | Test in Этап 7.2 |
| **KPI-2:** FPS | ≥55 (target 60) | - | ⏳ Pending | Monitor in Этап 5, test in 7 |
| **KPI-3:** Dropped Packets | 0 (or <1%) | - | ⏳ Pending | Track in Этап 3-7 |
| **KPI-4:** IPC Latency | <50ms | - | ⏳ Pending | Measure in Этап 6 |
| **KPI-5:** CPU Usage | <40% | - | ⏳ Pending | Test in Этап 7.2 (Activity Monitor) |
| **KPI-6:** Memory Growth | <50MB/5min | - | ⏳ Pending | Test in Этап 7.2 |
| **KPI-7:** Charts Sync | ✅ Smooth | - | ⏳ Pending | Visual check in Этап 5, 7 |

---

## 📊 Сравнение с Qt (заполнить после тестов)

| Metric | Electron | Qt | Delta | Winner | Comments |
|--------|----------|----|----|--------|----------|
| **Avg FPS** | ? | ? | ? | ? | - |
| **P95 FPS** | ? | ? | ? | ? | - |
| **P99 FPS** | ? | ? | ? | ? | - |
| **CPU Main (%)** | ? | ? | ? | ? | - |
| **CPU Renderer (%)** | ? | ? | ? | ? | - |
| **Total CPU (%)** | ? | ? | ? | ? | - |
| **Memory RSS (MB)** | ? | ? | ? | ? | - |
| **Memory Growth (MB/5min)** | ? | ? | ? | ? | - |
| **IPC Latency Avg (ms)** | ? | ? | ? | ? | - |
| **IPC Latency P95 (ms)** | ? | ? | ? | ? | - |
| **Dropped Packets (%)** | ? | ? | ? | ? | - |
| **Render Time P95 (ms)** | ? | ? | ? | ? | - |
| **Bundle Size (MB)** | ? | ? | ? | ? | - |
| **Startup Time (s)** | ? | ? | ? | ? | - |

**Выводы:** (заполнить после анализа)

---

## ⚠️ Риски и митигация

### Риск 1: FPS падает ниже 55
**Вероятность:** Medium
**Влияние:** High (критичный KPI)
**Митигация:**
- Decimation данных на графиках (показывать каждую N-ю точку)
- Уменьшить history window (30 сек вместо 60)
- Throttling: обновлять графики 30 FPS вместо 60
- OffscreenCanvas + Web Worker для рендеринга

**Альтернатива:**
- Попробовать WebGL рендеринг (webgl-plot библиотека)
- Использовать Canvas API напрямую (сложнее, но максимальная производительность)

---

### Риск 2: Memory leak
**Вероятность:** Medium
**Влияние:** High (тест 5+ минут провалится)
**Митигация:**
- Использовать CircularBuffer вместо растущих массивов
- Правильная очистка event listeners при stop
- Закрытие MessagePort при остановке
- Clear buffers при restart

**Проверка:**
- Heap snapshots в Chrome DevTools
- Мониторинг Memory в Activity Monitor
- Тест 4 (Start/Stop циклы)

---

### Риск 3: CPU usage >40%
**Вероятность:** Low (uPlot оптимизирован)
**Влияние:** Medium
**Митигация:**
- Проверить что uPlot настройки оптимальны (animation: false, parsing: false)
- GPU acceleration через CSS transforms
- OffscreenCanvas для рендеринга в отдельном потоке
- Batching: меньше IPC вызовов

**Альтернатива:**
- Уменьшить количество параметров на графиках (3 линии → 2 линии)
- Уменьшить refresh rate (30 FPS вместо 60)

---

### Риск 4: Таймер нестабилен (не 40ms)
**Вероятность:** Low (PrecisionTimer с drift compensation)
**Влияние:** Medium (влияет на реалистичность теста)
**Митигация:**
- Self-adjusting timer с process.hrtime.bigint()
- Компенсация drift на каждом tick
- Логирование фактических интервалов для отладки

**Альтернатива:**
- Использовать библиотеку nanotimer
- Использовать setImmediate + manual scheduling

---

### Риск 5: uPlot не справляется с 3 графиками
**Вероятность:** Low (benchmarks показывают хорошую производительность)
**Влияние:** High
**Митигация:**
- Decimation: меньше точек на экране
- Уменьшить line width (1px вместо 2px)
- Отключить grid, legends (минимум визуальных элементов)

**Альтернатива:**
- Переход на lightweight-charts (TradingView)
- Raw Canvas API (больше контроля, но больше кода)

---

## 🔧 Технический стек (утверждено)

| Компонент | Технология | Версия | Обоснование |
|-----------|-----------|--------|-------------|
| **Runtime** | Electron | 34.x (34.0.0+) | Последняя стабильная (Jan 2025), Chromium 132, Node.js 20.18.1 |
| **Language** | TypeScript | 5.3+ | Типизация, лучшая поддержка IDE, меньше ошибок |
| **Module System** | CommonJS (main), ESNext (renderer) | - | Node.js совместимость (main), современные возможности (renderer) |
| **Charts** | uPlot | 1.6.30+ | 10% CPU vs 40% Chart.js, 12MB RAM vs 77MB, 47KB bundle |
| **IPC** | MessagePort | Native | 10% быстрее ipcRenderer, single serialization, direct channel |
| **Data Format** | Float64Array | Native | 2x быстрее с structured clone vs JSON, оптимально для числовых данных |
| **Timer** | Custom PrecisionTimer | Custom | Nanosecond precision с process.hrtime.bigint(), drift compensation |
| **Logging** | Pino | 9.4+ | Fastest Node.js logger, <1% overhead, async by default |
| **Log Rotation** | rotating-file-stream | 3.2+ | Automatic rotation, compression, no manual management |
| **Data Storage** | Circular Buffer | Custom | Fixed memory footprint, prevents leaks, FIFO behavior |
| **Build Tool** | TypeScript compiler | 5.3+ | Native compilation, no bundler needed for prototype |

---

## 📚 Полезные команды

### Установка и сборка
```bash
# Клонировать репозиторий (если используется Git)
git clone <repo-url>
cd electron_prototype

# Установка зависимостей
npm install

# Сборка TypeScript
npm run build              # Полная сборка (main + renderer + preload)
npm run build:main         # Только main process
npm run build:renderer     # Только renderer process
npm run build:preload      # Только preload script

# Development mode (watch mode)
npm run dev                # Auto-rebuild on changes
```

### Запуск и тестирование
```bash
# Запуск приложения
npm start

# Открыть DevTools (внутри Electron)
Cmd+Option+I (macOS)

# Очистить логи перед тестом
rm -rf logs/*

# Анализ логов после теста
node scripts/analyze-logs.js logs/performance-renderer.log
node scripts/analyze-logs.js logs/performance-main.log
```

### Мониторинг производительности (macOS)
```bash
# Activity Monitor через терминал
open -a "Activity Monitor"

# Фильтровать процессы Electron:
# Activity Monitor → View → All Processes → поиск "Electron"

# Отследить процессы Electron
ps aux | grep -i electron

# Memory usage конкретного процесса
ps -o rss,vsz,pid,comm -p <PID>
```

### Chrome DevTools (для Renderer Process)
```bash
# Memory profiling:
# DevTools → Memory → Take Heap Snapshot
# Сравнить "before" и "after" 5-минутного теста

# Performance profiling:
# DevTools → Performance → Record
# Запустить симуляцию на 10 секунд
# Stop recording → анализировать bottlenecks

# Проверка Event Loop Lag:
# DevTools → Performance Monitor → check "Event Loop Lag"
```

### Отладка
```bash
# Запуск с дополнительным логированием
DEBUG=* npm start

# Запуск с exposed garbage collector (для отладки memory)
electron --js-flags="--expose-gc" .

# Тест без графиков (только IPC)
# Закомментировать ChartManager инициализацию в renderer.ts
```

---

## ✅ Checklist: Готовность к началу

### Перед началом кодинга:
- [X] Roadmap.md создан и изучен
- [X] Технологии выбраны и обоснованы
- [X] Архитектура определена (Main/Renderer/Preload)
- [ ] Зависимости установлены (`npm install`)
- [ ] IDE настроена (VSCode с TypeScript support рекомендуется)
- [ ] Git репозиторий инициализирован (опционально)

### Перед тестированием (Этап 7):
- [ ] Все этапы 1-6 завершены
- [ ] Build успешен без ошибок
- [ ] DevTools открываются без проблем
- [ ] Логи пишутся в папку `logs/`
- [ ] Activity Monitor готов для мониторинга CPU/Memory

### Перед сравнением с Qt:
- [ ] Тест 2 (5 минут) пройден успешно
- [ ] Все метрики собраны и проанализированы
- [ ] Таблица сравнения заполнена
- [ ] Скриншоты/видео UI сделаны (опционально)

---

## 📖 Документация и ресурсы

### Официальная документация:
- **Electron:** https://www.electronjs.org/docs/latest/
- **Electron IPC:** https://www.electronjs.org/docs/latest/tutorial/ipc
- **MessagePorts:** https://www.electronjs.org/docs/latest/tutorial/message-ports
- **uPlot:** https://github.com/leeoniya/uPlot
- **Pino:** https://getpino.io/

### Туториалы и best practices:
- **Electron Performance:** https://www.electronjs.org/docs/latest/tutorial/performance
- **Electron Security:** https://www.electronjs.org/docs/latest/tutorial/security
- **TypeScript with Electron:** https://www.electronjs.org/docs/latest/tutorial/typescript
- **uPlot Demos:** https://leeoniya.github.io/uPlot/demos/index.html

### Внутренняя документация:
- **Техническое задание:** [electron_prototype_spec.md](electron_prototype_spec.md)
- **Roadmap:** [roadmap.md](roadmap.md) (этот файл)
- **README:** [README.md](README.md) (создать в Этапе 7.6)

---

## 🎓 Уроки и выводы (заполнить после проекта)

### Что сработало хорошо:
- (заполнить после тестов)

### Что не сработало / проблемы:
- (заполнить после тестов)

### Оптимизации которые помогли:
- (заполнить после тестов)

### Рекомендации для production версии:
- (заполнить после тестов)

---

## 🚀 Следующие шаги после прототипа

### Если результаты хорошие (FPS >55, CPU <35%):
- [ ] Принять решение о миграции на Electron
- [ ] Разработать полное ТЗ для production приложения
- [ ] Спланировать постепенную миграцию компонентов с Qt
- [ ] Добавить реальную работу с COM-портом
- [ ] Добавить сохранение/загрузку данных
- [ ] Добавить экспорт данных (CSV, JSON)

### Если результаты средние (FPS 45-55, CPU 35-45%):
- [ ] Провести дополнительную оптимизацию
- [ ] Протестировать альтернативные библиотеки графиков
- [ ] Рассмотреть WebGL рендеринг
- [ ] Повторное тестирование после оптимизаций
- [ ] Сравнить с Qt еще раз

### Если результаты плохие (FPS <45, CPU >45%):
- [ ] Документировать причины неудачи
- [ ] Остаться на Qt/QML
- [ ] Рассмотреть гибридный подход (Qt + Electron для некоторых компонентов)
- [ ] Изучить альтернативы: Tauri, NW.js

---

**Версия roadmap:** 1.0
**Дата создания:** 20 октября 2025
**Последнее обновление:** 20 октября 2025
**Статус:** Готово к реализации ✅

**Общее время разработки:** ~4-5 часов
**Следующий шаг:** Этап 1, Задача 1.1 - Создать структуру папок проекта
