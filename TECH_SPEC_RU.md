Проект: Браузерное расширение «FactCheck AI"

Версия: 0.1
Дата: 5 июня 2025

1. Цель проекта

Создать кросс‑браузерное расширение, которое по запросу пользователя (или автоматически) анализирует текст текущей веб‑страницы, выделяет фактические утверждения, проверяет их на достоверность с помощью открытого веб‑поиска и моделей OpenAI и отображает результат всегда на русском языке.

2. Область применения

Поддерживаемые браузеры: Chrome (Manifest V3), Firefox (WebExtension), Edge, Opera, Safari ≥ 17 (через Safari Web Extension).

Поддерживаемые ОС: Windows 10+, macOS 12+, Linux, ChromeOS.

3. Термины и сокращения

Термин

Описание

Claim

Короткое атомарное утверждение, подлежащее факт‑чеку.

RAG

Retrieval‑Augmented Generation – схема «поиск → LLM‑проверка».

LLM

Large Language Model (OpenAI GPT‑4o).

Evidence

Доказательный фрагмент текста из открытого источника.

4. Функциональные требования

Извлечение текста

Расширение извлекает textContent из DOM за исключением script, style, noscript, скрытых элементов.

Определение языка

Используется fastText lid.176.bin или JS‑порт @mapbox/lingua.

В результате каждому предложению присваивается ISO‑639‑1 код языка.

Выделение утверждений (ClaimDetector)

Вызывается gpt-4o с function‑calling extract_atomic_claims (макс. 128 предложений).

Порог важности — аргумент confidence ≥ 0.5.

Нормализация языка

Если исходный язык ≠ ru, claim сначала переводится на русский через OpenAI (system: "Переведи текст на русский без потери смысла").

В UI хранится пара «оригинал / перевод».

Поиск доказательств

Приоритет: Brave Search API → Wikipedia/Wikidata CirrusSearch → дополнительный запрос на английском, если результатов < 3.

Результаты индексируются в OpenSearch 3.x Vector Engine (cosine-embeddings text-embedding-3-large).

Оценка доказательств

Для каждого claim берутся top‑k (≤ 5) пассов с наибольшим сходством.

gpt-4o классифицирует: support, refute, not_enough.

Генерируется краткое объяснение (1‑3 предложения, рус.) со ссылками URL + title.

Отображение результата

Подсветка claim в тексте (зелёный / красный / жёлтый подцвет).

Боковая панель React: таблица «утверждение → verdict → объяснение → источники».

Всплывающая подсказка при наведении.

Пользовательские сценарии

Клик по кнопке «Проверить страницу».

Выделение текста → контекстное меню «Проверить выделенное».

Автопроверка при загрузке (можно выключить).

Кэш и повторы

MD5(claim + lang) → verdict JSON хранится в IndexedDB 14 дней.

Фоновый скрипт обновляет записи, если им > 30 дней.

Логи и телеметрия

Анонимная статистика (при согласии): кол‑во проверок, доля refute, сред. время.

Отправляется на собственный endpoint https://stats.example.com.

5. Нефункциональные требования

Категория

Требование

Производительность

Проверка ≤ 8 секунд для страницы до 10 000 символов; ≤ 1 сек для выделенных ≤ 500 симв.

Потребление токенов

≤ 8 000 токенов на страницу (soft-limit).

Безопасность

Минимальный набор разрешений (activeTab, storage, scripting, contextMenus).

Конфиденциальность

Текст передаётся на сервер только после явного действия пользователя.

Надёжность

Graceful fallback при ошибке сети — показывать уведомление.

Модульность

Front‑end и Back‑end развёртываются независимо; API версия v1.

Локализация UI

RU (основной), EN.

Код‑стайл

TypeScript 5 + ESLint Airbnb, Prettier.

6. Архитектура

┌─────────┐   Claim list   ┌───────────────┐   Evidence   ┌───────────────┐
│content  │──────────────►│background SW  │─────────────►│FastAPI server │
│script   │               │(messaging)    │              │(RAG pipeline) │
└─────────┘◄──────────────┴───────────────┘◄─────────────┴───────────────┘
   ▲             ▲                ▲                ▲
   │ UI updates  │ fetch verdicts │ OpenSearch     │ OpenAI / Brave API
   │             │                │                │
┌───────┐  React side panel uses Shadow DOM to avoid CSS collision.
│  UI   │
└───────┘

Front‑end: TypeScript 5 + React 18, Vite build, TailwindCSS (Shadow DOM).

Back‑end: Python 3.12, FastAPI, AsyncIO, httpx, OpenSearch‑py, pydantic.

Data: OpenSearch (vector) + Redis (rate-limiter).

CI/CD: GitHub Actions → Docker Hub → deploy to Fly.io.

7. Структура репозитория

/
├── extension/
│   ├── manifest.json
│   ├── background.ts
│   ├── content.ts
│   ├── ui/
│   └── assets/
├── server/
│   ├── app.py
│   ├── services/
│   │   ├── claim_detector.py
│   │   ├── search.py
│   │   └── verdict.py
│   ├── requirements.txt
│   └── tests/
├── .github/
│   ├── workflows/ci.yml
│   └── ISSUE_TEMPLATE.md
├── README.md
└── LICENSE

8. Внешние зависимости

Сервис

Назначение

Ограничения

OpenAI API (gpt‑4o, embeddings‑3‑large)

Translation, claim‑extract, verdict

Цена / rate‑limit 90k TPM

Brave Search API

Веб‑доказательства

2 000 запросов/мес бесплатно

Wikipedia CirrusSearch

Энциклопедия

200 запр./сут без ключа

fastText lid.176

Lang‑ID

126 МБ

OpenSearch 3.x

Vector cache

Docker-image 1.2 ГБ

9. Тестирование

Юнит‑тесты pytest (coverage ≥ 80 %).

E2E Playwright – сценарии проверки UI.

Набор фактов: 300 записей IFCN (ru/en/es) → Precision, Recall≥0.75.

Перфоманс: Lighthouse CI, Web-Vitals LCP≤2.5 s.

10. План работ (MVP → v1.0)

Неделя

Deliverable

1 – 2

Каркас расширения, README, CI

3 – 4

ClaimDetector MVP, UI Popup

5 – 7

Brave Search, Vector cache

8 – 10

Verdict LLM, пояснения

11 – 12

UX (подсветка, боковая панель)

13

Hardening, политика магазинов

14 – 15

Тестирование, локализация

16

Публикация v1.0

11. Критерии приёмки

Расширение проходит публикацию в Chrome Web Store и AMO без замечаний.

На странице Википедии (≈ 15 000 симв) результат появляется ≤ 8 с.

При повторной проверке того же текста API-запросов к OpenAI нет (сработал кэш).

В 95 % случаев UI отображается без перерисовок (FCP < 1 c).

Тест-корпус Precision ≥ 0.75, Recall ≥ 0.70.

12. Условия поддержки

Код под лицензией MIT, open-source.

Вопросы и баг-репорты через GitHub Issues.

Обновление моделей и зависимостей не реже 1 раза в квартал.
