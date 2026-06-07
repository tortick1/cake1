# Инструкция для публикации сайта на GitHub Pages

Эта инструкция для другой нейросети/помощника, который будет работать с локальной папкой сайта и помогать владельцу заливать сайт на GitHub, подключать домен и менять фотографии.

Рабочая папка обычно такая:

```powershell
C:\Users\Artem\Desktop\Сайт тортик
```

## 1. Что важно помнить

1. Всегда проверяй, в какой GitHub-аккаунт нужно заливать сайт.
2. Никогда не пушь сайт в старый репозиторий, пока не проверишь `git remote -v`.
3. Если пользователь показывает скриншот пустого репозитория GitHub, бери URL именно с этого скриншота.
4. Для GitHub Pages обычный сайт должен лежать в ветке `main`, в корне репозитория.
5. Если подключается новый домен, в корне проекта должен быть файл `CNAME` с этим доменом.
6. Не проси пароль в чат. Если нужен вход, запускай команду, чтобы Git/GitHub открыл окно авторизации, а пользователь сам вошёл.

## 2. Как проверить текущий проект

Сначала перейти в папку сайта:

```powershell
cd "C:\Users\Artem\Desktop\Сайт тортик"
```

Проверить файлы:

```powershell
dir
```

Должны быть хотя бы:

```text
index.html
styles.css
scripts.js
assets
```

Проверить Git:

```powershell
git status
git branch --show-current
git remote -v
```

Если `git remote -v` показывает старый аккаунт или старый репозиторий, его надо заменить перед пушем.

## 3. Как понять URL репозитория

Пользователь должен создать пустой репозиторий на GitHub и прислать скриншот страницы **Quick setup**.

На этой странице будет строка вида:

```text
https://github.com/ACCOUNT/REPOSITORY.git
```

Пример:

```text
https://github.com/tortick1/cake1.git
```

Из этого понятно:

```text
GitHub account: tortick1
Repository: cake1
Remote URL: https://github.com/tortick1/cake1.git
GitHub Pages URL: https://tortick1.github.io/cake1/
```

Чтобы Git точно использовал нужный аккаунт, remote лучше ставить с username:

```powershell
git remote set-url origin https://tortick1@github.com/tortick1/cake1.git
```

Если remote ещё не существует:

```powershell
git remote add origin https://tortick1@github.com/tortick1/cake1.git
```

## 4. Как залить сайт

Проверить текущий remote:

```powershell
git remote -v
```

Он должен показывать новый репозиторий, например:

```text
origin  https://tortick1@github.com/tortick1/cake1.git (fetch)
origin  https://tortick1@github.com/tortick1/cake1.git (push)
```

Добавить изменения:

```powershell
git add -A
```

Сделать коммит:

```powershell
git commit -m "Update site"
```

Если Git пишет, что нечего коммитить, значит изменений нет. Тогда можно сразу пушить.

Переименовать ветку в `main`:

```powershell
git branch -M main
```

Залить:

```powershell
git push -u origin main
```

## 5. Что делать, если GitHub просит вход

Если после `git push` открылось окно **Git Credential Manager / Connect to GitHub**, пользователь должен сам войти в нужный GitHub-аккаунт.

Обычно окно выглядит так:

```text
Connect to GitHub
GitHub Sign in

[Browser/Device] [Token]

Sign in with your browser
Sign in with a code
```

Лучший вариант:

1. Нажать **Sign in with your browser**.
2. Откроется браузер GitHub.
3. Пользователь входит именно в нужный аккаунт.
4. Если GitHub показывает **Device Activation**, надо проверить строку:

```text
Signed in as ACCOUNT_NAME
```

5. Если аккаунт правильный, нажать **Continue**.
6. Вернуться в консоль и дождаться завершения `git push`.

Если браузер открыл не тот аккаунт:

1. В окне GitHub нажать **Use a different account**.
2. Войти в нужный аккаунт.
3. Потом снова нажать **Continue**.

Если пользователь хочет вход через код:

