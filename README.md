# PS-10: Resource Booking and Availability System

## Architecture

```
ReactJS (5173) → FastAPI Gateway (8000) → Spring Boot (8001) → PostgreSQL
                                        → Node.js (8002)     → MongoDB Atlas
```

---

## 📁 Project Structure

```
project/
├── springboot/               ← Spring Boot (User Auth + PostgreSQL)
│   ├── pom.xml
│   ├── setup.sql             ← Run this in pgAdmin FIRST
│   └── src/main/java/mth/
│       ├── ResourceBookingApplication.java
│       ├── controller/UsersController.java
│       ├── models/           (Users, Roles, Menus, Rolesmapping)
│       ├── repository/       (UsersRepository, RolesRepository, MenusRepository)
│       └── services/         (UsersService, JwtService)
│
├── backend/
│   ├── gateway/              ← FastAPI Gateway
│   │   ├── main.py
│   │   ├── run.py
│   │   ├── requirements.txt
│   │   ├── controllers/      (authenticationController.py, resourceController.py)
│   │   └── models/schemas.py
│   │
│   └── taskservices/         ← Node.js Resource + Booking Service
│       ├── main.js
│       ├── package.json
│       ├── .env              ← ⚠️ Fill in your MongoDB URL here
│       ├── config/db.js
│       ├── controllers/resourceController.js
│       ├── models/           (resource.js, booking.js)
│       └── services/resourceService.js
│
└── frontend/                 ← ReactJS Vite
    ├── index.html
    ├── package.json
    └── src/
        ├── App.jsx
        ├── lib.js
        └── components/
            ├── Login.jsx
            ├── Home.jsx
            ├── ResourceBooking.jsx   ← Book resources (all users)
            ├── ResourceManager.jsx   ← Add/Edit/Delete resources (admin)
            ├── UserManager.jsx       ← Manage users (admin)
            └── Profile.jsx
```

---

## 🚀 Setup Instructions

### STEP 1 — PostgreSQL Setup

1. Open **pgAdmin** or psql
2. Run the SQL commands from `springboot/setup.sql`
3. This creates: database, all tables, sample data, admin user

**Admin credentials:**
- Email: `admin@gmail.com`
- Password: `admin123`

### STEP 2 — Spring Boot Setup

1. Open `springboot/` in IntelliJ IDEA or Spring Tool Suite
2. Edit `src/main/resources/application.properties`:
   ```
   spring.datasource.password=YOUR_POSTGRES_PASSWORD
   ```
3. Run the application
4. Expected: `Tomcat started on port 8001`

### STEP 3 — MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free account
2. Create a free cluster (M0)
3. Create database user (username + password)
4. Allow network access: `0.0.0.0/0`
5. Get connection string from: Database → Connect → Drivers
6. Edit `backend/taskservices/.env`:
   ```
   DBURL=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/mth?retryWrites=true&w=majority
   ```
   > ⚠️ Keep `SECRETE_KEY` the same as `jwt.secret` in Spring Boot application.properties

### STEP 4 — Node.js Setup

```bash
cd backend/taskservices
npm install
npm start
```

Expected output:
```
MongoDB connected successfully
Resource Service running on http://localhost:8002
```

### STEP 5 — FastAPI Gateway Setup

```bash
cd backend/gateway
python3 -m venv venv

# Mac/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate

pip install -r requirements.txt
python run.py
```

Expected output:
```
Uvicorn running on http://127.0.0.1:8000
```

### STEP 6 — ReactJS Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open browser: http://localhost:5173

---

## 🔑 JWT Secret Key

The **same secret key** must be in both:

| File | Key |
|------|-----|
| `springboot/src/main/resources/application.properties` | `jwt.secret=resourcebookingsystemsecretkey2024` |
| `backend/taskservices/.env` | `SECRETE_KEY=resourcebookingsystemsecretkey2024` |

If they differ → Node.js returns `invalid signature` error.

---

## 🌐 Service Ports

