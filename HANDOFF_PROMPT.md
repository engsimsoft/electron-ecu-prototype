# Handoff Prompt для нового чата

## 📋 Копируй этот текст в новый чат:

---

Привет! Мне нужна помощь с Electron проектом, в котором возникла критическая проблема с MessagePort IPC.

## 🎯 Контекст проекта:

Я разрабатываю прототип на Electron для stress-теста real-time данных (300 параметров @ 25Hz). Проект находится по пути:
```
/Users/mactm/Projects/electron_prototype
```

**Текущий прогресс:** 65% (26/40 задач выполнено)
- ✅ Этапы 0-4 завершены (Setup, Basic IPC, MessagePort, UI)
- 🔧 Этап 5 в процессе (Графики с uPlot)
- ⏳ Этапы 6-7 ожидают (Performance Logging, Testing)

## 🚨 Критическая проблема:

**Ошибка:**
```
Uncaught Error: Cannot read properties of undefined (reading 'length')
at port.onmessage (VM114_preload.js:31:11)
```

**Симптомы:**
1. `event.ports` возвращает `undefined` в preload script при обработке MessagePort
2. Ошибка повторяется при каждом полученном пакете данных
3. Графики uPlot не отображаются на странице (секция "Real-Time Charts" пустая)
4. Main process УСПЕШНО отправляет port через `postMessage('port', null, [port2])`
5. Preload получает событие 'port', но `event.ports` undefined

**Код проблемного места** ([src/preload/preload.ts](src/preload/preload.ts)):
```typescript
ipcRenderer.on('port', (event) => {
  const ports = (event as any).ports;
  if (!ports?.length) {  // ← ОШИБКА ЗДЕСЬ: ports undefined
    console.error('No ports in event or ports array is empty');
    return;
  }
  // ...
});
```

## 📂 Структура проекта:

**Ключевые файлы:**
- [roadmap.md](roadmap.md) - детальный roadmap с 7 этапами
- [src/main/main.ts](src/main/main.ts) - Main process (отправка MessagePort)
- [src/preload/preload.ts](src/preload/preload.ts) - Preload (ПРОБЛЕМА ЗДЕСЬ!)
- [src/renderer/renderer.ts](src/renderer/renderer.ts) - Renderer с ChartManager
- [src/renderer/chart-manager.ts](src/renderer/chart-manager.ts) - uPlot charts manager
- [src/renderer/circular-buffer.ts](src/renderer/circular-buffer.ts) - Data buffer

**Что уже реализовано:**
1. ✅ MessageChannelMain создаётся корректно
2. ✅ Main process отправляет port2 через `postMessage`
3. ✅ Preload регистрирует listener на 'port'
4. ✅ ChartManager и CircularBuffer классы готовы
5. ✅ HTML/CSS для 3 графиков готов
6. ✅ uPlot установлен (npm install uplot)

**Что НЕ работает:**
- ❌ `event.ports` undefined в preload
- ❌ Графики не отображаются
- ❌ Данные не передаются в ChartManager

## 🔧 Что уже пробовали:

1. ✅ Изучили официальную документацию Electron MessagePort
2. ✅ Применили official pattern из https://www.electronjs.org/docs/latest/tutorial/message-ports
3. ✅ Очистили все кэши (.vite, node_modules/.vite, out) множество раз
4. ✅ Добавили optional chaining (`ports?.length`)
5. ✅ Использовали type casting `(event as any).ports`
6. ✅ Увеличили timing delay до 100ms
7. ✅ Убивали все процессы Electron/Node
8. ✅ Проверили, что Main process логирует успешную отправку port

**Ничего не помогло!** Ошибка продолжается.

## 💡 Подозрения:

1. **Vite кэширование:** Возможно, Vite кэширует старый скомпилированный код где-то глубоко
2. **Timing issue:** MessagePort отправляется до того, как preload готов
3. **TypeScript types:** Возможно, проблема в типах Electron.IpcRendererEvent
4. **postMessage API:** Может быть, нужен другой подход к передаче MessagePort

## 🎯 Что нужно сделать:

1. **ПРИОРИТЕТ 1:** Решить проблему `event.ports` undefined
   - Найти способ корректно получить MessagePort в preload
   - Исправить все связанные ошибки

2. **ПРИОРИТЕТ 2:** Убедиться, что графики отображаются
   - Проверить, что ChartManager инициализируется
   - Проверить, что данные передаются в графики

3. **ПРИОРИТЕТ 3:** Завершить Этап 5
   - Все 3 графика работают плавно @ 60 FPS
   - Нет ошибок в консоли

## 📚 Полезные ссылки:

- **Roadmap:** [roadmap.md](roadmap.md) - детальный план всех 7 этапов
- **Electron MessagePort:** https://www.electronjs.org/docs/latest/tutorial/message-ports
- **Electron IpcRendererEvent:** https://www.electronjs.org/docs/latest/api/structures/ipc-renderer-event
- **uPlot Docs:** https://github.com/leeoniya/uPlot

## ⚡ Важные заметки:

1. **Следуй roadmap правилу:** При трудностях - СТОП, изучи документацию, используй Task tool
2. **Не используй "метод тыка"** - каждое изменение должно быть обоснованным
3. **Проект на macOS** (Darwin 24.6.0)
4. **Node.js и npm уже установлены**
5. **Все зависимости установлены** (включая uplot)

## 🚀 С чего начать:

1. Прочитай [roadmap.md](roadmap.md) чтобы понять контекст
2. Изучи проблему в [src/preload/preload.ts](src/preload/preload.ts)
3. Используй Task tool для исследования решения
4. Примени исправление
5. Протестируй (`npm start`)

---

**Вопрос:** Можешь помочь решить проблему с `event.ports` undefined в preload script? Это блокирует весь Этап 5 (графики uPlot).
