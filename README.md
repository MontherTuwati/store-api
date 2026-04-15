# Monther Store API

Student-built REST API for an e-commerce store module: products in **MongoDB Atlas** (fields `storeId`, `storeName`, `productId`, `productName`, `price`), **Express** routes, a small **static** frontend under `/`, and optional aggregation of teammate product JSON feeds.

## Requirements

- **Node.js** 18 or newer  
- **MongoDB Atlas** cluster and database user  
- **npm**

## Setup

1. Clone the repository and install dependencies: `npm install`  
2. Copy `.env.example` to `.env` and set variables (see below).  
3. In Atlas → **Network Access**, allow **`0.0.0.0/0`** if the API runs on a host with a changing egress IP (e.g. Railway).  
4. Seed sample products: `npm run seed`  
5. Start the server: `npm start` (or `npm run dev` with file watch). Open **http://localhost:3000/** unless `PORT` is set.

## Environment variables

Values mirror **`.env.example`**. Fill teammate URLs for aggregation and tests.

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port for the Express server (optional; defaults to `3000`). |
| `MONGODB_URI` | Atlas `mongodb+srv://…` connection string (required). |
| `STUDENT_EMAIL` | Shown on the **`test-getAll.js`** result line (your store’s `GET /getAll` check). |
| `JUAN_STUDENT_EMAIL` | Shown on the **`juan-test.js`** result line. |
| `MAYA_STUDENT_EMAIL` | Shown on the **`mayada-test.js`** result line. |
| `JUAN_PRODUCTS_URL` | Teammate **JSON** product list URL; used by **`GET /products/all-stores`** when fetching Juan’s data. |
| `MAYA_PRODUCTS_URL` | Same for Mayada’s feed in **`GET /products/all-stores`**. |
| `API_BASE_URL` | Root URL of **your** deployed API for **`test-getAll.js`** (defaults to `http://127.0.0.1:3000` when unset). |


## API overview

- **`GET /getAll`**: JSON array of this store’s products (same data as **`GET /products`**).  
- **`GET /products`**: CRUD base path: list (`GET /`), create (`POST /`), read/update/delete by id routes under `/products`.  
- **`GET /products/getAll`**: Same list as `/getAll`.  
- **`GET /products/all-stores`**: Merges local products with configured teammate feeds; each item includes a `source` field.  
- **`GET /`**: Serves the static UI from `public/`.

## Tests

**`npm test`** runs **`scripts/automate.js`**, which executes the standalone scripts in **`tests/standalone/`** in order. Each script prints one line in the form `email - getAll to show all product - <code> - PASSED|FAILED`. Failures in one script do not stop the rest.

## Deployment

The repo includes **`railway.toml`** with `npm start` as the deploy command. Set **`MONGODB_URI`** and any other variables in the host’s environment panel; do not rely on committing `.env`. The server binds **`0.0.0.0`** and uses the platform’s **`PORT`**.
