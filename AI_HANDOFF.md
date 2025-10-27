# AI Agent Handoff Document

**Для:** AI агентов (Claude / другие ассистенты)
**Версия:** 2.0
**Дата обновления:** 27 октября 2025

---

## 🎯 Назначение документа

Этот файл — **точка входа для AI агентов**. Здесь весь контекст для быстрого включения в работу над проектом.

**Что здесь:**
- Контекст о людях и процессах
- Инструкции КАК работать с проектом
- Навигация по документации
- Best practices для AI агентов

**Чего здесь НЕТ:**
- Технических деталей Full версии → см. [roadmap.md](roadmap.md)
- Плана разработки Lite версии → см. [roadmap_lite.md](roadmap_lite.md)
- Требований и KPI → см. [electron_prototype_spec.md](electron_prototype_spec.md)
- Результатов тестов → см. [TEST_RESULTS.md](TEST_RESULTS.md)

---

## 📋 Краткий контекст проекта

**Название:** Electron ECU Data Prototype

**Цель:** Проверить пригодность Electron как замены Qt/QML для real-time приложений (данные от ЭБУ двигателя).

**Статус:**
- ✅ **Full версия (Electron):** v0.5.0 — Этапы 1-6 завершены, все KPI выполнены на macOS
- 🚧 **Lite версия (Node.js + Browser):** v0.1.0-lite — В разработке (0/21 задач)

**Следующие шаги:**
- **Full версия:** Windows тестирование + интеграция COM-порта (выполняет Сергей)
- **Lite версия:** Этапы 1-4 - proof of concept для старых Windows систем

**Детали проекта:**
- Full версия: [electron_prototype_spec.md](electron_prototype_spec.md) и [roadmap.md](roadmap.md)
- Lite версия: [roadmap_lite.md](roadmap_lite.md) и [ТЗ_для_Claude_Code_-_Lite_версия.md](ТЗ_для_Claude_Code_-_Lite_версия.md)

---

## 👥 Люди в проекте

### Владелец проекта (пользователь):
- **Роль:** Product Owner
- **Платформа:** macOS (Darwin 24.6.0)
- **Выполнил:** Этапы 1-6, тестирование на macOS

### Сергей (коллега):
- **Роль:** Windows разработчик
- **Опыт:** профессиональный программист, без опыта с AI
- **Задачи:**
  1. Протестировать на Windows
  2. Интегрировать библиотеку serialport
  3. Заменить симуляцию на реальный COM-порт
  4. Провести стресс-тесты
  5. Создать WINDOWS_TEST_RESULTS.md
- **Git workflow:** работает в отдельной ветке `windows-development`

### AI агенты (Claude Code):
- **Роль:** помощь в разработке и решении задач
- **Язык документации:** русский
- **Язык кода:** английский

---

## 📁 Структура документации (SSOT)

Проект следует принципу **Single Source of Truth**.

### Источники истины (SSOT):

1. **[electron_prototype_spec.md](electron_prototype_spec.md)** (26K)
   - Техническое задание
   - Требования и KPI
   - **НЕ ИЗМЕНЯТЬ без согласования с владельцем!**

2. **[roadmap.md](roadmap.md)** (62K)
   - План разработки (7 этапов, 40 задач)
   - Технологии и архитектура
   - KPI Tracking таблица
   - **Обновлять после каждой задачи!**

3. **[CHANGELOG.md](CHANGELOG.md)** (21K)
   - История изменений (Semantic Versioning)
   - Результаты тестов по версиям
   - **Обновлять после каждого этапа!**

### Навигационные документы:

- **[README.md](README.md)** — точка входа для пользователей
- **[AI_HANDOFF.md](AI_HANDOFF.md)** (этот файл) — точка входа для AI
- **[DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md)** — правила ведения документации

### Результаты и отчёты:

- **[TEST_RESULTS.md](TEST_RESULTS.md)** — детальный отчёт теста (macOS)
- **[QUICK_RESULTS.txt](QUICK_RESULTS.txt)** — краткая сводка результатов

---

## 🚨 КРИТИЧЕСКИ ВАЖНО

### Всегда следуй DOCUMENTATION_GUIDE.md:

1. ✅ **SSOT** — один источник правды, не дублируй информацию
2. ✅ **Обновляй roadmap.md** после каждой задачи
3. ✅ **Обновляй CHANGELOG.md** после каждого этапа
4. ✅ **Используй ссылки** вместо копирования информации
5. ❌ **НЕ изменяй** electron_prototype_spec.md без согласования

### При возникновении трудностей:

1. **СТОП** — не решай "методом тыка"
2. **Изучи официальную документацию** (ссылки в roadmap.md)
3. **Используй Task tool** для research
4. **Примени решение** на основе best practices

Детали: [roadmap.md](roadmap.md) → секция "⚠️ ВАЖНО: Правило работы при возникновении трудностей"

---

## 🌿 Git Workflow

### Структура веток:

```
main (macOS, стабильная, v0.5.0)
  │
  └─ windows-development (Сергей создаст для Windows работы)
```

### Зачем отдельная ветка:

- Не портит стабильную macOS версию
- Безопасные эксперименты
- Code review через Pull Request
- Легко сравнить изменения

### Workflow для Сергея:

```bash
git checkout -b windows-development
# ... внести изменения ...
git add . && git commit -m "..."
git push origin windows-development
# Создать PR для code review
```

---

## 📚 Где искать информацию

