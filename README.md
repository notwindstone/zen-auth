this is just an authorization code example that was written in a hurry. don't use it because it has some vulnerabilities that i wanted to fix, but decided instead to fully rewrite auth from scratch

if you want to check refactoring progress: https://github.com/notwindstone/zen-auth/tree/v2 (it uses argon2id instead of bcrypt)

## Запуск

Для запуска потребуется установка зависимостей:

```bash
bun i
```

Можно использовать любой Node.js-поддерживаемый пакетный менеджер.

Помимо этого, необходимо создать файл `.env.local` по шаблону из `.env.example`:

```
NODE_ENV=''
RESEND_API_KEY=''
DATABASE_URL=''
```

Поле `NODE_ENV` можно оставить пустым либо ввести значение `production`, если необходим запуск в режиме продакшна.

В поле `RESEND_API_KEY` вписывается ключ API от сервиса отправки писем Resend.

В поле `DATABASE_URL` вписывается ссылка на базу данных от сервиса Neon.tech. В будущем появится возможность использовать другие БД.

В указанной базе данных нужно создать таблицы с помощью следующей команды:

```bash
bunx drizzle-kit push
```

После успешной "миграции" БД можно запустить веб-сайт в режиме разработки:

```bash
bun dev
```

Или в режиме продакшна:

```bash
bun build
bun start
```

## Деплой через Vercel

Зарегистрируйтесь на Vercel и нажмите кнопку:

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?s=https%3A%2F%2Fgithub.com%2Fnotwindstone%2Fauthless-next-demo)

После создания проекта перейдите во вкладку `Settings` и откройте `Environment variables`. Там укажите значения ключей по шаблону `.env.example`, пользуясь информацией из предыдущей секции, а затем пересоберите веб-сайт.