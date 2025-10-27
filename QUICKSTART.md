# Quick Start

## 1. Установка зависимостей (первый раз)

```bash
npm install
```

**Время:** ~2-3 минуты

---

## 2. Запуск приложения

```bash
npm start
```

---

## 3. Работа с приложением

В открывшемся окне:
- Нажать **"Start Simulation"** - запуск симуляции
- Нажать **"Stop Simulation"** - остановка
- Нажать **"Show Results"** - просмотр результатов теста (CPU, FPS, Latency)

---

## 4. Просмотр результатов

После остановки симуляции нажмите **"Show Results"** - откроется окно с результатами:
- CPU Average, Min, Max
- Memory Average
- FPS Average, Min, Max
- Latency Average

Результаты отображаются автоматически без использования терминала.

---

## 5. Закрытие приложения

**macOS:**
```bash
Cmd + Q
```

**Windows/Linux:**
```bash
Alt + F4
```

Или просто закрыть окно крестиком.

---

## 6. Проверка логов через терминал (опционально)

```bash
# Анализ производительности
node scripts/analyze-logs.js logs/performance-main.log
node scripts/analyze-logs.js logs/performance-renderer.log
```

---

Для детальной информации см. [README.md](README.md)
