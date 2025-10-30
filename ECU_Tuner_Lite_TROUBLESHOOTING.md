# ECU Tuner Lite - Диагностика проблем

## 🔍 Как посмотреть логи

После запуска `ECU_Tuner_Lite.exe` рядом с .exe файлом создаётся файл **`ecu-tuner-lite.log`**

### Структура логов:

```
ECU_Tuner_Lite/
├── ECU_Tuner_Lite.exe
├── ecu-tuner-lite.log ← ЛОГИ ЗДЕСЬ!
└── web/
```

### Формат лога:

Каждая строка - это JSON объект:
```json
{
  "timestamp": "2025-10-28T12:34:56.789Z",
  "level": "INFO",
  "message": "Server started successfully on port 3000",
  "data": {
    "attempt": 1
  }
}
```

### Уровни логирования:

- **INFO** - нормальная работа
- **WARN** - предупреждения (не критично)
- **ERROR** - ошибки (но программа продолжает работу)
- **FATAL** - критические ошибки (программа завершается)
- **DEBUG** - отладочная информация

---

## 🐛 Проблема: Программа не запускается на Windows 7

### Симптомы:
- .exe моргнул и закрылся
- Окно терминала появилось и сразу исчезло
- Браузер не открылся

### Диагностика:

1. **Проверьте лог-файл** `ecu-tuner-lite.log`

2. **Ищите строку с System Information:**
   ```json
   {
     "message": "System Information",
     "data": {
       "platform": "win32",
       "release": "6.1.7601",  // Windows 7 = 6.1
       "nodeVersion": "v16.20.2",
       "isPkg": true
     }
   }
   ```

3. **Возможные причины:**

   **A) Node.js 16 не поддерживается на Windows 7 RTM**
   - Нужен **Windows 7 SP1** минимум
   - Проверьте: `winver` в командной строке
   - Должно быть: `Build 7601: Service Pack 1` или выше

   **B) Отсутствует Visual C++ Redistributable**
   - Node.js 16 требует VC++ 2015-2019 Redistributable
   - Скачать: https://aka.ms/vs/16/release/vc_redist.x64.exe
   - Установить и перезагрузить

   **C) Папка web/ не найдена**
   - Ищите в логе: `"message": "Web folder not found!"`
   - Убедитесь что папка `web/` находится РЯДОМ с .exe
   - НЕ ВНУТРИ какой-то другой папки!

   **D) Критическая ошибка при запуске**
   - Ищите в логе строку с `"level": "FATAL"`
   - Отправьте эту строку разработчику

---

## 🌐 Проблема: Браузер открывается, но Socket.IO не подключается

### Симптомы:
- Браузер открылся на `http://localhost:3000`
- Страница отображается
- Статус: "Connecting..." или "Disconnected"
- Кнопки не работают

### Диагностика:

1. **Откройте DevTools в браузере:**
   - Нажмите `F12`
   - Перейдите на вкладку **Console**
   - Ищите ошибки (красный текст)

2. **Проверьте Network вкладку:**
   - F12 → Network
   - Фильтр: WS (WebSocket)
   - Должен быть запрос к `socket.io/?EIO=4&transport=websocket`
   - Статус должен быть: `101 Switching Protocols`

3. **Типичные ошибки:**

   **A) ERR_CONNECTION_REFUSED**
   ```
   WebSocket connection to 'ws://localhost:3000/socket.io/' failed
   ```

   **Решение:**
   - Проверьте `ecu-tuner-lite.log`
   - Ищите: `"message": "Server started successfully"`
   - Если нет - сервер не запустился, смотрите причину в логе

   **B) CORS Policy Error**
   ```
   Access to XMLHttpRequest blocked by CORS policy
   ```

   **Решение:**
   - Это не должно происходить (CORS настроен на '*')
   - Проверьте версию браузера (обновите Chrome/Firefox)

   **C) Timeout connecting to server**

   **Решение:**
   - Firewall/Антивирус блокирует соединение
   - Добавьте `ECU_Tuner_Lite.exe` в исключения
   - Временно отключите антивирус для теста

4. **Проверьте лог на сервере:**

   Ищите в `ecu-tuner-lite.log`:
   ```json
   {
     "level": "INFO",
     "message": "WebSocket client connected",
     "data": {
       "socketId": "abc123",
       "transport": "websocket"
     }
   }
   ```

   Если этой строки НЕТ - значит клиент не дошёл до сервера.

---

## 🔌 Проблема: Порт 3000 занят

### Симптомы:
- В логе: `"message": "Port 3000 is already in use"`
- Программа пытается порты 3001, 3002, ...

### Решение:

**Автоматическое (уже реализовано):**
- Программа попробует порты 3000-3009
- Откроет браузер на первом свободном порту
- В логе будет: `"message": "Server started successfully on port 3001"`

