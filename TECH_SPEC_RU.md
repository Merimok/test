Проект: Браузерное расширение «FactCheck AI — Free Online»

Версия: 0.1
Дата: 5 июня 2025

1. Цель проекта

Разработать кросс‑браузерное расширение, которое выполняет факт‑чекинг в он‑лайн‑режиме, не требуя от пользователя собственных платных API‑ключей. Проверка делается за счёт:

- Публичных открытых источников (Wikipedia/Wikidata REST, DuckDuckGo Instant Answer JSON, MediaWiki API сайтов‑партнёров).
- Поисковой выдачи (Google, Bing) путём клиентского HTML‑парсинга.
- Бесплатного доступа к ChatGPT через веб‑интерфейс (DOM‑автоматизация при условии, что пользователь уже вошёл в свой аккаунт).

2. Ключевые принципы

- **Zero‑Server** — расширение не имеет собственного backend‑сервера; все запросы идут напрямую из браузера пользователя.
- **Zero‑Cost** — используются только бесплатные/неограниченные публичные API или парсинг HTML‑страниц.
- **Privacy‑by‑design** — текст страницы и результаты не покидают браузер, кроме случаев, когда отправляются в ChatGPT в целях проверки (пользователь предупреждён и соглашается при первом запуске).

3. Технические ограничения

| Параметр | Значение |
|----------|----------|
| **Браузеры** | Chrome ≥120 (Manifest V3), Firefox ≥122, Edge ≥120, Opera ≥105 |
| **Минимальный объём ОЗУ** | 4 ГБ |
| **Максимальный размер расширения** | < 20 МБ |
| **Необходимые разрешения** | activeTab, scripting, storage, cookies, webRequest, хост‑доступ к https://*.wikipedia.org/*, https://api.duckduckgo.com/*, https://chat.openai.com/*, https://www.google.com/*, https://www.bing.com/* |

4. Архитектура

```
┌────────────┐ text ┌───────────────┐ claims ┌─────────────┐ evidence ┌──────────────┐
│ content.js │────►│ worker-Detect │───────►│ SearchLayer │─────────►│ ChatGPT DOM  │
└────────────┘     │ (WebWorker)   │        │ (fetch+DOM) │          │  Evaluator   │
   ▲ UI update     └──────┬─────────┘        └─────────────┘          └────┬─────────┘
   │                       │ in-memory evidence JSON                          │ verdict
┌───────┐ React side pane ◄┘                                         ┌──────────────┐
│  UI   │                                                          │ storage/cache │
└───────┘                                                          └──────────────┘
```

- **worker-Detect** — компактная onnx‑модель ClaimDetector (≈ 50 МБ, загружается лениво).
- **SearchLayer** — модуль, который:
  - отправляет запрос к DuckDuckGo Instant Answer: `https://api.duckduckgo.com/?q=<query>&format=json` (без ключа).
  - формирует HTML‑запрос к Google `https://www.google.com/search?q=…&hl=<lang>&num=10` и парсит сниппеты (требуется `&sourceid=chrome` — cookie включено).
  - делает запрос к REST‑summary Wikipedia: `https://<lang>.wikipedia.org/api/rest_v1/page/summary/<title>`.
  - собирает первые ≤ 8 абзацев текста (±800 слов) и агрегирует в JSON‑«доказательство».
- **ChatGPT DOM Evaluator** — background‑script, который:
  - проверяет, есть ли в домене chat.openai.com активная сессия (cookie `__Secure-next-auth.session-token`).
  - если нет — всплывающее окно «Войдите в ChatGPT, потом повторите проверку».
  - если да — открывает (или переиспользует) скрытую вкладку `chrome.tab.hide` (Chrome), вставляет итоговый prompt («Answer in JSON: { verdict, explanation_ru } …») и извлекает ответ из DOM.

5. Алгоритм факт‑чека

1. Извлечение текста — контент‑скрипт собирает page text ≤ 10 000 символов.
2. Сегментация на предложения (simple Regex).
3. ClaimDetector (onnx): определяет atomic_claims и confidence.
4. Для каждого claim:
   - поиск через SearchLayer (DuckDuckGo → Google → Wikipedia);
   - сбор evidence (текстовые фрагменты + url + title);
   - формирование prompt:
```
SYSTEM: Ты факт‑чекер, отвечай коротко.
USER: Утверждение: «…».
Доказательства:
1) «фрагмент…» (url)
2) …
Дай ответ JSON {verdict: support|refute|notenough, explanation_ru: "…"}.
```
   - отправка в ChatGPT DOM Evaluator;
   - парсинг JSON‑ответа.
5. Отображение — подсветка строки + боковая панель.
6. Кэш — IndexedDB по ключу MD5(claim) → verdict на 7 дней.

6. UI‑требования

- Цветовая схема: зелёный — подтверждено, красный — опровергнуто, жёлтый — недостаточно.
- Popup: кнопка «Проверить страницу» / «Стоп» (progress bar).
- SidePane (React): таблица Claim | Verdict | Пояснение | Источники; фильтр по статусу.
- Локализация: RU, EN (по умолчанию RU).

7. Безопасность и соблюдение политик магазинов

- Content‑Security‑Policy — разрешить `https://chat.openai.com` и `https://*.wikipedia.org` во `connect-src`.
- WebRequest используется только для `onBeforeSendHeaders` → добавление `hl=<lang>` в Google.
- Cookie access ограничено `https://chat.openai.com/*` (Chrome permission `cookies`).
- Расширение не хранит и не передаёт персональные данные.

8. Тестирование

| Тип | Инструмент | Цель |
|-----|------------|------|
| Unit | vitest | ClaimDetector wrapper, SearchLayer parsers |
| E2E | Playwright | Полный сценарий «открыть статью Wiki → проверить → ожидаемый verdict» |
| UX/perf | Lighthouse CI | FCP < 1.2 s, просадка FPS < 5 % |

9. План работ

| Неделя | Задача |
|-------|---------|
| 1 | Каркас MV3, UI Popup |
| 2 | ClaimDetector onnx + WebWorker |
| 3 | SearchLayer (DuckDuckGo + Wikipedia) |
| 4 | Google HTML parser, кэш |
| 5 | ChatGPT DOM Evaluator POC |
| 6 | Сборка боковой панели, подсветка |
| 7 | Отладка сессии ChatGPT, повторная авторизация |
| 8 | Тесты, подготовка к публикации |

10. Критерии приёмки

- Проверка 5 claims на странице Wikipedia проходит ≤ 15 с (при наличии сессии ChatGPT).
- При отключённом ChatGPT плагин корректно сообщает «войдите».
- Расширение публикуется в Chrome Web Store без ошибок Review.

Этот вариант не требует платных ключей: поиск — DuckDuckGo/Google/Wiki без API, LLM — личный аккаунт ChatGPT пользователя; всё исполняется внутри браузера.
