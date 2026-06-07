# Athiya

A real-estate property showcase website with a public-facing site and a protected admin dashboard for managing projects, sales, and enquiries.

- **Frontend:** React 19 + Vite + Tailwind CSS + React Router + Framer Motion
- **Backend:** Node.js + Express 5 + Mongoose
- **Database:** MongoDB
- **Auth:** JWT (bcrypt-hashed passwords)
- **Deployment:** Docker Compose (frontend served by nginx, which also proxies the API)

---

## Quick start (Docker — recommended)

The whole stack (frontend, backend, MongoDB) runs with one command:

```bash
docker compose up --build
```

Then open:

| Service        | URL                     | Notes                                      |
| -------------- | ----------------------- | ------------------------------------------ |
| **App**        | http://localhost:8080   | The site you interact with                 |
| **API**        | http://localhost:5001   | Express backend (proxied at `/api`)        |
| **MongoDB**    | localhost:27017         | Database `athiya-dev`                       |

On first run the backend **seeds** an admin user and default content. Log in to the admin dashboard with:

```
email:    admin@grazia.com
password: Grazia@2026
```

> Drop `--build` on subsequent runs (`docker compose up`); only rebuild after changing code or dependencies.

### Common Docker commands

```bash
docker compose up -d            # start in the background
docker compose logs -f          # tail all logs
docker compose logs -f backend  # tail just the backend
docker compose down             # stop everything (keeps the DB)
docker compose down -v          # stop AND wipe the Mongo data volume
```

---

## Local development (without Docker)

Useful for hot-reload while building features. Requires **Node.js 22+** and a local or remote **MongoDB**.

### 1. Backend

```bash
cd server
npm install
npm start          # runs node index.js on port 5001
```

Create `server/.env` (see [Environment variables](#environment-variables)):

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/athiya-dev
JWT_SECRET=your-secret-here
```

### 2. Frontend

In a second terminal, from the project root:

```bash
npm install
npm run dev        # Vite dev server, usually http://localhost:5173
```

The frontend talks to the API via `VITE_API_URL`, defaulting to `http://localhost:5001/api` when unset (see `src/context/AuthContext.jsx` and `src/context/ProjectContext.jsx`).

> **Note:** You can't run the host backend (`npm start`) and the Docker `backend` container at the same time — they both bind port `5001`. Use one or the other, or remap the container port in `docker-compose.yml`.

---

## Environment variables

### Backend (`server/.env` / compose `environment`)

| Variable     | Default                                  | Description                                  |
| ------------ | ---------------------------------------- | -------------------------------------------- |
| `PORT`       | `5000` (compose sets `5001`)             | Port the Express server listens on           |
| `MONGO_URI`  | `mongodb://localhost:27017/athiya-dev`   | MongoDB connection string                    |
| `JWT_SECRET` | `change-me-in-production`                | Secret used to sign JWTs — **set a real one in production** |
| `CLIENT_URL` | `*`                                      | Allowed CORS origin                          |
| `NODE_ENV`   | —                                        | `production` in Docker                       |

### Frontend (build-time)

| Variable        | Default                       | Description                                            |
| --------------- | ----------------------------- | ------------------------------------------------------ |
| `VITE_API_URL`  | `http://localhost:5001/api`   | API base URL. In Docker it's baked as `/api` (proxied by nginx). |

---

## Project structure

```
.
├── docker-compose.yml      # Orchestrates frontend, backend, mongo
├── Dockerfile              # Frontend: Vite build → nginx
├── nginx.conf              # Serves the SPA + proxies /api to the backend
├── src/                    # React frontend
│   ├── pages/              # Home, About, Services, Projects, ProjectDetail,
│   │                       #   Contact, Login, Signup, AdminDashboard
│   ├── components/         # Navbar, Footer, ProjectCard
│   ├── context/            # AuthContext, ProjectContext (API clients + state)
│   ├── data/               # Static project seed data
│   └── assets/             # Images and location photos
└── server/                 # Express backend
    ├── index.js            # App entry, route mounting, DB connect, seeding
    ├── Dockerfile          # Backend image
    ├── middleware/auth.js  # protect / admin JWT middleware
    ├── models/             # User, Project, Sale, Enquiry (Mongoose schemas)
    └── routes/             # auth, project, contact, admin
```

---

## API overview

All routes are mounted under `/api`. Routes marked 🔒 require a valid JWT; 👑 additionally require an admin user.

### Auth — `/api/auth`
| Method | Path        | Description              |
| ------ | ----------- | ------------------------ |
| POST   | `/register` | Create a new user        |
| POST   | `/login`    | Log in, returns a JWT    |

### Projects — `/api/projects`
| Method | Path    | Access | Description            |
| ------ | ------- | ------ | ---------------------- |
| GET    | `/`     | public | List all projects      |
| GET    | `/:id`  | public | Get one project        |
| POST   | `/`     | 🔒👑   | Create a project       |
| PUT    | `/:id`  | 🔒👑   | Update a project       |
| DELETE | `/:id`  | 🔒👑   | Delete a project       |

### Contact — `/api/contact`
| Method | Path | Access | Description        |
| ------ | ---- | ------ | ------------------ |
| POST   | `/`  | 🔒     | Submit an enquiry  |

### Admin — `/api/admin`
| Method | Path          | Access | Description                |
| ------ | ------------- | ------ | -------------------------- |
| GET    | `/stats`      | 🔒👑   | Dashboard statistics       |
| POST   | `/sales`      | 🔒👑   | Record a sale              |
| GET    | `/enquiries`  | 🔒👑   | List submitted enquiries   |

---

## Building for production

```bash
npm run build      # outputs static assets to dist/
```

In Docker this happens automatically: the frontend image runs the Vite build and serves `dist/` through nginx, which proxies `/api` to the backend container. Before deploying, set a strong `JWT_SECRET` and a real `MONGO_URI`.