**Ручное:**
1. Закройте другие программы, использующие порт 3000
2. Перезапустите `ECU_Tuner_Lite.exe`

**Проверка занятого порта (Windows):**
```cmd
netstat -ano | findstr :3000
taskkill /PID <номер_процесса> /F
```

---

## 🪟 Особенности Windows 10

### Проблема: Socket.IO работает, но только на НЕКОТОРЫХ Windows 10

**Возможные причины:**

1. **Windows Defender Firewall**
   - Блокирует localhost соединения
   - Решение: Добавить в исключения
   - Панель управления → Брандмауэр → Разрешить приложение

2. **Group Policy Restrictions (корпоративные ПК)**
   - IT отдел может блокировать WebSocket
   - Решение: Обратиться к системному администратору

3. **Старая версия браузера**
   - IE11 не поддерживает современный WebSocket
   - Решение: Использовать Chrome или Firefox

4. **Proxy/VPN настройки**
   - localhost перенаправляется через прокси
   - Решение: Добавить localhost в обход прокси

---

## 📊 Примеры успешных логов

### Успешный запуск на Windows 10:

```json
{"timestamp":"2025-10-28T12:00:00.000Z","level":"INFO","message":"ECU Tuner Lite Starting..."}
{"timestamp":"2025-10-28T12:00:00.100Z","level":"INFO","message":"System Information","data":{"platform":"win32","release":"10.0.19045","nodeVersion":"v16.20.2","isPkg":true}}
{"timestamp":"2025-10-28T12:00:00.200Z","level":"INFO","message":"Static files path","data":{"webPath":"C:\\Users\\Test\\ECU_Tuner_Lite\\web"}}
{"timestamp":"2025-10-28T12:00:00.300Z","level":"INFO","message":"Static files middleware configured"}
{"timestamp":"2025-10-28T12:00:00.400Z","level":"INFO","message":"Server started successfully on port 3000","data":{"attempt":1}}
{"timestamp":"2025-10-28T12:00:01.000Z","level":"INFO","message":"Browser opened automatically"}
{"timestamp":"2025-10-28T12:00:02.000Z","level":"INFO","message":"WebSocket client connected","data":{"socketId":"abc123","transport":"websocket"}}
```

### Проблемный запуск (отсутствует web/ папка):

```json
{"timestamp":"2025-10-28T12:00:00.000Z","level":"INFO","message":"ECU Tuner Lite Starting..."}
{"timestamp":"2025-10-28T12:00:00.100Z","level":"INFO","message":"System Information","data":{"platform":"win32","release":"10.0.19045","nodeVersion":"v16.20.2","isPkg":true}}
{"timestamp":"2025-10-28T12:00:00.200Z","level":"INFO","message":"Static files path","data":{"webPath":"C:\\Users\\Test\\Desktop\\web"}}
{"timestamp":"2025-10-28T12:00:00.300Z","level":"FATAL","message":"Web folder not found!","data":{"webPath":"C:\\Users\\Test\\Desktop\\web","exePath":"C:\\Users\\Test\\Desktop\\ECU_Tuner_Lite.exe"}}
```

---

## 🆘 Как отправить логи разработчику

1. **Скопируйте файл** `ecu-tuner-lite.log`

2. **Откройте в текстовом редакторе** (Notepad++)

3. **Найдите важные строки:**
   - Первая строка: System Information
   - Строки с уровнем FATAL или ERROR
   - Последние 20 строк

4. **Отправьте разработчику:**
   - Email: [ваш email]
   - GitHub Issue: [ссылка на репозиторий]
   - Укажите версию Windows: `winver`

---

## ✅ Чеклист диагностики

Перед обращением за помощью проверьте:

- [ ] Файл `ecu-tuner-lite.log` существует
- [ ] Папка `web/` находится РЯДОМ с .exe
- [ ] Windows 7 SP1 или выше (`winver`)
- [ ] Visual C++ Redistributable 2015-2019 установлен
- [ ] Антивирус не блокирует .exe
- [ ] Firewall разрешает localhost соединения
- [ ] Браузер поддерживает WebSocket (Chrome/Firefox)
- [ ] DevTools (F12) → Console не показывает критические ошибки

---

## 🔧 Расширенная диагностика

### Запуск с консолью (для продвинутых пользователей):

1. Создайте `.bat` файл рядом с .exe:

```bat
@echo off
echo Starting ECU Tuner Lite with console...
ECU_Tuner_Lite.exe
pause
```

2. Запустите `.bat` файл
3. Консоль останется открытой и покажет все сообщения
4. Нажмите любую клавишу когда закончите

### Проверка Node.js встроенного runtime:

Версия Node.js должна быть **v16.20.2** (последняя LTS для Windows 7)

Проверяется в логе:
```json
{"data":{"nodeVersion":"v16.20.2"}}
```

---

**Если проблема не решена - отправьте лог-файл разработчику!**
