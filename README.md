# Electron ECU Data Prototype

Минимальный прототип на Electron для проверки производительности при обработке real-time данных с интервалом 40ms (25 Hz), имитирующих поток от ЭБУ двигателя.

**Стресс-тест:** 300 параметров в каждом пакете для оценки возможной миграции с Qt/QML на Electron.

## Быстрый старт

### Требования
- Node.js 20+
- npm 11+
- macOS 10.15+ (текущая платформа тестирования)

### Установка
```bash
npm install
```

### Запуск
```bash
npm start
```

Приложение запустится в dev режиме с hot-reload через Vite.

### Тестовый сценарий (5 минут)
1. Нажать "Start Simulation" в UI
2. Дать поработать 5 минут
3. Нажать "Stop Simulation"
4. Проверить метрики: FPS, CPU, Memory, Dropped Packets
5. Проверить логи в `logs/` папке

## Документация

- **[Техническое задание](electron_prototype_spec.md)** - полная спецификация проекта, KPI, требования
- **[План разработки](roadmap.md)** - 7 этапов, 40 задач, текущий прогресс
- **[История изменений](CHANGELOG.md)** - версии, результаты тестов
- **[Детальная установка](docs/setup.md)** - prerequisites, troubleshooting
- **[Архитектура](docs/architecture.md)** - Main/Renderer/Preload, IPC, data flow
- **[Тестирование](docs/testing.md)** - 4 тестовых сценария, интерпретация результатов
- **[Troubleshooting](docs/troubleshooting.md)** - частые проблемы и решения

## Технологии

**Core:**
- **Electron 34.0.0** (Chromium 132, Node.js 20.18.1)
- **TypeScript 5.3.3**
- **Electron Forge 7.10.2** - build tooling
- **Vite 5.4.21** - fast bundler with HMR

**Charts:**
- **uPlot 1.6.30** (10% CPU vs 40% у Chart.js при 60 FPS)

**IPC:**
- **MessagePort** (10% быстрее традиционного ipcRenderer)
- **Float64Array** для данных (2x быстрее с structured clone)

**Logging:**
- **Pino 9.4.0** (<1% overhead, async by default)
- **rotating-file-stream 3.2.0** - автоматическая ротация логов

**Performance:**
- **PrecisionTimer** (custom) - drift compensation через process.hrtime.bigint()
- **CircularBuffer** (custom) - fixed memory footprint для графиков

## KPI Цели

1. ⏳ **Стабильность:** 5+ минут без сбоев (7500+ пакетов)
2. ⏳ **FPS:** ≥55 (целевой 60)
3. ⏳ **Dropped Packets:** 0 (или <1%)
4. ⏳ **Latency:** данные→UI не более 50ms
5. ⏳ **CPU:** не более 40% на macOS
6. ⏳ **Memory:** рост не более 50MB за 5 минут
7. ⏳ **Charts:** 3 графика синхронны и плавны

См. [roadmap.md](roadmap.md) для актуального статуса KPI и [electron_prototype_spec.md](electron_prototype_spec.md) для полной спецификации.

## Команды

```bash
# Development (с hot-reload)
npm start

# Build для production
npm run package

# Создать дистрибутивы (.dmg, .zip)
npm run make

# Lint
npm run lint
```

## Структура проекта

```
electron_prototype/
├── src/
│   ├── main/             # Main Process (Node.js)
│   │   ├── main.ts       # Точка входа
│   │   ├── data-generator.ts  # Генератор 300 параметров
│   │   ├── precision-timer.ts # Таймер @ 25Hz с drift compensation
│   │   └── types.ts      # TypeScript интерфейсы
│   ├── preload/          # Preload script (contextBridge)
│   │   ├── preload.ts
│   │   └── preload.d.ts
│   └── renderer/         # Renderer Process (UI)
│       ├── renderer.ts   # UI логика
│       └── styles.css    # Стили
├── index.html            # UI разметка
├── forge.config.ts       # Electron Forge конфигурация
├── vite.*.config.ts      # Vite конфигурации (main/preload/renderer)
└── docs/                 # Детальная документация
```

## Roadmap

См. [roadmap.md](roadmap.md) для детального плана разработки (7 этапов, 40 задач).

**Текущий статус:** Этап 3/7 завершен ✅ (MessagePort IPC коммуникация)
**Прогресь:** 17/40 задач (42.5%)

## Результаты

См. [CHANGELOG.md](CHANGELOG.md) для результатов тестов и истории изменений.

## Лицензия

MIT
