# Case Generator — Генератор 3D корпусов

## О проекте

Веб-приложение для создания параметрических 3D моделей корпусов для электроники. Пользователь выбирает шаблон, настраивает размеры и параметры, получает STL файл для 3D печати.

## Технологии

- **Frontend:** React 19 + TypeScript
- **3D рендеринг:** Three.js
- **UI:** CSS Modules, Lucide React (иконки)
- **Сборка:** Vite
- **Тесты:** Playwright (скриншотные тесты)
- **Линтинг/форматирование:** Biome
- **Git hooks:** Lefthook (автоформатирование при коммите)

## Структура проекта

```
projects/case-generator/frontend/
├── src/
│   ├── components/          # React компоненты
│   │   ├── Sidebar.tsx      # Боковое меню
│   │   ├── ModelSelector.tsx # Выбор шаблона
│   │   ├── ParameterForm.tsx # Форма параметров
│   │   └── ModelViewer.tsx  # Three.js 3D вьюер
│   ├── types/
│   │   └── index.ts         # TypeScript типы и данные моделей
│   ├── App.tsx              # Главный компонент
│   └── main.tsx             # Точка входа
├── tests/
│   └── screenshot.spec.ts   # Playwright тесты
├── playwright.config.ts     # Конфиг Playwright
├── biome.json               # Конфиг Biome
└── package.json
```

## Команды

```bash
# Разработка
npm run dev                 # Запуск dev сервера

# Сборка
npm run build               # Production сборка
npm run preview             # Просмотр сборки

# Качество кода
npm run format              # Форматирование Biome
npm run check               # Проверка и исправление
npm run biome:lint          # Только линтинг

# Тестирование
npx playwright test         # Запуск скриншотных тестов
npx playwright test --ui    # Запуск в UI режиме
```

## Шаблоны моделей

- `basic-box` — Базовый корпус
- `ventilated-box` — Вентилируемый корпус  
- `compact-case` — Компактный корпус

## Параметры модели

- Ширина, высота, глубина (мм)
- Толщина стенки (мм)
- Вентиляция (да/нет)
- Монтажные отверстия (да/нет)

## Разработка

### Добавление нового шаблона

1. Отредактировать `src/types/index.ts`
2. Добавить объект в `DEFAULT_MODELS`
3. Обновить логику в `ModelViewer.tsx` если нужно

### Скриншотные тесты

```typescript
// tests/screenshot.spec.ts
import { test } from '@playwright/test';

test('screenshot', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.waitForSelector('.app');
  await page.waitForTimeout(5000); // Ждём 3D рендер
  await page.screenshot({ path: 'test-results/screenshot.png' });
});
```

## Git Hooks (Lefthook)

Автоматическое форматирование и проверка кода при коммите.

### Конфигурация (lefthook.yml)

```yaml
pre-commit:
  parallel: true
  commands:
    biome-check:
      glob: "*.{js,ts,jsx,tsx,json,jsonc}"
      run: npx @biomejs/biome check --write --no-errors-on-unmatched --files-ignore-unknown=true {staged_files}
      stage_fixed: true

pre-push:
  commands:
    biome-ci:
      run: npx @biomejs/biome ci .
```

### Как это работает

- **pre-commit:** Biome автоматически форматирует и исправляет staged файлы
- **pre-push:** Запускается полная проверка Biome CI
- `stage_fixed: true` — автоматически добавляет исправленные файлы в коммит

### Ручной запуск

```bash
npx lefthook run pre-commit  # Протестировать pre-commit hook
```

## Полезные ссылки

- [Three.js документация](https://threejs.org/docs/)
- [Biome конфигурация](https://biomejs.dev/reference/configuration)
- [Playwright документация](https://playwright.dev/)

## TODO

- [ ] Генерация STL файла для скачивания
- [ ] Добавить больше шаблонов моделей
- [ ] Поддержка пользовательского логотипа
- [ ] Экспорт в другие форматы (OBJ, 3MF)
