# Harlequins FC (HFC)

Harlequins FC is a full-stack sports club application built with a modern **Spring Boot Microservices** backend and a high-performance **React 19 + TypeScript + Vite** frontend.

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph Client Layer
        WEB["quinsfc-web (React 19 + TypeScript + Vite)"]
    end

    subgraph Edge & System Infrastructure
        GW["API Gateway :8080 (/api/**)"]
        EUR["Eureka Service Discovery :8100"]
        CFG["Config Server :8200"]
        KFK["Apache Kafka Broker :9092 (KRaft Mode)"]
    end

    subgraph Microservices & Data Layer
        MEM["members-service (Port 0)<br/>Database: MySQL 8.0 (quinscc_members)"]
        PKG["parking-service (Port 0)<br/>Database: PostgreSQL 16 (quinsfc_parking)"]
        PAY["payment-service (Port 0)<br/>Database: PostgreSQL 16 (quinsfc_payments)"]
        TKT["tickets-service (Port 0)<br/>Database: PostgreSQL 16 (quinsfc_tickets)"]
    end

    WEB -->|"REST Calls (/api/**)"| GW
    GW -->|"JWT Auth & Routing (/api/members/**)"| MEM
    GW -->|"Routing (/api/parking/**)"| PKG
    GW -->|"Routing (/api/payments/**)"| PAY
    GW -->|"JWT Auth & Routing (/api/tickets/**)"| TKT

    TKT -->|"Produces: ticket-events"| KFK
    PAY -->|"Produces: payment-events"| KFK
    MEM -->|"Consumes: ticket-events"| KFK
    PKG -->|"Consumes: payment-events"| KFK
    KFK -->|"Spring Cloud Config Bus"| CFG

    MEM -.->|"Registers"| EUR
    PKG -.->|"Registers"| EUR
    PAY -.->|"Registers"| EUR
    TKT -.->|"Registers"| EUR
