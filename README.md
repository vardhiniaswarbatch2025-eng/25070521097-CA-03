# Roomie Finder

React (Vite) + Express + MongoDB. Passwords are hashed with bcryptjs (a drop-in for bcrypt that needs no C++ build tools on Windows). Auth uses JWT.

## 1. Install the tools (Windows)
1. Node.js LTS: https://nodejs.org (check with `node -v`).
2. MongoDB Community Server: https://www.mongodb.com/try/download/community. Choose "Install as a Service" so it runs automatically.
3. MongoDB Compass (optional viewer): https://www.mongodb.com/try/download/compass. Connect to `mongodb://127.0.0.1:27017`.
4. VS Code: https://code.visualstudio.com

## 2. Run
In VS Code: File > Open Folder > `roomie-finder`, then Terminal > New Terminal:
```
npm run install:all
npm run dev
```
Open http://localhost:5173. The API runs on port 5000. `server/.env` is already created from `server/.env.example`; change `JWT_SECRET` to your own random text.
To run separately, use two terminals: `npm run start:server` and `npm run start:client`.

## 3. Test the main flow
1. Sign up two accounts (use a normal window and a private window).
2. Account A: Add listing. Account B: Browse, filter, open it, send an enquiry.
3. Account A: Dashboard, accept or decline. Account B then sees the owner's email.
4. Both accounts: Roommates, save preferences to see matches (needs 40%+ compatibility).

## Troubleshooting
- `MongoDB connection failed`: open Services (Win+R, `services.msc`), start "MongoDB Server", or check `MONGO_URI`.
- `EADDRINUSE`: port 5000 or 5173 is busy; change `PORT` in `server/.env` and the proxy in `client/vite.config.js`.
- `npm` blocked in PowerShell: run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- Blank listings page and "Request failed": the server is not running; check the `api` terminal output.