1. В окне Git Credential Manager нажать **Sign in with a code**.
2. Git покажет код и ссылку.
3. Пользователь открывает ссылку, вводит код и подтверждает вход.
4. После этого консоль продолжит пуш.

Важно: не проси логин и пароль в чат. Пользователь сам вводит их в окне GitHub.

## 6. Как проверить, что сайт залит не туда

После пуша обязательно проверить:

```powershell
git remote -v
```

Должен быть правильный репозиторий.

Ещё проверить последний коммит:

```powershell
git log --oneline -1
```

И открыть страницу репозитория в браузере. Там должны появиться файлы:

```text
index.html
styles.css
scripts.js
assets
```

## 7. Как включить GitHub Pages вручную

Если GitHub Pages не включился автоматически:

1. Открыть репозиторий на GitHub.
2. Нажать **Settings**.
3. Слева нажать **Pages**.
4. В блоке **Build and deployment** выбрать:

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

5. Нажать **Save**.

Через несколько минут сайт будет доступен по адресу:

```text
https://ACCOUNT.github.io/REPOSITORY/
```

Пример:

```text
https://tortick1.github.io/cake1/
```

## 8. Как включить GitHub Pages через команду

Если установлен `gh` и есть авторизация, можно включить Pages командой.

Сначала проверить:

```powershell
gh auth status
```

Если `gh` не авторизован, можно попробовать взять токен из Git Credential Manager. Важно: токен не выводить пользователю.

Пример для аккаунта `tortick1` и репозитория `cake1`:

```powershell
$credInput = "protocol=https`nhost=github.com`nusername=tortick1`n`n"
$cred = $credInput | git credential fill
$tokenLine = $cred | Where-Object { $_ -like 'password=*' } | Select-Object -First 1
$env:GH_TOKEN = $tokenLine.Substring('password='.Length)

$body = '{"source":{"branch":"main","path":"/"}}'
$body | gh api -X POST repos/tortick1/cake1/pages --input -
```

Проверить Pages:

```powershell
gh api repos/tortick1/cake1/pages
```

Если статус `building`, надо подождать.

Проверить сайт:

```powershell
Invoke-WebRequest -Uri "https://tortick1.github.io/cake1/" -UseBasicParsing
```

## 9. Как подключить домен к сайту

Когда пользователь даёт домен, например:

```text
royalcake.fun
```

Нужно создать или заменить файл `CNAME` в корне проекта.

В файле должна быть только одна строка:

```text
royalcake.fun
```

Команды:

```powershell
Set-Content -Path .\CNAME -Value "royalcake.fun" -Encoding ascii
git add CNAME
git commit -m "Configure custom domain"
git push
```

После этого в GitHub Pages желательно тоже проверить custom domain:

1. GitHub repository.
2. **Settings**.
3. **Pages**.
4. В поле **Custom domain** должно быть:

```text
royalcake.fun
```

5. Если поля нет или домен не указан, вписать домен и нажать **Save**.

## 10. Какие DNS-записи говорить пользователю

Для GitHub Pages нужны такие записи.

Для основного домена:

```text
A      @      185.199.108.153
A      @      185.199.109.153
A      @      185.199.110.153
A      @      185.199.111.153
```

Для `www`:

```text
CNAME  www    ACCOUNT.github.io.
```

Пример для аккаунта `tortick1`:

```text
CNAME  www    tortick1.github.io.
```

Точка в конце `tortick1.github.io.` желательна. Если панель домена сама убирает точку, это нормально.

## 11. Что удалять в DNS

Нужно удалять или заменять только записи, которые конфликтуют с GitHub Pages.

Если в DNS есть:

```text
@      A      135.181.41.169
www    A      135.181.41.169
```

Или другие старые `A`-записи для `@` и `www`, их надо удалить.

Потом добавить:

```text
@      A      185.199.108.153
@      A      185.199.109.153
@      A      185.199.110.153
@      A      185.199.111.153
www    CNAME  ACCOUNT.github.io.
```

Не обязательно удалять:

```text
mail   A
@      MX
ftp    CNAME
```