| Вопрос | Файл |
|--------|------|
| Требования и KPI? | [electron_prototype_spec.md](electron_prototype_spec.md) |
| План Full версии? | [roadmap.md](roadmap.md) |
| План Lite версии? | [roadmap_lite.md](roadmap_lite.md) |
| ТЗ Lite версии? | [ТЗ_для_Claude_Code_-_Lite_версия.md](ТЗ_для_Claude_Code_-_Lite_версия.md) |
| История изменений? | [CHANGELOG.md](CHANGELOG.md) |
| Результаты тестов? | [TEST_RESULTS.md](TEST_RESULTS.md) |
| Правила документации? | [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md) |
| Быстрый старт? | [README.md](README.md) |
| Git workflow? | Этот файл, секция "Git Workflow" |
| Архитектура Full версии? | [roadmap.md](roadmap.md) → Этапы 1-3 |
| Архитектура Lite версии? | [roadmap_lite.md](roadmap_lite.md) → Технические детали |
| Технологии? | [roadmap.md](roadmap.md) и [roadmap_lite.md](roadmap_lite.md) |

---

## 🔍 Частые задачи для AI

### Задача: "Добавь новую функцию"

```
1. Проверь roadmap.md - есть ли эта задача?
2. Если нет - спроси пользователя, нужно ли добавить в roadmap
3. Реализуй функцию
4. Обнови roadmap.md (отметь задачу [X])
5. Обнови CHANGELOG.md (секция Added/Changed)
6. Закоммить с понятным сообщением
```

### Задача: "Исправь баг"

```
1. Воспроизведи проблему
2. Найди корневую причину (не угадывай!)
3. Исправь
4. Протестируй
5. Обнови CHANGELOG.md (секция Fixed)
6. Если это частая проблема - задокументируй в roadmap.md
```

### Задача: "Провести тест"

```
1. Посмотри roadmap.md → Этап 7 - тестовые сценарии
2. Очисти logs/ перед тестом (rm logs/*)
3. Запусти тест, собери логи
4. Проанализируй: node scripts/analyze-logs.js logs/*.log
5. Создай отчёт (по аналогии с TEST_RESULTS.md)
6. Обнови CHANGELOG.md и roadmap.md KPI таблицу
```

### Задача: "Помоги Сергею с Windows"

```
1. Прочитай roadmap.md → Этап 7 → Windows testing
2. Проверь WINDOWS_TEST_RESULTS.md (если есть)
3. Изучи официальную документацию (Electron, serialport)
4. Предложи решение на основе best practices
5. Задокументируй решение
```

---

## 💡 Best Practices для AI агентов

### При работе с кодом:

- ✅ Всегда используй **TypeScript**, не JavaScript
- ✅ Следуй существующему стилю кода
- ✅ Добавляй **TSDoc комментарии** к функциям
- ✅ Используй **async/await** вместо callbacks
- ✅ Проверяй типы перед компиляцией

### При работе с документацией:

- ✅ Следуй **DOCUMENTATION_GUIDE.md** строго
- ✅ **SSOT** — один источник правды
- ✅ Используй **ссылки** вместо копирования
- ✅ Обновляй **roadmap.md** и **CHANGELOG.md** ВСЕГДА
- ✅ Русский в документах, английский в коде

### При тестировании:

- ✅ Всегда очищай `logs/` перед тестом
- ✅ Запускай ровно N минут (используй таймер)
- ✅ Анализируй логи скриптом `analyze-logs.js`
- ✅ Сравнивай с эталоном (TEST_RESULTS.md)
- ✅ Документируй результаты

### При troubleshooting:

- ✅ Изучи **официальную документацию ПЕРВЫМ ДЕЛОМ**
- ✅ Используй **Task tool** для research
- ✅ Не копируй решения вслепую
- ✅ Проверь что решение работает
- ✅ Задокументируй в troubleshooting секции

---

## 🔗 Полезные ссылки

### Официальная документация:

- Electron: https://www.electronjs.org/docs/latest/
- TypeScript: https://www.typescriptlang.org/docs/
- uPlot: https://github.com/leeoniya/uPlot
- Pino: https://getpino.io/
- serialport: https://serialport.io/docs/

### Внутренние документы:

- [electron_prototype_spec.md](electron_prototype_spec.md) — техническое задание
- [roadmap.md](roadmap.md) — план и архитектура
- [CHANGELOG.md](CHANGELOG.md) — история
- [TEST_RESULTS.md](TEST_RESULTS.md) — результаты
- [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md) — правила
- [README.md](README.md) — точка входа

---

## ✅ Чек-лист перед началом работы

- [ ] Прочитал AI_HANDOFF.md (этот файл) ✅
- [ ] Прочитал DOCUMENTATION_GUIDE.md
- [ ] Изучил roadmap.md (понял текущий статус)
- [ ] Изучил CHANGELOG.md (понял историю)
- [ ] Понял структуру src/ (main, renderer, preload)
- [ ] Знаю где искать информацию (таблица выше)
- [ ] Понял Git workflow (main vs windows-development)
- [ ] Готов следовать правилам SSOT

---

## 🛠️ Быстрые команды

```bash
# Development
npm start              # Запуск в dev режиме
npm run package        # Production build

# Анализ логов
node scripts/analyze-logs.js logs/performance-main.log
node scripts/analyze-logs.js logs/performance-renderer.log

# Git
git status
git log --oneline -10
git diff main..windows-development
```

---

## 📞 Обратная связь

Если в этом документе чего-то не хватает:

1. Спроси пользователя о контексте
2. Обнови этот документ
3. Следуй принципу SSOT (не дублируй из других файлов)

---

**Успехов в работе! 🚀**
