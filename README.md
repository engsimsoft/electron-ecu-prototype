# Electron ECU Data Prototype

Прототип на Electron для проверки производительности при обработке real-time данных от ЭБУ (электронный блок управления) двигателя.

**Стресс-тест:** 300 параметров @ 25 Hz (пакет каждые 40ms)

**Статус:** ✅ Этапы 1-6 завершены, все 7 KPI выполнены на macOS

---

## 🚀 Быстрый старт

### Требования
- Node.js 20+
- npm 11+
- macOS 10.15+ (текущая платформа тестирования)

### Установка и запуск
```bash
npm install
npm start
```

### Первый тест (5 минут)
1. Нажать "Start Simulation"
2. Дождаться 5 минут
3. Нажать "Stop Simulation"
4. Проверить метрики и логи в `logs/`

---

## 📚 Документация

**Для быстрого старта:**
- **[⚡ QUICKSTART.md](QUICKSTART.md)** - краткая инструкция по запуску и использованию

**Для новых участников проекта:**
- **[🤖 AI_HANDOFF.md](AI_HANDOFF.md)** - точка входа для AI агентов

**Источники истины (SSOT):**
- **[electron_prototype_spec.md](electron_prototype_spec.md)** - техническое задание (НЕ ИЗМЕНЯТЬ без согласования)
- **[roadmap.md](roadmap.md)** - план разработки, технологии, KPI tracking
- **[CHANGELOG.md](CHANGELOG.md)** - история изменений и версии
- **[DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md)** - правила ведения документации

**Результаты тестирования:**
- **[TEST_RESULTS.md](TEST_RESULTS.md)** - детальный отчёт 5-минутного теста (macOS)
- **[QUICK_RESULTS.txt](QUICK_RESULTS.txt)** - краткая сводка результатов

---

## 🎯 Текущий статус

**Версия:** v0.5.0

**Прогресс:** Этапы 1-6 завершены (100%), acceptance test пройден ✅

**Следующие шаги:**
- Windows тестирование
- Интеграция реального COM-порта
- Стресс-тесты

См. [roadmap.md](roadmap.md) для полного плана.

---

## ⚡ Основные команды

```bash
npm start              # Development mode (hot-reload)
npm run package        # Production build
npm run make           # Создать дистрибутивы

# Анализ логов
node scripts/analyze-logs.js logs/performance-main.log
node scripts/analyze-logs.js logs/performance-renderer.log
```

---

## 📂 Структура проекта

```
electron_prototype/
├── src/
│   ├── main/          # Main Process (Node.js)
│   ├── preload/       # Preload Script (contextBridge)
│   └── renderer/      # Renderer Process (UI)
├── logs/              # Performance logs
├── scripts/           # Утилиты (analyze-logs.js)
└── docs/              # Документация
```

Детальная архитектура описана в [roadmap.md](roadmap.md) → Этап 1.

---

## 📖 Как работать с документацией

Этот проект следует принципу **SSOT (Single Source of Truth)**.

- ✅ Вся информация хранится в **одном месте**
- ✅ Другие документы **ссылаются** на источники истины
- ❌ **НЕ дублируй** информацию между файлами

Подробности в [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md).

---

## 🔍 Где искать информацию?

| Вопрос | Документ |
|--------|----------|
| Требования и KPI? | [electron_prototype_spec.md](electron_prototype_spec.md) |
| План разработки и технологии? | [roadmap.md](roadmap.md) |
| Результаты тестов? | [TEST_RESULTS.md](TEST_RESULTS.md) |
| История изменений? | [CHANGELOG.md](CHANGELOG.md) |
| Правила работы? | [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md) |
| Контекст для AI? | [AI_HANDOFF.md](AI_HANDOFF.md) |

---

## 📝 Лицензия

MIT
