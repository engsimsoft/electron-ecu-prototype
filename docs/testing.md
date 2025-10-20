# Тестирование и оценка производительности

Руководство по тестированию Electron ECU Data Prototype и интерпретации результатов.

> **Статус:** Документ подготовлен для Stage 7. Тесты будут выполнены после завершения Stages 2-6.

## Обзор тестовых сценариев

Согласно [техническому заданию](../electron_prototype_spec.md), планируется **4 тестовых сценария**:

1. **Тест 1:** Короткий прогон (1 минута) - базовая проверка
2. **Тест 2:** Средний прогон (5 минут) - **главный acceptance test**
3. **Тест 3:** Долгий прогон (15 минут) - проверка memory leaks
4. **Тест 4:** Start/Stop циклы - проверка очистки ресурсов

## Тест 1: Короткий прогон (1 минута)

### Цель
Базовая проверка работоспособности системы.

### Как запустить
```bash
npm start

# В открывшемся окне:
# 1. Нажать "Start Simulation"
# 2. Дождаться 1 минуты
# 3. Нажать "Stop Simulation"
```

### Ожидаемые результаты
- **Packets Received:** ~1500 пакетов (25 Hz × 60 сек)
- **FPS:** 55-60 стабильно
- **Dropped Packets:** 0
- **UI отзывчивый:** графики плавные, нет лагов

### Критерии успеха
✅ Все пакеты получены (Dropped Packets = 0)
✅ FPS ≥55
✅ Нет ошибок в DevTools Console

## Тест 2: Средний прогон (5 минут) ⭐ ГЛАВНЫЙ ТЕСТ

### Цель
Основной acceptance test для всех 7 KPI.

### Как запустить
```bash
# Очистить логи перед тестом
rm -rf logs/*

# Запустить приложение
npm start

# Открыть Activity Monitor (macOS)
open -a "Activity Monitor"

# В приложении:
# 1. Нажать "Start Simulation"
# 2. Записать начальное значение Memory (RSS)
# 3. Дождаться ровно 5 минут
# 4. Записать конечное значение Memory (RSS)
# 5. Нажать "Stop Simulation"
```

### Метрики для отслеживания

#### 1. FPS (KPI-2)
**Target:** ≥55 (целевой 60)
**Где смотреть:** UI → FPS счетчик
**Запись:** Минимальное значение за 5 минут

#### 2. CPU Usage (KPI-5)
**Target:** <40% (суммарно все процессы Electron)
**Где смотреть:** Activity Monitor → фильтр "Electron"
**Запись:** Среднее значение

**Процессы:**
- Electron (Main Process)
- Electron Helper (Renderer)
- Electron Helper (GPU)

#### 3. Memory (KPI-6)
**Target:** Рост <50MB за 5 минут
**Где смотреть:** Activity Monitor → Memory (RSS)
**Расчет:** `Final - Initial`

#### 4. Packets (KPI-3)
**Target:** 0 потерь (или <1%)
**Где смотреть:** UI → Dropped Packets
**Expected:** 7500 пакетов (25 Hz × 300 сек)

#### 5. Latency (KPI-4)
**Target:** <50ms (среднее <10ms желательно)
**Где смотреть:** Логи → `logs/performance-renderer.log`
**Расчет:** Анализ через `scripts/analyze-logs.js`

### Сбор логов

После теста проверить логи:
```bash
ls -lh logs/
# Должны быть:
# performance-main.log
# performance-renderer.log

# Анализ логов (Stage 6)
node scripts/analyze-logs.js logs/performance-renderer.log
```

### Критерии успеха

Все 7 KPI должны быть выполнены:

✅ **KPI-1:** Работает стабильно 5 минут без сбоев
✅ **KPI-2:** FPS ≥55
✅ **KPI-3:** Dropped Packets = 0 (или <1%)
✅ **KPI-4:** Latency <50ms (avg <10ms)
✅ **KPI-5:** CPU <40%
✅ **KPI-6:** Memory growth <50MB
✅ **KPI-7:** 3 графика синхронны и плавны

## Тест 3: Долгий прогон (15 минут)

### Цель
Проверка на memory leaks и деградацию производительности.

### Как запустить
То же что Тест 2, но 15 минут.

### Дополнительные проверки

**Memory Profile:**
1. Запустить тест
2. Через 5 минут: DevTools → Memory → Heap Snapshot (1)
3. Через 10 минут: Heap Snapshot (2)
4. Через 15 минут: Heap Snapshot (3)
5. Сравнить размеры snapshot'ов

