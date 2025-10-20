# Руководство по ведению документации проекта

> **Важно:** Этот документ описывает правила и принципы ведения документации Electron ECU Data Prototype.
> При любых изменениях в проекте следуй этим правилам!

---

## 🚨 ОБЯЗАТЕЛЬНОЕ ПРАВИЛО ДЛЯ ВСЕХ ИЗМЕНЕНИЙ

### После ЛЮБЫХ значительных изменений документация ОБЯЗАНА быть обновлена!

**Что считается "значительными изменениями":**
- ✅ Создание новых файлов (классы, модули, компоненты)
- ✅ Изменение архитектуры (Main/Renderer/Preload)
- ✅ Добавление или удаление npm зависимостей
- ✅ Изменение IPC коммуникации (MessagePort, handlers)
- ✅ Изменение структуры папок
- ✅ Добавление новых функций/фич (графики, метрики, логирование)
- ✅ Изменение производительности (оптимизации, bottlenecks)
- ✅ Изменение KPI метрик или тестовых сценариев
- ✅ Завершение задач из roadmap

**Что нужно сделать:**
1. ✅ Обновить все файлы документации согласно правилам SSOT
2. ✅ Пройти чек-лист (см. раздел "Чек-лист при изменениях")
3. ✅ Проверить, что нигде нет дублирования информации
4. ✅ Обновить CHANGELOG.md (история изменений)
5. ✅ Обновить roadmap.md (отметить выполненные задачи [X])
6. ✅ Обновить KPI Tracking таблицу (если метрики изменились)

**Это НЕ рекомендация, это ОБЯЗАТЕЛЬНОЕ требование!**

> 💡 Неактуальная документация хуже, чем отсутствие документации.
> Всегда обновляй документы после изменений!

---

## 🎯 Принципы документации

### 1. Single Source of Truth (SSOT)
- Каждая информация живёт в ОДНОМ месте
- Остальные файлы ссылаются на неё
- Обновил в одном месте → везде актуально

**Пример:**
- ❌ Неправильно: Писать количество параметров (300) в README, roadmap, и архитектуре
- ✅ Правильно: Написать в `electron_prototype_spec.md` (ТЗ), остальные ссылаются на спеку

### 2. README = Точка входа
- **Размер:** 80-120 строк (не больше!)
- **Содержание:** Только быстрый старт
- **Детали:** Ссылки на docs/ для подробностей
- **Назначение:** Дать понять что это за проект и как быстро запустить

### 3. docs/ = Детали
- Детальная установка → `docs/setup.md`
- Архитектура → `docs/architecture.md`
- Тестирование → `docs/testing.md`
- Troubleshooting → `docs/troubleshooting.md`

### 4. Не дублируй информацию!
- Если нужно повторить - сделай ссылку
- Один источник правды = легче обновлять

---

## 📁 Обязательная структура файлов