```

---

## ✨ Current Features

* 🎟️ **Matchday Ticketing Hub (`/tickets`)**: Real-time seat inventory browsing, category tier selection (Standard £45, East Terrace Premium £85, Quins Diamond VIP £175), and ACID transactional seat booking powered by `tickets-service` & PostgreSQL 16.
* 📱 **My Digital Passes Wallet (`/my-tickets`)**: Dedicated member pass wallet with gate pass QR/barcode rendering, active booking status, and instant ticket cancellation & refund processing.
* 💳 **Stripe Test Payment Integration (`/payments`)**: Secure checkout sessions, webhooks, and automated refund management powered by `payment-service`.
* 🔄 **Login Intent Memory & Auto-Booking**: Smooth navigation preserving targeted match booking state across login redirects, automatically scrolling to match cards and triggering purchase dialogs.
* 🏟️ **Fixture Schedule & Results**: Comprehensive fixture list displaying competitions, venue details, kickoff times, and dynamic availability badges (*Available*, *Selling Fast*, *Low Stock*, *Sold Out*).
* 🅿️ **Stadium Parking Management (`/parking`)**: Real-time stadium parking space availability, vehicle registration, and unparking workflows powered by `parking-service` & PostgreSQL.
* 🔐 **Member Authentication & Security**: Member registration, login, Spring Security JWT issuance, edge JWT validation in `api-gateway`, and automatic downstream `X-User-Name` header injection.
* ⚡ **Event-Driven Kafka Architecture**: Asynchronous domain event stream publishing on `ticket-events` and `payment-events` Kafka topics, consumed by `members-service` and `parking-service` for cross-service event processing.

---

## 🛠️ Current Technology Stack

### 🎨 Frontend (`quinscc-web`)
* **Framework**: React 19 (`react`, `react-dom` v19.2)
* **Build Tool & Bundler**: Vite 8 (`vite` v8.1) + `@vitejs/plugin-react` (React Compiler enabled)
* **Language**: TypeScript 6 (`typescript` ~6.0)
* **Global State Management**: Zustand (`zustand` v5.0)
* **Data Fetching & Cache**: TanStack React Query (`@tanstack/react-query` v5.101)
* **HTTP Client**: Axios (`axios` v1.18) with Vite dev-server `/api` proxy configuration
* **Form Handling & Validation**: React Hook Form (`react-hook-form` v7.82)
* **Routing**: React Router (`react-router-dom` v7.18)
* **UI Components & Carousel**: Mantine (`@mantine/core`, `@mantine/carousel` v9.4) & Phosphor Icons (`@phosphor-icons/react` v2.1)
* **Styling**: Vanilla CSS Modules & PostCSS (`postcss-preset-mantine`)
* **Unit Testing**: Vitest (`vitest` v4.1) & React Testing Library (`@testing-library/react` v16.3)
* **End-to-End (E2E) Testing**: Playwright (`@playwright/test` v1.62) with Page Object Models

---

### ⚙️ Backend (Microservices Architecture)
* **Java**: Java 21 JDK
* **Framework**: Spring Boot 3.5.3 & Spring Cloud 2025.0.1
* **Build Tool**: Gradle 8.5
* **Group**: `com.road.quinsfc`
* **Databases**: MySQL 8.0 (`quinscc_members`) and PostgreSQL 16 (`quinsfc_tickets`, `quinsfc_parking`, `quinsfc_payments`)
* **Unit & Integration Testing**: JUnit 5, Mockito, Testcontainers (PostgreSQL, MySQL, Kafka)
* **Contract Testing**: Spring Cloud Contract Verifier & Stub Runner
* **Security & Auth**: Spring Security + JWT Authentication (`io.jsonwebtoken` 0.12.6)
* **Messaging & Config Bus**: Apache Kafka (port 9092, KRaft mode)

#### Microservices Overview:
* **`config-server`** (Port `8200`): Centralized configuration management using Spring Cloud Config (`com.road.quinsfc.configserver`).
* **`eureka-server`** (Port `8100`): Service discovery & registration using Netflix Eureka (`com.road.quinsfc.eurekaserver`).
* **`api-gateway`** (Port `8080`): Gateway for routing (`/api/**`), security filtering, and CORS mapping (`com.road.quinsfc.apigateway`).
* **`members-service`**: Manages member accounts, registration (`POST /api/members/create`), login (`POST /api/members/login`), and Kafka event consumption.
* **`parking-service`**: Manages stadium parking space reservations, vehicle registrations, and payment event consumption.
* **`payment-service`**: Manages Stripe checkout sessions, payment orders, webhooks, and refund processing.
* **`tickets-service`**: Manages match ticket inventory, seat bookings, digital passes, and Kafka event streaming.

---

## 🧪 Testing & CI/CD Pipeline

The project features an end-to-end testing framework spanning UI automation, microservice unit/integration testing, inter-service API contract verification, and automated GitHub Actions CI/CD.

### ⚡ Pipeline Architecture & Parallel Execution

```mermaid
graph TB
    subgraph Trigger
        TRG["⚡ Trigger (Push / Pull Request)"]
    end

    subgraph Parallel Stages
        B1["Backend Matrix: members-service<br/>(JUnit 5 + Mockito + JaCoCo)"]
        B2["Backend Matrix: tickets-service<br/>(JUnit 5 + Mockito + JaCoCo)"]
        B3["Backend Matrix: parking-service<br/>(JUnit 5 + Mockito + JaCoCo)"]
        B4["Backend Matrix: payment-service<br/>(JUnit 5 + Mockito + JaCoCo)"]
        F1["Frontend Stage<br/>(ESLint + Vitest + Vite Production Build)"]
        E1["Playwright E2E Stage<br/>(Multi-Browser Chromium Suite on Docker)"]
    end

    subgraph Gatekeeper Stage
        CHK["Job: build ('Merge Check')<br/>Required Status Check for Branch Protection"]
    end

    TRG --> B1
    TRG --> B2
    TRG --> B3
    TRG --> B4
    TRG --> F1
    TRG --> E1

    B1 --> CHK
    B2 --> CHK
    B3 --> CHK
    B4 --> CHK
    F1 --> CHK
    E1 --> CHK
```

---

### 🏃 Running Tests Locally

#### 1. Frontend Unit Tests (Vitest)
```bash
cd quinscc-web
npm run test
```

#### 2. Frontend End-to-End Tests (Playwright)
```bash
cd quinscc-web
# Run Playwright tests in headless mode
npm run test:e2e

# Run Playwright with interactive UI mode
npm run test:e2e:ui
```

#### 3. Backend Unit & Integration Tests (Gradle)
```bash
# Run tests for a specific microservice
cd tickets-service
./gradlew test jacocoTestReport

# Run tests across all microservices
./gradlew test
```

---

### 🔒 GitHub Branch Protection & Required Status Checks

The GitHub Actions workflow ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) defines a single required status check named **`Merge Check`** under job key `build`.

To enforce this in GitHub Branch Protection:
1. Navigate to **Settings** → **Branches** → **Add branch protection rule** for `main` / `develop`.
2. Enable **Require status checks to pass before merging**.
3. Search for and select **`Merge Check`** (or `build`).
4. Save changes.

---

## 🚀 Running the Application Locally

### Prerequisites
Make sure you have the following installed on your machine:
* **Java 21 JDK** (configured in system `PATH` / `JAVA_HOME`)
* **Node.js** (v18.x or v20.x recommended) & **npm**
* **Docker / Docker Desktop** (for running local Kafka broker & PostgreSQL container via `docker compose up -d`)
* **MySQL 8.0** running locally on port `3306` (database schema `quinscc_members`)

#### Start Local Infrastructure (Kafka Broker & PostgreSQL)
Run the following command at the root of the repository to start Kafka & PostgreSQL:
```bash
docker compose up -d
```

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

# Step 6: Start Payment Service
cd ../payment-service
./gradlew bootRun

# Step 7: Start Tickets Service
cd ../tickets-service
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
* The Vite development server automatically proxies API requests matching `/api/**` (such as `/api/members/login` and `/api/tickets/availability`) to the API Gateway running at `http://localhost:8080`.

---

### 3. Frontend Commands & Scripts

Inside the web directory, the following npm scripts are available:

```bash
npm run dev      # Starts Vite local dev server with HMR
npm run test     # Runs unit tests using Vitest
npm run test:e2e # Runs Playwright E2E tests
npm run build    # Performs TypeScript type-checking and builds production bundle
npm run preview  # Previews production build locally
npm run lint     # Runs ESLint checks
```

---

## 📐 Project Structure

```
HarlequinsFC/
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI/CD Pipeline
├── api-gateway/            # Spring Cloud Gateway (Port 8080)
├── config-server/           # Spring Cloud Config Server (Port 8200)
├── eureka-server/           # Netflix Eureka Service Discovery (Port 8100)
├── members-service/         # Member Management Microservice (MySQL 8.0)
├── parking-service/         # Stadium Parking Microservice (PostgreSQL 16)
├── payment-service/         # Stripe Payment & Refund Microservice (PostgreSQL 16)
├── tickets-service/         # Match Tickets Microservice (PostgreSQL 16 + Kafka)
└── quinscc-web/             # React 19 + Vite Frontend Application
    ├── e2e/                 # Playwright E2E tests & Page Object Models
    ├── src/
    │   ├── assets/          # Static images, logos, media
    │   ├── components/      # UI components & pages (Home, Squad, Fixtures, Tickets, MyTickets, etc.)
    │   ├── hooks/           # Custom React hooks & TanStack Query mutations
    │   ├── services/        # API services and Axios clients (authApi, ticketsApi, parkingApi)
    │   ├── store/           # Zustand state management (auth store, tickets store, parking store)
    │   └── App.tsx          # Application routing setup
    ├── playwright.config.ts # Playwright test runner configuration
    └── package.json
```