**Признаки memory leak:**
- Линейный рост памяти без стабилизации
- Detached DOM nodes
- Retained objects в Heap Snapshot

**Решения** (если обнаружен leak):
- Проверить CircularBuffers: правильный ли capacity
- Проверить event listeners: удаляются ли при stop
- Проверить MessagePort: закрывается ли при stop

## Тест 4: Start/Stop циклы

### Цель
Проверка корректной очистки ресурсов.

### Как запустить
```bash
npm start

# 10 циклов:
# 1. Start Simulation
# 2. Работа 30 секунд
# 3. Stop Simulation
# 4. Пауза 5 секунд
# 5. Повторить с шага 1
```

### Что проверять

**Memory:**
- Записать значение после каждого цикла
- Memory НЕ должна расти после каждого цикла

**Счетчики:**
- Должны сбрасываться при Start
- Uptime начинается с 00:00

**Графики:**
- Должны очищаться/обновляться корректно

### Критерии успеха
✅ Memory стабильна (±10MB допустимо)
✅ Нет ошибок в Console
✅ Счетчики корректны

## Интерпретация результатов

### Результаты хорошие
**FPS >55, CPU <35%, Memory stable**

→ ✅ **Electron подходит для задачи**
→ Можно рассматривать миграцию с Qt/QML
→ Переходить к production версии

### Результаты средние
**FPS 45-55, CPU 35-45%**

→ ⚠️ **Требуется оптимизация**
→ Попробовать: decimation, меньше buffer size
→ Повторное тестирование после оптимизаций

### Результаты плохие
**FPS <45, CPU >45%**

→ ❌ **Electron не справляется**
→ Остаться на Qt/QML
→ Рассмотреть гибридный подход

## Сравнение с Qt

### Таблица сравнения

Заполнить после Теста 2:

| Metric | Electron | Qt | Delta | Winner |
|--------|----------|----|----|--------|
| Avg FPS | ? | ? | ? | ? |
| P95 FPS | ? | ? | ? | ? |
| CPU Total (%) | ? | ? | ? | ? |
| Memory RSS (MB) | ? | ? | ? | ? |
| IPC Latency Avg (ms) | ? | ? | ? | ? |
| Dropped Packets (%) | ? | ? | ? | ? |

**Выводы:**
_(заполнить после анализа)_

## Автоматизация тестов

### Скрипт для Теста 2
```bash
#!/bin/bash
# run-test-2.sh

echo "🧪 Running Test 2: 5 minutes stress test"
echo "========================================"

# Clean logs
rm -rf logs/*

# Start app (background)
npm start &
APP_PID=$!

# Wait for app to start
sleep 10

# Instructions
echo ""
echo "📋 Manual steps:"
echo "1. Click 'Start Simulation' NOW"
echo "2. Wait 5 minutes"
echo "3. Click 'Stop Simulation'"
echo "4. Press Ctrl+C when done"
echo ""

# Wait for user to finish
wait $APP_PID

# Analyze logs
echo ""
echo "📊 Analyzing logs..."
node scripts/analyze-logs.js logs/performance-renderer.log

echo "✅ Test 2 complete. Check results above."
```

## Checklist перед тестированием

- [ ] Все Stages 2-6 завершены
- [ ] `npm start` запускается без ошибок
- [ ] DevTools открываются (Cmd+Option+I)
- [ ] Логи пишутся в `logs/`
- [ ] Activity Monitor открыт (для мониторинга CPU/Memory)
- [ ] Закрыты другие приложения (чистые условия теста)

## Troubleshooting тестов

### Проблема: FPS падает

**Причины:**
- Слишком большой buffer size → уменьшить capacity
- Слишком много точек на графиках → decimation
- CPU bottleneck → профилирование

**Решение:**
См. [troubleshooting.md](troubleshooting.md#fps-drops)

### Проблема: Memory растет

**Причины:**
- CircularBuffer не ограничен → проверить capacity
- Event listeners не удаляются → проверить cleanup
- MessagePort не закрывается → проверить stop logic

**Решение:**
Chrome DevTools → Memory → Heap Snapshot → искать detached nodes

## Следующие шаги

После успешных тестов:
1. Заполнить KPI Tracking в [roadmap.md](../roadmap.md)
2. Обновить [CHANGELOG.md](../CHANGELOG.md)
3. Заполнить таблицу сравнения с Qt
4. Принять решение о миграции

## Полезные ссылки

- [Roadmap (Stage 7)](../roadmap.md#этап-7-тестирование-и-оптимизация-45-60-минут)
- [Техническое задание (KPI)](../electron_prototype_spec.md)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