```
electron_prototype/
│
├── README.md ──────────────────────► ТОЧКА ВХОДА (80-120 строк)
│                                     • Что это (2-3 предложения)
│                                     • Быстрый старт (npm install, npm start)
│                                     • Ссылки на docs/
│                                     • Технологии (Electron 34, TypeScript, uPlot)
│
├── electron_prototype_spec.md ────► ТЕХНИЧЕСКОЕ ЗАДАНИЕ (ИСТОЧНИК ИСТИНЫ)
│                                     • Требования (300 параметров, 25 Hz)
│                                     • KPI метрики (7 критериев успеха)
│                                     • Архитектура (Main/Renderer/Preload)
│                                     • Спецификации (DataPacket, IPC Events)
│                                     ⚠️ НЕ ИЗМЕНЯТЬ БЕЗ СОГЛАСОВАНИЯ!
│
├── roadmap.md ─────────────────────► ПЛАН РАЗРАБОТКИ
│                                     • 7 этапов разработки
│                                     • 40 задач с чекбоксами [X]
│                                     • Текущий статус (прогресс)
│                                     • KPI Tracking таблица
│                                     • Риски и митигация
│                                     ⚠️ ОБНОВЛЯТЬ ПОСЛЕ КАЖДОЙ ЗАДАЧИ!
│
├── CHANGELOG.md ───────────────────► ИСТОРИЯ ИЗМЕНЕНИЙ
│                                     • Semantic Versioning (v0.1.0, v1.0.0)
│                                     • Что добавили (Added)
│                                     • Что изменили (Changed)
│                                     • Что починили (Fixed)
│                                     • Результаты тестов (Performance)
│
├── DOCUMENTATION_GUIDE.md ─────────► ЭТОТ ФАЙЛ (правила!)
│                                     • Как вести документацию
│                                     • Принципы SSOT
│                                     • Чек-листы
│
├── .gitignore ─────────────────────► ЧТО НЕ КОММИТИТЬ
│                                     • node_modules/, dist/, logs/
│
├── package.json ───────────────────► NPM ЗАВИСИМОСТИ
├── tsconfig.json ──────────────────► TYPESCRIPT КОНФИГУРАЦИЯ
├── tsconfig.main.json ─────────────► Main Process TypeScript
├── tsconfig.renderer.json ─────────► Renderer Process TypeScript
├── tsconfig.preload.json ──────────► Preload Script TypeScript
│
├── src/ ───────────────────────────► ИСХОДНЫЙ КОД
│   ├── main/                        • Main Process (Node.js)
│   │   ├── main.ts                  • Точка входа
│   │   ├── data-generator.ts        • Генерация 300 параметров @ 25Hz
│   │   ├── precision-timer.ts       • Таймер с drift compensation
│   │   ├── types.ts                 • TypeScript интерфейсы
│   │   └── logger.ts                • Pino logger setup
│   │
│   ├── preload/                     • Preload Scripts
│   │   └── preload.ts               • contextBridge для безопасного IPC
│   │
│   └── renderer/                    • Renderer Process (UI)
│       ├── index.html               • HTML разметка
│       ├── renderer.ts              • UI логика
│       ├── chart-manager.ts         • uPlot графики (3 charts)
│       ├── circular-buffer.ts       • Fixed-size buffer для данных
│       └── styles.css               • CSS стили
│
├── dist/ ──────────────────────────► COMPILED OUTPUT (не коммитить)
│   ├── main/
│   ├── preload/
│   └── renderer/
│
├── logs/ ──────────────────────────► PERFORMANCE LOGS (не коммитить)
│   ├── performance-main.log
│   └── performance-renderer.log
│
├── scripts/ ───────────────────────► UTILITY SCRIPTS
│   └── analyze-logs.js              • Анализ performance логов
│
└── docs/ ──────────────────────────► ДЕТАЛЬНАЯ ДОКУМЕНТАЦИЯ
    │
    ├── setup.md ───────────────────► ДЕТАЛЬНАЯ УСТАНОВКА
    │                                 • Prerequisites (Node.js 20+, macOS)
    │                                 • Installation (npm install, build)
    │                                 • Running (npm start)
    │                                 • Проверка работы
    │
    ├── architecture.md ────────────► АРХИТЕКТУРА СИСТЕМЫ
    │                                 • Main Process architecture
    │                                 • Renderer Process architecture
    │                                 • IPC через MessagePort
    │                                 • Data flow диаграммы
    │                                 • Performance optimizations
    │
    ├── testing.md ─────────────────► ТЕСТИРОВАНИЕ
    │                                 • 4 тестовых сценария
    │                                 • Как запускать тесты
    │                                 • Интерпретация результатов
    │                                 • Сравнение с Qt
    │
    ├── troubleshooting.md ─────────► ПРОБЛЕМЫ И РЕШЕНИЯ
    │                                 • Частые ошибки
    │                                 • Memory leaks
    │                                 • FPS drops
    │                                 • IPC issues
    │
    └── decisions/ ─────────────────► ADR (Architecture Decision Records)
        ├── 001-electron-version.md  • Почему Electron 34.x
        ├── 002-chart-library.md     • Почему uPlot вместо Chart.js
        ├── 003-ipc-strategy.md      • Почему MessagePort
        ├── 004-timer-precision.md   • Почему PrecisionTimer с hrtime
        └── template.md              • Шаблон для новых ADR
```

---

## 📝 Шаблоны файлов

### README.md (80-120 строк)