Эти записи не мешают сайту, если пользователь не просит настраивать почту или FTP. Для простого сайта менять нужно только `@` и `www`.

## 12. Что говорить пользователю после DNS

Сказать коротко:

```text
Сайт с моей стороны готов: код залит, GitHub Pages включён, CNAME добавлен.
Тебе нужно сохранить DNS-записи. После этого домен может заработать не сразу.
Обычно ждать от 10 минут до нескольких часов.
HTTPS может появиться позже, когда GitHub выпустит сертификат.
```

Если GitHub показывает кнопку **Enforce HTTPS**, её можно включить после того, как сертификат готов.

## 13. Как менять фотографии в галерее

Фотографии лежат в папке:

```text
assets
```

В HTML галерея обычно находится в `index.html`. Нужно искать блок с картинками:

```html
<div class="gallery-grid">
```

Или искать строки:

```html
<img src="assets/...
```

Чтобы добавить фото:

1. Положить файл в папку `assets`.
2. В `index.html` добавить новый блок карточки по образцу существующих.

Пример:

```html
<button class="gallery-item fade-in" type="button">
  <img src="assets/photo_77_2026-06-07_15-05-21.jpg" alt="Торт на замовлення" loading="lazy">
</button>
```

Чтобы убрать фото из галереи:

1. Найти строку с нужным файлом в `index.html`.
2. Удалить весь блок карточки:

```html
<button class="gallery-item fade-in" type="button">
  <img src="assets/photo_58_2026-06-07_15-05-21.jpg" alt="Торт на замовлення" loading="lazy">
</button>
```

3. Если фото не должно загружаться в GitHub, можно добавить его в `.gitignore`:

```text
assets/photo_58_2026-06-07_15-05-21.jpg
```

Или удалить файл из папки, если пользователь точно просит удалить его полностью.

После замены фото обязательно проверить, что все картинки из HTML существуют:

```powershell
$html = Get-Content .\index.html -Raw -Encoding UTF8
$imgs = [regex]::Matches($html, 'assets/[^"'']+\.(jpg|png|webp)') | ForEach-Object { $_.Value }
$missing = $imgs | Where-Object { -not (Test-Path $_) }
$missing
```

Если команда ничего не вывела, все картинки найдены.

## 14. Как убрать категории, сортировку или прайс-листы

Если пользователь просит убрать сортировку, удалить в `index.html` блоки с кнопками фильтра:

```html
class="filter-btn"
```

И проверить, что в `scripts.js` нет логики фильтрации по категориям.

Если пользователь просит убрать прайс-листы, искать и удалить блоки:

```text
price
Прайс
Прайс-лист
```

Проверка:

```powershell
Select-String -Path .\index.html,.\scripts.js,.\styles.css -Pattern 'filter-btn|price|Прайс'
```

Если ничего не найдено, сортировки и прайса нет.

## 15. Финальная проверка перед сдачей

Перед финальным ответом пользователю выполнить:

```powershell
git status --short
git remote -v
```

Если есть незакоммиченные изменения:

```powershell
git add -A
git commit -m "Update site"
git push
```

Проверить GitHub Pages URL:

```powershell
Invoke-WebRequest -Uri "https://ACCOUNT.github.io/REPOSITORY/" -UseBasicParsing
```

Если кастомный домен уже подключён и DNS настроен:

```powershell
Invoke-WebRequest -Uri "http://DOMAIN/" -UseBasicParsing
```

## 16. Короткий шаблон ответа пользователю

После успешной публикации:

```text
Готово. Сайт залит сюда:
https://github.com/ACCOUNT/REPOSITORY

GitHub Pages:
https://ACCOUNT.github.io/REPOSITORY/

Если домен уже дан, я добавил CNAME:
DOMAIN

В DNS удали:
@ A старый_IP
www A старый_IP

Добавь:
@ A 185.199.108.153
@ A 185.199.109.153
@ A 185.199.110.153
@ A 185.199.111.153
www CNAME ACCOUNT.github.io.

После сохранения DNS ждать от 10 минут до нескольких часов.
```

