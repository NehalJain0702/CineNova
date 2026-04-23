## BookMyShow (Java + React)

### Folder structure
- **Backend (Spring Boot / Maven)**: repo root (`pom.xml`, `src/main/java/...`)
- **Frontend (React / Vite)**: `frontend/`

### Run locally (dev)
Backend (port **8080**):

```powershell
cd "c:\Users\07neh\Downloads\BookMyShow\BookMyShow"
.\mvnw.cmd spring-boot:run
```

Frontend (port **3000**, proxies `/api` → backend):

```powershell
cd "c:\Users\07neh\Downloads\BookMyShow\BookMyShow\frontend"
npm install
npm run dev
```

### API base URL
- Frontend defaults to **`/api`** (Vite proxy in dev).
- To point the frontend at a deployed backend, set `VITE_API_URL` (example: `http://your-host:8080/api`).