```markdown
# Electron ECU Data Prototype

Минимальный прототип на Electron для проверки производительности при обработке
real-time данных с интервалом 40ms (25 Hz), имитирующих поток от ЭБУ двигателя.

**Стресс-тест:** 300 параметров в каждом пакете.

## Быстрый старт

### Требования
- Node.js 20+
- npm
- macOS 10.15+ (текущая платформа тестирования)

### Установка
\`\`\`bash
npm install
npm run build
\`\`\`

### Запуск
\`\`\`bash
npm start
\`\`\`

1. Нажать "Start Simulation"
2. Дать поработать 5 минут
3. Нажать "Stop Simulation"
4. Проверить метрики и логи

## Документация

- [Детальная установка](docs/setup.md)
- [Архитектура](docs/architecture.md)
- [Тестирование](docs/testing.md)
- [Troubleshooting](docs/troubleshooting.md)

## Технологии

**Core:**
- Electron 34.x (Chromium 132, Node.js 20.18.1)
- TypeScript 5.3+

**Charts:**
- uPlot 1.6.30+ (10% CPU vs 40% Chart.js)

**IPC:**
- MessagePort (10% faster than ipcRenderer)

**Logging:**
- Pino 9.4+ (<1% overhead)

## Roadmap

См. [roadmap.md](roadmap.md)

## Результаты

См. [CHANGELOG.md](CHANGELOG.md) для результатов тестов.

## Лицензия

MIT
```

---

### roadmap.md

```markdown
# Roadmap: Electron ECU Data Prototype

## 🎯 Цель проекта
Создать прототип для проверки производительности Electron vs Qt/QML.

## 📊 Текущий статус
- **Этап:** [1-7]
- **Прогресс:** X/40 задач (Y%)
- **Следующее:** [следующая задача]

## 🚀 Этапы разработки

### Этап 1: Базовая структура ✅ ЗАВЕРШЕН
**Цель:** TypeScript проект настроен

- [X] 1.1 Создать структуру папок (15 мин)
- [X] 1.2 Настроить package.json (10 мин)
- [X] 1.3 TypeScript конфигурации (10 мин)
- [X] 1.4 Минимальный main.ts (10 мин)

**Результат:** `npm start` запускает пустое окно

### Этап 2: Генерация данных
...

## 🎯 KPI Tracking
| KPI | Target | Current | Status |
|-----|--------|---------|--------|
| ... | ...    | ...     | ...    |
```

---

### CHANGELOG.md

```markdown
# Changelog

Все значительные изменения проекта документируются в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/),
версионирование следует [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Planned
- Тест 3: Долгий прогон 15 минут
- Windows тестирование

## [0.3.0] - 2025-10-21

### Added
- Графики uPlot (3 charts)
- Circular buffers для данных
- FPS monitoring

### Changed
- Оптимизация рендеринга: decimation

### Performance
- FPS: 58-60 stable
- CPU: 25-35%
- Memory: +30MB/5min

## [0.2.0] - 2025-10-20

### Added
- IPC через MessagePort
- Генерация 300 параметров @ 25Hz
- PrecisionTimer с drift compensation

### Fixed
- Таймер drift (теперь 40ms ±2ms)

## [0.1.0] - 2025-10-20

### Added
- Базовая структура проекта
- TypeScript setup
- Electron 34.x configuration
```

---

### docs/decisions/template.md (ADR)

```markdown
# ADR [NUMBER]: [TITLE]

**Дата:** YYYY-MM-DD
**Статус:** [Предложено / Принято / Отклонено]
**Автор:** [Claude Code / User]

## Контекст

[Опиши проблему или вопрос, который требует решения]

Например:
"Нужно выбрать библиотеку для отображения 3 real-time графиков
с обновлением 60 FPS. Каждый график отображает 500-1500 точек."

## Решение

[Что решили делать]

Например:
"Использовать uPlot v1.6.30+ для отображения графиков."

## Причины

1. **Производительность:** uPlot использует 10% CPU vs 40% у Chart.js
2. **Память:** 12MB RAM vs 77MB у Chart.js при 60 FPS
3. **Bundle size:** 47.9 KB vs 265 KB
4. **Специализация:** Создан специально для time-series данных

## Последствия

**Плюсы:**
- ✅ Достигаем целевой 60 FPS
- ✅ CPU <40% (KPI-5 выполнен)
- ✅ Минимальный bundle size

**Минусы:**
- ⚠️ Менее intuitive API чем Chart.js
- ⚠️ Документация хуже (больше примеров кода)
- ⚠️ Меньше фич "из коробки"

## Альтернативы

### Chart.js v4 + streaming plugin
**Отклонено:** Не может стабильно держать 60 FPS с 3 графиками.
Benchmarks показывают 40% CPU и 77MB RAM.

### Lightweight-charts (TradingView)
**Отклонено:** Специализирован на финансовых графиках (candlestick, OHLC).
Нет явных преимуществ для нашего use case.

### Raw Canvas API
**Отклонено для прототипа:** Максимальная производительность, но требует
значительно больше времени на разработку. Рассмотреть если uPlot не справится.

## Ссылки

- [uPlot GitHub](https://github.com/leeoniya/uPlot)
- [Performance Benchmarks](https://github.com/leeoniya/uPlot#performance)
- [Research Report](../research/chart-libraries-comparison.md)
```

