# Taskify Backend

Jamoalar va foydalanuvchilar uchun vazifalar (tasks) va loyihalarni boshqaruvchi REST API.
Ma'lumotlar bazasi o'rniga `data/` papkasidagi JSON fayllardan foydalanadi.

## 🚀 O'rnatish va ishga tushirish

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. .env faylini yaratish
cp .env.example .env
# .env faylini ochib, JWT_SECRET qiymatini o'zgartiring

# 3. Ishga tushirish
npm run dev      # nodemon bilan (development)
npm start        # oddiy node bilan (production)
```

Server default holatda `http://localhost:5000` da ishga tushadi.

## 📁 Fayl strukturasi

```
taskify-backend/
├── data/
│   ├── users.json
│   ├── projects.json
│   └── tasks.json
├── src/
│   ├── utils/
│   │   ├── fileHandler.js     # JSON o'qish/yozish
│   │   ├── dataPaths.js       # fayllar yo'llari
│   │   ├── ApiError.js        # maxsus xatolik klassi
│   │   └── asyncHandler.js    # try/catch wrapper
│   ├── middlewares/
│   │   ├── authMiddleware.js  # JWT tekshirish, admin tekshirish
│   │   ├── errorHandler.js    # markazlashtirilgan xatoliklar
│   │   └── validate.js        # request body validatsiyasi
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔑 Auth

Barcha himoyalangan route'lar uchun header qo'shing:

```
Authorization: Bearer <token>
```

### `POST /api/v1/auth/register`
```json
{
  "name": "Ali Valiyev",
  "email": "ali@example.com",
  "password": "123456",
  "role": "user"
}
```

### `POST /api/v1/auth/login`
```json
{ "email": "ali@example.com", "password": "123456" }
```

### `GET /api/v1/auth/me`
Token orqali joriy foydalanuvchini qaytaradi. (himoyalangan)

## 📂 Projects

| Method | Endpoint | Tavsif | Himoyalangan |
|---|---|---|---|
| POST | `/api/v1/projects` | Yangi loyiha yaratish | ✅ |
| GET | `/api/v1/projects` | Barcha loyihalar | ✅ |
| GET | `/api/v1/projects/:id` | Loyiha + tasklari | ✅ |
| DELETE | `/api/v1/projects/:id` | O'chirish (faqat egasi/admin) | ✅ |

`POST` body: `{ "title": "...", "description": "..." }` (ownerId avtomatik token'dan olinadi)

## ✅ Tasks

| Method | Endpoint | Tavsif |
|---|---|---|
| POST | `/api/v1/tasks` | Yangi vazifa |
| GET | `/api/v1/tasks?status=todo&search=node` | Filtrlash bilan ro'yxat |
| PUT | `/api/v1/tasks/:id` | To'liq yangilash |
| PATCH | `/api/v1/tasks/:id/status` | Faqat statusni o'zgartirish |
| DELETE | `/api/v1/tasks/:id` | O'chirish |

`POST` body: `{ "projectId": "...", "title": "...", "status": "todo", "assignedTo": "userId" }`

Status qiymatlari: `todo`, `in-progress`, `done`

## 🌿 Git workflow

```
main       — tayyor versiya
develop    — asosiy ishlash branchi
feature/*  — har bir modul uchun alohida branch
```

Branch yaratish namunasi:
```bash
git checkout develop
git checkout -b feature/auth
# ... kod yozish ...
git add .
git commit -m "feat: implement user registration with JSON storage"
git push origin feature/auth
# keyin GitHub'da Pull Request oching: feature/auth -> develop
```

Commit xabarlari namunasi:
```
feat: setup express app and file helper
feat: implement user registration with JSON storage
fix: handle JSON read error when file is empty
```
