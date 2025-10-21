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

### Для разработчиков:
- **[👉 HANDOFF TO SERGEY](HANDOFF_TO_SERGEY.md)** - 📦 **НАЧНИ ЗДЕСЬ!** Инструкция для передачи проекта (Windows, COM-port, тесты)
- **[Техническое задание](electron_prototype_spec.md)** - полная спецификация проекта, KPI, требования
- **[План разработки](roadmap.md)** - 7 этапов, 40 задач, текущий прогресс (77% выполнено)
- **[История изменений](CHANGELOG.md)** - версии, результаты тестов
- **[Результаты тестов](TEST_RESULTS.md)** - детальные результаты 5-минутного теста (macOS)
- **[Быстрые результаты](QUICK_RESULTS.txt)** - краткая сводка результатов

### Детальная документация:
- **[Детальная установка](docs/setup.md)** - prerequisites, troubleshooting *(если создан)*
- **[Архитектура](docs/architecture.md)** - Main/Renderer/Preload, IPC, data flow *(если создан)*
- **[Тестирование](docs/testing.md)** - 4 тестовых сценария, интерпретация результатов *(если создан)*
- **[Troubleshooting](docs/troubleshooting.md)** - частые проблемы и решения *(если создан)*

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

## KPI Результаты (macOS, 5-minute test)

1. ✅ **Стабильность:** 5 min 4 sec без сбоев (7614 пакетов)
2. ✅ **FPS:** 60.36 avg (цель ≥55) - **превышение на 9.7%**
3. ✅ **Dropped Packets:** 0 / 7614 (0.00%) - **Perfect!**
4. ✅ **Latency:** 0.69ms avg (цель <50ms) - **в 72 раза лучше!**
5. ✅ **CPU:** 1.72% avg (цель <40%) - **в 23 раза лучше!**
6. ✅ **Memory:** +16.75 MB (цель <50MB) - **в 3 раза лучше!**
7. ✅ **Charts:** 0.61ms render time - **плавно и синхронно!**

**Итог:** ✅ **ВСЕ 7 KPI ВЫПОЛНЕНЫ С БОЛЬШИМ ЗАПАСОМ!**

См. [TEST_RESULTS.md](TEST_RESULTS.md) для детального отчёта и [roadmap.md](roadmap.md) для полной таблицы KPI.

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

## Текущий статус

**Этапы 1-6:** ✅ **ЗАВЕРШЕНЫ** (40/40 задач = 100%)
- Этап 1: Базовая структура ✅
- Этап 2: Генерация данных ✅
- Этап 3: IPC через MessagePort ✅
- Этап 4: UI и Control Panel ✅
- Этап 5: Графики с uPlot ✅
- Этап 6: Performance Logging ✅

**Этап 7:** Тестирование - 5-минутный acceptance test **ПРОЙДЕН** ✅

**Следующие шаги:**
- Windows тестирование (Сергей)
- Интеграция реального COM-порта
- Стресс-тесты на Windows

См. [roadmap.md](roadmap.md) для полного плана разработки.

## Для Сергея (Windows + COM-port)

**👉 НАЧНИ С ЭТОГО ФАЙЛА: [HANDOFF_TO_SERGEY.md](HANDOFF_TO_SERGEY.md)**

Этот документ содержит:
- Инструкции по запуску на Windows
- Интеграцию COM-порта (вместо симуляции)
- Тестовые сценарии для Windows
- Troubleshooting Windows-специфичных проблем
- Чек-лист задач

## Версионирование

**Текущая версия:** v0.5.0

**История:**
- v0.5.0 - Performance Logging + 5-minute acceptance test (все KPI ✅)
- v0.4.1 - Исправление packet.data → packet.values (графики работают)
- v0.4.0 - UI + FPS monitoring + uPlot charts
- v0.3.0 - MessagePort IPC
- v0.2.0 - Data generation + PrecisionTimer
- v0.1.0 - Базовая структура проекта

См. [CHANGELOG.md](CHANGELOG.md) для полной истории изменений.

## Лицензия

MIT