---

## ✅ Чек-лист при изменениях

### Когда меняешь код:

**1. Завершил задачу из roadmap?**
- [ ] Отметь [X] задачу в roadmap.md
- [ ] Обнови "Текущий статус" → следующая задача
- [ ] Обнови "Прогресс" (X/40 задач, Y%)
- [ ] Добавь запись в CHANGELOG.md (что изменилось)

**2. Добавил новую фичу/класс/модуль?**
- [ ] Обнови docs/architecture.md (если меняет архитектуру)
- [ ] Добавь комментарии в код (TSDoc формат)
- [ ] Опиши в README.md (если важная фича)
- [ ] Создай ADR если принял важное техническое решение

**3. Завершил этап (например, Этап 2)?**
- [ ] Отметь "✅ ЗАВЕРШЕН" в заголовке этапа в roadmap.md
- [ ] Заполни секцию "Результат" в roadmap.md
- [ ] Проверь "Критерий завершения этапа" - все ли выполнено?
- [ ] Обнови CHANGELOG.md (major milestone)

**4. Провел тесты (Этап 7)?**
- [ ] Заполни KPI Tracking таблицу в roadmap.md
- [ ] Запиши результаты в CHANGELOG.md → Performance секция
- [ ] Обнови README.md → Результаты (ссылка на CHANGELOG)
- [ ] Заполни таблицу "Сравнение с Qt" в roadmap.md

**5. Добавил/изменил npm зависимость?**
- [ ] Обнови package.json (автоматически через npm install)
- [ ] Упомяни в docs/setup.md
- [ ] Обнови README.md → Технологии (если важная зависимость)
- [ ] Добавь в CHANGELOG.md → Added/Changed

**6. Изменил TypeScript конфигурацию?**
- [ ] Проверь что сборка работает: `npm run build`
- [ ] Обнови docs/setup.md (если меняет процесс сборки)
- [ ] Создай ADR если это важное изменение конфигурации

**7. Обнаружил проблему/баг?**
- [ ] Добавь в docs/troubleshooting.md:
  * Описание проблемы
  * Как воспроизвести
  * Решение
- [ ] Если исправил - добавь в CHANGELOG.md → Fixed

**8. Сделал оптимизацию производительности?**
- [ ] Измерь "до" и "после"
- [ ] Запиши в CHANGELOG.md → Performance
- [ ] Обнови KPI в roadmap.md (если улучшились метрики)
- [ ] Создай ADR с объяснением оптимизации

---

## ⚠️ Что НЕЛЬЗЯ делать

❌ **НЕ создавай дублирующие файлы:**
- Нет QUICKSTART.md (если есть README)
- Нет PROJECT_SUMMARY.md (если есть README + electron_prototype_spec.md)
- Нет README в подпапках (src/main/README.md)
- Нет дублирующих конфигураций

❌ **НЕ копируй информацию:**
- Вместо копирования делай ссылку
- Один источник правды!
- Пример: количество параметров (300) живет в `electron_prototype_spec.md`

❌ **НЕ делай README длинным:**
- Максимум 120 строк
- Детали → в docs/
- Технические спецификации → в electron_prototype_spec.md

❌ **НЕ забывай обновлять:**
- Изменил код → обнови roadmap.md (отметь задачу)
- Завершил этап → обнови CHANGELOG.md
- Нашел баг → добавь в docs/troubleshooting.md
- Провел тест → заполни KPI Tracking

❌ **НЕ изменяй electron_prototype_spec.md без согласования:**
- Это источник истины для требований проекта
- Изменения требований = изменение цели проекта
- Обсуди с пользователем перед изменением

❌ **НЕ коммить в Git:**
- `node_modules/` (npm зависимости)
- `dist/` (compiled TypeScript)
- `logs/` (performance logs)
- `.env` (если будут secrets)
- Проверь что `.gitignore` актуален

---

## 💡 Главное правило

> **Документация пишется ОДИН РАЗ правильно, обновляется при каждом изменении кода.**

### Процесс:

1. **Создаешь базовую структуру** (по шаблонам выше)
2. **При каждом изменении кода** обновляешь нужные файлы
3. **Следуешь принципу SSOT** (один источник правды)
4. **Проверяешь чек-лист** перед коммитом

### Если не знаешь куда добавить информацию:

- **Быстрый старт?** → README.md
- **Требования проекта?** → electron_prototype_spec.md (НЕ ИЗМЕНЯТЬ!)
- **Детальная установка?** → docs/setup.md
- **Как устроена система?** → docs/architecture.md
- **Как тестировать?** → docs/testing.md
- **Что-то не работает?** → docs/troubleshooting.md
- **Важное техническое решение?** → docs/decisions/NNN-название.md
- **История изменений?** → CHANGELOG.md
- **План разработки?** → roadmap.md
- **Прогресс задач?** → roadmap.md (отметь [X])

---

## 🔍 Как проверить SSOT

### Команды для поиска дублирования:

```bash
# Найти все упоминания "300 параметров"
grep -r "300 параметров" . --exclude-dir=node_modules --exclude-dir=dist

# Найти все упоминания "25 Hz"
grep -r "25 Hz" . --exclude-dir=node_modules --exclude-dir=dist

# Найти все README файлы
find . -name "README.md" | grep -v node_modules

# Найти все .md файлы в корне
ls *.md

# Найти дублирующие npm скрипты
cat package.json | grep -A 10 '"scripts"'
```

### Признаки нарушения SSOT:

- ⚠️ Одна и та же информация в разных файлах (например, "300 параметров" в 5 местах)
- ⚠️ Несколько README.md в подпапках
- ⚠️ Файлы типа QUICKSTART.md, GETTING_STARTED.md дублируют README
- ⚠️ Числа/метрики различаются в разных местах (roadmap vs CHANGELOG)
- ⚠️ Устаревшие чекбоксы в roadmap (задача выполнена, но не отмечена)

---

## 📚 Примеры правильной документации

### ✅ Правильно (SSOT):

**electron_prototype_spec.md (источник истины):**
```markdown
**FR-1: Симуляция данных ЭБУ**
- Генерация пакета данных каждые 40ms (±2ms точность)
- Пакет содержит **300 параметров двигателя** (стресс-тест)
```

**README.md (краткая ссылка):**
```markdown
**Стресс-тест:** 300 параметров в каждом пакете.

См. [полную спецификацию](electron_prototype_spec.md).
```

**roadmap.md (контекст задачи):**
```markdown
- [ ] 2.2 Реализовать DataGenerator класс (20 мин)
  - Конструктор принимает parameterCount (300)
  - Генерация реалистичных значений
```

➡️ Информация о 300 параметрах в 3 местах, но контекст разный:
- `electron_prototype_spec.md`: официальное требование (источник истины)
- `README.md`: краткое упоминание для быстрого понимания
- `roadmap.md`: технический контекст для реализации

### ❌ Неправильно (дублирование):

**README.md:**
```markdown
## Установка
npm install
npm run build
npm start
```

**QUICKSTART.md:**
```markdown
## Быстрый старт
npm install
npm run build
npm start
```

➡️ Полное дублирование! Удали QUICKSTART.md, оставь только README.md.

---

### ✅ Правильно (ссылки вместо копирования):

**README.md:**
```markdown
См. [детальную установку](docs/setup.md) для troubleshooting.
```

**docs/setup.md:**
```markdown
### Troubleshooting

Если возникли проблемы, см. [troubleshooting.md](troubleshooting.md).
```

➡️ Каждый файл ссылается на более детальный, нет дублирования.

---

## 🎓 Итог

**Запомни:**
1. **SSOT** - один источник правды
2. **README** - 80-120 строк, быстрый старт
3. **docs/** - детали
4. **Ссылки, не копирование**
5. **Обновляй после каждой задачи** (roadmap + CHANGELOG)
6. **Следуй шаблонам**
7. **Проверяй чек-лист** перед завершением задачи

**Специфика Electron проекта:**
- **electron_prototype_spec.md** - НЕ ИЗМЕНЯТЬ (источник требований)
- **roadmap.md** - обновлять после КАЖДОЙ задачи
- **CHANGELOG.md** - обновлять после каждого этапа
- **KPI Tracking** - заполнять после тестов (Этап 7)

**Этот файл - твой гайд. Обращайся к нему при любых изменениях документации!**
