# WatchPlus — API Health Monitoring Platform

WatchPlus is a full-stack API health monitoring platform that allows users to monitor websites and API endpoints, track uptime, measure response time, view monitoring history, and detect endpoint failures through automated background checks.

## 🚀 Live Demo

**Live Application:** [WatchPlus Live Demo](https://watch-plus-nine.vercel.app?utm_source=chatgpt.com)

**Backend API:** [WatchPlus Backend](https://watchplus-kmlg.onrender.com?utm_source=chatgpt.com)

**Repository:** [WatchPlus on GitHub](https://github.com/jemmiii/WatchPlus?utm_source=chatgpt.com)

> The backend exposes a health endpoint that reports application and database connectivity.

---

## ✨ Features

* 🔐 User registration and login
* 🔑 JWT-based authentication
* 🔒 Password hashing with bcrypt
* 📡 Add and monitor website/API endpoints
* ⏱️ Configurable monitoring intervals
* 🟢 Real-time UP/DOWN endpoint status
* ⚡ Response-time measurement
* 📊 Uptime percentage calculation
* 📜 Monitoring history
* 📈 Response-time and monitoring analytics
* ⏸️ Pause and resume monitoring
* 🗑️ Delete monitors
* 🔄 Automated background monitoring scheduler
* 🛡️ User-specific monitor authorization
* 📱 Responsive dashboard UI
* ☁️ Production deployment with Vercel, Render and MongoDB Atlas

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      React + TS      │
                    │   Vercel Frontend    │
                    └──────────┬───────────┘
                               │
                         REST API / JWT
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │    Render Backend     │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
       ┌─────────────────┐          ┌─────────────────┐
       │ MongoDB Atlas   │          │   Scheduler     │
       │   + Mongoose    │          │ Background Jobs │
       └─────────────────┘          └────────┬────────┘
                                             │
                                             ▼
                                  ┌────────────────────┐
                                  │ Monitored Endpoints│
                                  │ HTTP Health Checks │
                                  └────────────────────┘
```

---

## 🔄 How It Works

1. A user creates an account and logs in.
2. The backend authenticates the user using JWT.
3. The user adds a website or API endpoint to WatchPlus.
4. The monitoring scheduler registers the endpoint using its configured interval.
5. WatchPlus periodically sends an HTTP request to the monitored endpoint.
6. The system records:

   * HTTP status
   * UP/DOWN state
   * Response time
   * Error information
   * Check timestamp
7. Monitoring results are stored in MongoDB.
8. Uptime is calculated from the recorded checks.
9. The dashboard displays the latest status and monitoring analytics.
10. Users can pause, resume or delete their monitors.

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Axios
* Recharts
* CSS

### Backend

* Node.js
* Express.js
* JavaScript
* REST API
* JWT
* bcryptjs

### Database

* MongoDB
* Mongoose
* MongoDB Atlas

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

---

## 📁 Project Structure

```text
WatchPlus/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── MonitorDetails.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   │
│   └── package.json
│
├── server/
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Monitor.js
│   │   └── Check.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── monitors.js
│   │   └── dashboard.js
│   │
│   ├── services/
│   │   ├── monitorService.js
│   │   └── scheduler.js
│   │
│   └── server.js
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🔐 Authentication Flow

WatchPlus uses JWT-based authentication.

```text
Register
   ↓
Password hashed using bcrypt
   ↓
User stored in MongoDB
   ↓
JWT generated
   ↓
Token stored by frontend
   ↓
Authorization header
   ↓
Protected API routes
```

Protected requests use:

```text
Authorization: Bearer <JWT_TOKEN>
```

The backend validates the token before allowing access to user-specific monitor resources.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/api/auth/register` | Create a new user                |
| POST   | `/api/auth/login`    | Authenticate user and return JWT |

### Monitors

| Method | Endpoint                    | Description                       |
| ------ | --------------------------- | --------------------------------- |
| POST   | `/api/monitors`             | Create a monitor                  |
| GET    | `/api/monitors`             | Get authenticated user's monitors |
| GET    | `/api/monitors/:id/history` | Get monitor check history         |
| PATCH  | `/api/monitors/:id/pause`   | Pause monitoring                  |
| PATCH  | `/api/monitors/:id/resume`  | Resume monitoring                 |
| DELETE | `/api/monitors/:id`         | Delete monitor                    |

### Dashboard

| Method | Endpoint                  | Description                        |
| ------ | ------------------------- | ---------------------------------- |
| GET    | `/api/dashboard/overview` | Get monitoring overview statistics |

### Health

| Method | Endpoint      | Description                             |
| ------ | ------------- | --------------------------------------- |
| GET    | `/api/health` | Check backend and database connectivity |

---

## 📊 Monitoring Data

Each monitoring check records information such as:

```text
Monitor
 ├── Status
 │    ├── UP
 │    └── DOWN
 │
 ├── HTTP Status Code
 ├── Response Time
 ├── Error Message
 └── Checked At
```

The collected checks are used to calculate:

* Current endpoint status
* Average response time
* Uptime percentage
* Historical monitoring data

---

## ⚙️ Background Scheduler

WatchPlus includes a Node.js-based background scheduler.

When a monitor is created:

```text
Create Monitor
      ↓
Register Scheduler
      ↓
Immediate Health Check
      ↓
Wait for configured interval
      ↓
Run next health check
      ↓
Store result
      ↓
Update monitor status
      ↓
Repeat
```

When monitoring is paused, its scheduled interval is stopped.

When monitoring is resumed, the scheduler is registered again.

The scheduler also restores active monitors when the backend starts.

---

## 🧪 Example Monitor

```json
{
  "name": "Google",
  "url": "https://www.google.com",
  "interval": 60
}
```

Example monitoring result:

```text
Google
Status: UP
HTTP Status: 200
Response Time: 142 ms
Uptime: 100%
```

---

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/jemmiii/WatchPlus.git
cd WatchPlus
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

### 4. Start the backend

From the `server` directory:

```bash
node server.js
```

Backend:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Configure frontend API URL

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Start the frontend

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🌐 Production Deployment

WatchPlus is deployed using:

```text
Frontend
React + Vite
      ↓
Vercel

Backend
Node.js + Express
      ↓
Render

Database
MongoDB + Mongoose
      ↓
MongoDB Atlas
```

Production frontend:

[Open WatchPlus](https://watch-plus-nine.vercel.app?utm_source=chatgpt.com)

Production backend:

[WatchPlus API](https://watchplus-kmlg.onrender.com?utm_source=chatgpt.com)

---

## 🔒 Environment Variables

Never commit production credentials to GitHub.

Required variables:

```env
PORT=
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
VITE_API_URL=
```

The `.gitignore` excludes environment files from version control.

---

## 🎯 Engineering Highlights

This project was built to demonstrate practical software engineering concepts beyond basic CRUD:

* RESTful API design
* Authentication and authorization
* Password hashing
* MongoDB data modeling
* Protected resources
* Background job scheduling
* External HTTP health checks
* Failure detection
* Historical data storage
* Uptime calculation
* Response-time analytics
* Frontend/backend separation
* Environment-based configuration
* Cloud deployment
* Production debugging and CORS configuration

---

## 🚀 Future Improvements

Potential future improvements include:

* Email notifications for endpoint failures
* Incident tracking and recovery events
* Advanced uptime analytics
* Custom HTTP methods and headers
* Webhook integrations
* Better scheduler persistence
* Automated testing with Jest/Supertest
* Docker-based deployment
* CI/CD pipeline with GitHub Actions

---

## 👨‍💻 Author

**Jemin Patidar**

B.Tech — Information Technology

Interested in Software Development, Backend Engineering and Full-Stack Development.

**Portfolio:** [Jemin Patidar Portfolio](https://jeminpatidar-portfolio.vercel.app/?utm_source=chatgpt.com)

---

## ⭐ Project

If you find WatchPlus useful or interesting, consider giving the repository a star.

**Live Demo:** [WatchPlus](https://watch-plus-nine.vercel.app?utm_source=chatgpt.com)
