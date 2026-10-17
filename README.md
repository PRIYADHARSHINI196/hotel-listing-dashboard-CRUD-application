# Hotel List Page (CRUD)

Full-stack hotel listing app. Frontend: React + Redux. Backend: Node.js + Express + PostgreSQL (native SQL, no ORM).

## Features
- Add / Edit hotel with one reusable `HotelForm` (validation + image preview)
- Card-based list with search by title, price range filter and pagination
- Edit and Delete, with a success popup after delete
- Detail page with a map (Leaflet) and a "Show my location" button (Geolocation API)
- React Helmet for dynamic meta tags, `alt` text on all images
- Single Page Application with reusable components (`HotelForm`, `HotelCard`, `Pagination`, `Toast`)

## Prerequisites
- Node.js (LTS)
- PostgreSQL

## Setup

### 1. Database
Create a database named `hotel_db`, then run the table script in `backend/schema.sql`.

### 2. Backend
```
cd backend
npm install
```
Copy `.env.example` to `.env` and set your PostgreSQL password, then start the server:
```
node server.js
```
The API runs on http://localhost:5000

### 3. Frontend
```
cd frontend
npm install
npm run dev
```
The app runs on http://localhost:5173

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/hotels?title=&minPrice=&maxPrice=&limit=&offset= | List hotels with filters and pagination |
| GET | /api/hotels/:id | Get a single hotel |
| POST | /api/hotels | Create a hotel (multipart/form-data: image, title, description, latitude, longitude, price) |
| PUT | /api/hotels/:id | Update a hotel (image optional) |
| DELETE | /api/hotels/:id | Delete a hotel and its image file |

Uploaded images are stored in `backend/uploads` and the image path is saved in the database.

## Tech stack
React, Redux Toolkit, React Router, React Helmet, Leaflet, Node.js, Express, Multer, express-validator, PostgreSQL (`pg`)