| Service | Port | URL |
|---------|------|-----|
| ReactJS | 5173 | http://localhost:5173 |
| FastAPI Gateway | 8000 | http://localhost:8000 |
| Spring Boot | 8001 | http://localhost:8001 |
| Node.js | 8002 | http://localhost:8002 |
| PostgreSQL | 5432 | local |
| MongoDB | cloud | Atlas |

---

## 📋 API Mapping

### Auth (FastAPI → Spring Boot)

| ReactJS Calls (FastAPI :8000) | Forwards To (Spring Boot :8001) |
|-------------------------------|----------------------------------|
| POST /authservice/signup | POST /user/signup |
| POST /authservice/signin | POST /user/signin |
| GET /authservice/uinfo | GET /user/uinfo |
| GET /authservice/profile | GET /user/profile |
| GET /authservice/getallusers/{page}/{size} | GET /user/getallusers/{page}/{size} |
| GET /authservice/searchuser/{key} | GET /user/searchuser/{key} |
| POST /authservice/saveuser | POST /user/saveuser |
| PUT /authservice/updateuser/{id} | PUT /user/updateuser/{id} |
| DELETE /authservice/deleteuser/{id} | DELETE /user/deleteuser/{id} |

### Resources (FastAPI → Node.js)

| ReactJS Calls (FastAPI :8000) | Forwards To (Node.js :8002) |
|-------------------------------|------------------------------|
| POST /resourceservice/createresource | POST /resource/createresource |
| GET /resourceservice/getallresources/{page}/{size} | GET /resource/getallresources/{page}/{size} |
| PUT /resourceservice/updateresource/{id} | PUT /resource/updateresource/{id} |
| DELETE /resourceservice/deleteresource/{id} | DELETE /resource/deleteresource/{id} |
| GET /resourceservice/vectorsearch/{key} | GET /resource/vectorsearch/{key} |
| GET /resourceservice/recommendations/{key} | GET /resource/recommendations/{key} |
| GET /resourceservice/bycategory/{category} | GET /resource/bycategory/{category} |

### Bookings (FastAPI → Node.js)

| ReactJS Calls (FastAPI :8000) | Forwards To (Node.js :8002) |
|-------------------------------|------------------------------|
| POST /bookingservice/createbooking | POST /booking/createbooking |
| GET /bookingservice/getallbookings/{page}/{size} | GET /booking/getallbookings/{page}/{size} |
| PUT /bookingservice/updatebooking/{id} | PUT /booking/updatebooking/{id} |
| DELETE /bookingservice/cancelbooking/{id} | DELETE /booking/cancelbooking/{id} |
| GET /bookingservice/availability/{resourceId}/{date} | GET /booking/availability/{resourceId}/{date} |

---

## 🧪 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | admin123 |

Admin sees: Resource Booking + Resource Manager + User Manager + Profile  
User sees: Resource Booking + Profile

---

## ⚠️ Common Errors & Fixes

| Error | Fix |
|-------|-----|
| CORS error | FastAPI allows `http://localhost:5173` — already configured |
| `invalid signature` in Node.js | JWT secret must be same in Spring Boot & Node.js |
| 422 Unprocessable Entity | Optional fields in FastAPI schemas — already fixed |
| MongoDB buffering timeout | Check Atlas network access & DBURL in .env |
| Cannot connect to port 8001/8002 | Make sure Spring Boot / Node.js is running |

---

## ✅ Features Implemented

- [x] Resource listing and categorization
- [x] Booking with time slots (date + start/end time)
- [x] Availability tracking (shows existing bookings before you book)
- [x] Conflict-free reservation (blocks double-booking same slot)
- [x] Semantic / vector search for resources
- [x] Intelligent recommendations
- [x] Role-based menu (Admin vs User)
- [x] Full user management (Admin)
- [x] JWT auth across all services
- [x] MongoDB collections: resources, bookings, usage_logs, resource_embeddings, booking_history
- [x] PostgreSQL tables: users, roles, menus, rolesmapping, resources, bookings, time_slots
