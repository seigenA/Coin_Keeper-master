# CoinKeeper Wallet – Full MVP

Single‑page React application replicating core CoinKeeper features:
* Multiple **accounts**
* Income / expense **transactions**
* **Categories** management
* Interactive **statistics** with filters by account & period
* **Registration / login** (mocked JSON‑server)

## Tech stack
* React ^18.3.2
* Redux Toolkit ^2.4.1
* React Router ^6.23.2
* Tailwind CSS ^3.5.2
* Recharts ^3.1.2
* json‑server ^0.18.0 (mock REST API)
* Vite ^5.3.0

## Quick start
```bash
# Root
npm install
npm run install-all  # installs frontend & backend deps
npm run dev          # json-server (3001) + Vite (5173)
```

Open http://localhost:5173  
Demo account: **demo@demo.com / demo**

## Project structure
```
.
├── backend      ← json-server mock API
├── frontend     ← React SPA
└── package.json ← workspaces / scripts
```

## MVP checklist
- [x] Registration & authentication
- [x] Adding & deleting transactions
- [x] Dashboard balance & list
- [x] Category stats (pie chart)
- [x] Categories CRUD
- [x] Accounts CRUD
- [x] Date & account filters in statistics
- [x] Fully functional with one `npm run dev`
