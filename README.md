# Harlequins FC (HarlequinsFC)

Harlequins FC is a full-stack sports club application built with a modern **Spring Boot Microservices** backend and a high-performance **React 19 + TypeScript + Vite** frontend.

---

## 🛠️ Current Technology Stack

### 🎨 Frontend (`quinsfc-web`)
* **Framework**: React 19 (`react`, `react-dom` v19.2)
* **Build Tool & Bundler**: Vite 8 (`vite` v8.1) + `@vitejs/plugin-react` (React Compiler enabled)
* **Language**: TypeScript 6 (`typescript` ~6.0)
* **Global State Management**: Zustand (`zustand` v5.0) with `persist` middleware (syncs session with browser `localStorage`)
* **Data Fetching & Cache**: TanStack React Query (`@tanstack/react-query` v5.101)
* **HTTP Client**: Axios (`axios` v1.18) with Vite dev-server proxy configuration
* **Form Handling & Validation**: React Hook Form (`react-hook-form` v7.82)
* **Routing**: React Router (`react-router-dom` v7.18)
* **UI Components & Carousel**: Mantine (`@mantine/core`, `@mantine/carousel` v9.4) & Phosphor Icons (`@phosphor-icons/react` v2.1)
* **Styling**: Vanilla CSS Modules & PostCSS (`postcss-preset-mantine`)
* **Testing**: Vitest (`vitest` v4.1) & React Testing Library (`@testing-library/react` v16.3)

---

### ⚙️ Backend (Microservices Architecture)
* **Java**: Java 17 JDK
* **Framework**: Spring Boot 3.1.1 & Spring Cloud 2022.0.3
* **Build Tool**: Gradle (with root & service wrapper scripts)
* **Group**: `com.road.quinsfc`
* **Database**: MySQL 8.0 (Connector version 8.0.33)
* **Security & Auth**: Spring Security + JWT Authentication (`io.jsonwebtoken` 0.12.3)
* **Messaging & Service Bus**: RabbitMQ (port 5672)

#### Microservices Overview:
* **`config-server`** (Port `8200`): Centralized configuration management using Spring Cloud Config (`com.road.quinsfc.configserver`).
* **`eureka-server`** (Port `8100`): Service discovery & registration using Netflix Eureka (`com.road.quinsfc.eurekaserver`).
* **`api-gateway`** (Port `8080`): Gateway for routing, security filtering, and CORS mapping (`com.road.quinsfc.apigateway`).
* **`members-service`**: Manages member accounts, registration (`POST /members/create`), and login (`POST /members/login`) (`com.road.quinsfc.membersservice`).
* **`parking-service`**: Manages stadium parking space reservations and availability (`com.road.quinsfc.parkingservice`).

---

## 🚀 Running the Application Locally

### Prerequisites
Make sure you have the following installed on your machine:
* **Java 17 JDK** (configured in system `PATH` / `JAVA_HOME`)
* **Node.js** (v18.x or v20.x recommended) & **npm**
* **MySQL 8.0** running locally on port `3306` (database schema `quinsfc_members`)
* **RabbitMQ** (optional for config bus refresh, running on default port `5672`)

---

### 1. Launching Backend Microservices

Launch the microservices in the following sequential order:

```bash
# Step 1: Start Centralized Config Server (Port 8200)
cd config-server
./gradlew bootRun   # On Windows: gradlew.bat bootRun

# Step 2: Start Eureka Service Registry (Port 8100)
cd ../eureka-server
./gradlew bootRun

# Step 3: Start API Gateway (Port 8080)
cd ../api-gateway
./gradlew bootRun

# Step 4: Start Members Service
cd ../members-service
./gradlew bootRun

# Step 5: Start Parking Service
cd ../parking-service
./gradlew bootRun
```

> **Note**: You can inspect active microservices on the Eureka Dashboard by opening `http://localhost:8100` in your browser.

---

### 2. Launching Frontend (`quinscc-web` / `quinsfc-web`)

In a new terminal window, navigate to the web directory:

```bash
# Step 1: Navigate to web application folder
cd quinscc-web

# Step 2: Install dependencies
npm install

# Step 3: Start local development server
npm run dev
```

* Open your browser and navigate to **`http://localhost:5173`**.
* The Vite development server automatically proxies API requests (such as `/members/login` and `/members/create`) to the API Gateway running at `http://localhost:8080`.

---

### 3. Frontend Commands & Scripts

Inside the web directory, the following npm scripts are available:

```bash
npm run dev      # Starts Vite local dev server with HMR
npm run test     # Runs unit tests using Vitest
npm run build    # Performs TypeScript type-checking and builds production bundle
npm run preview  # Previews production build locally
npm run lint     # Runs ESLint checks
```

---

## 📐 Project Structure

```
HarlequinsFC/
├── api-gateway/            # Spring Cloud Gateway (Port 8080)
├── config-server/           # Spring Cloud Config Server (Port 8200)
├── eureka-server/           # Netflix Eureka Service Discovery (Port 8100)
├── members-service/         # Member Management Microservice
├── parking-service/         # Stadium Parking Microservice
└── quinscc-web/             # React 19 + Vite Frontend Application
    ├── src/
    │   ├── assets/          # Static images, logos, media
    │   ├── components/      # UI components & pages (Home, Squad, Fixtures, Login, etc.)
    │   ├── hooks/           # Custom React hooks & TanStack Query mutations
    │   ├── services/        # API services and Axios clients
    │   ├── store/           # Zustand state management (auth store, persistence)
    │   └── App.tsx          # Application routing setup
    └── package.json
```
