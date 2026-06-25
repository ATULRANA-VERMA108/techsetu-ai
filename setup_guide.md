# TechSetu AI (Enterprise Edition) - Setup & Deployment Guide

This guide details how to configure, run, and deploy the TechSetu AI enterprise-grade application.

## Prerequisites

- **Java Development Kit (JDK)**: Version 21
- **Node.js**: Version 18 or 20 (and `npm`)
- **Maven**: Version 3.8+ (for backend building)
- **Docker & Docker Compose** (Optional, but highly recommended for containerized testing)

---

## Configuration & Environment Variables

Create a `.env` file in the root `techsetu-ai/` directory if you wish to override default variables:

```bash
# General
GEMINI_API_KEY=your_google_gemini_api_key_here

# PostgreSQL database (defaults used in compose)
POSTGRES_DB=techsetu_db
POSTGRES_USER=techsetu_admin
POSTGRES_PASSWORD=techsetu_secure_pass
```

---

## Running Locally (Standalone Developer Setup)

If you don't want to use Docker, you can run all services directly:

### 1. Databases
Ensure PostgreSQL, MongoDB, and Redis are running on your local machine:
- PostgreSQL port: `5432`
- MongoDB port: `27017`
- Redis port: `6379`

### 2. Launch Spring Boot Backend
Open a terminal in `backend/`:
```bash
# Compilation and build
mvn clean install

# Run the app
mvn spring-boot:run
```
The API server starts at `http://localhost:8080` (with Context path `/api`).

### 3. Launch React Frontend
Open a terminal in `frontend/`:
```bash
# Install dependencies
npm install

# Run Vite dev server
npm run dev
```
Open your browser at the displayed local URL (typically `http://localhost:5173`).

---

## Running with Docker Compose (Full Stack)

To test the entire containerized architecture (including databases, Spring Boot, Nginx, and static SPA serving):

1. Open a terminal in the root `techsetu-ai/` directory.
2. Build and launch the containers:
   ```bash
   docker-compose up --build -d
   ```
3. Nginx runs on port `80`. Open your browser and navigate to:
   `http://localhost/`
   
   All traffic is handled by Nginx:
   - Web App: `http://localhost/`
   - Spring Boot APIs: `http://localhost/api/`
   - WebSocket Channels: `ws://localhost/ws/`

---

## API Deployment Checklist

### Backend Deployment (Render or AWS)
- Build artifact: `backend/target/techsetu-backend-1.0.0.jar`
- Build command on Render: `mvn clean package -DskipTests`
- Run command: `java -jar target/techsetu-backend-1.0.0.jar`
- Envs to map:
  - `SPRING_DATASOURCE_URL`: Connect to Neon PostgreSQL.
  - `SPRING_DATA_MONGODB_URI`: Connect to MongoDB Atlas.
  - `SPRING_DATA_REDIS_HOST` & `PORT`: Connect to Redis Cloud or Upstash.
  - `GEMINI_API_KEY`: Google AI developer key.

### Frontend Deployment (Vercel)
- Root directory: `frontend/`
- Build command: `npm run build`
- Output directory: `dist/`
- Set standard Vercel configurations (Vercel automatically serves as SPA using rewrite rules in `vercel.json`).
