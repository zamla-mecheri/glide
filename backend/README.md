# AutoConnect Backend (Node.js)

Express API with **Mongoose** (MongoDB) for drivers, passengers, bookings, reviews, and complaints. Frontend is connected to the API.

## Setup

```bash
cd backend
npm install
```

## MongoDB (Cloud - Atlas)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and create a free cluster
2. Create a database user and get the connection string
3. Copy `.env.example` to `.env` and set `MONGODB_URI`:

```
MONGODB_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/autoconnect?retryWrites=true&w=majority
```

## Run

```bash
npm start
```

Server runs at **http://localhost:3000**

- **Frontend:** http://localhost:3000/
- **Backend UI (driver add):** http://localhost:3000/backend/backend.html
- **API base:** http://localhost:3000/api

**Note:** Open the app via the Node server (localhost:3000). The frontend uses the API; opening HTML files directly will not work.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/drivers | List drivers (optional `?available=true`) |
| POST | /api/drivers | Register driver |
| GET | /api/drivers/:id | Get driver |
| PATCH | /api/drivers/:id | Update driver (e.g. `available`, `rating`) |
| POST | /api/drivers/login | Login driver (`phone`, `password`) |
| GET | /api/passengers | List passengers |
| POST | /api/passengers | Register passenger |
| POST | /api/passengers/login | Login passenger |
| GET | /api/requests | List bookings (`?passengerId=`, `?driverId=`, `?status=`) |
| POST | /api/requests | Create booking |
| PATCH | /api/requests/:id | Update status (`accepted`/`rejected`/`completed`) |
| GET | /api/reviews | List reviews (`?driverId=`) |
| POST | /api/reviews | Add review |
| GET | /api/complaints | List complaints |
| POST | /api/complaints | Add complaint |
| PATCH | /api/complaints/:id | Resolve complaint (`status: "resolved"`) |
| GET | /api/health | Health check |

## Environment

- `PORT` – Server port (default: 3000)
