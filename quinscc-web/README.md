# Harlequins FC — Frontend Web Application (`quinsfc-web`)

Modern React web application for Harlequins FC, built with **React 19**, **TypeScript**, **Vite**, **Zustand**, and **TanStack Query**.

---

## 🛠️ Technology Stack

* **Core**: React 19 (`react`, `react-dom`)
* **Build Tool**: Vite 8 (`vite`) with `@vitejs/plugin-react`
* **Language**: TypeScript 6
* **Global State**: Zustand (`zustand`) with `persist` middleware
* **Data Fetching**: TanStack React Query (`@tanstack/react-query`) & Axios (`axios`)
* **Forms**: React Hook Form (`react-hook-form`)
* **Routing**: React Router 7 (`react-router-dom`)
* **UI & Components**: Mantine Carousel (`@mantine/carousel`), Phosphor Icons (`@phosphor-icons/react`)
* **Testing**: Vitest (`vitest`) & React Testing Library

---

## 🚀 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Access the application at `http://localhost:5173`. API calls are proxied to `http://localhost:8080` (Spring Boot API Gateway).

### 3. Available Scripts
```bash
npm run dev      # Start dev server
npm run test     # Run Vitest test suite
npm run build    # Run type-check and Vite production build
npm run preview  # Preview production build locally
```
