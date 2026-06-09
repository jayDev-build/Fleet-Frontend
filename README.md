# 🚚 TruckKhata (Fleet Management System) — Frontend

Welcome to the frontend application for **TruckKhata**, a modern, responsive fleet and transport management Single Page Application (SPA). Built using **React 19**, **Vite**, and **Tailwind CSS**, this interface empowers fleet operators and managers to seamlessly monitor real-time transport logs, coordinate drivers and trucks, log trip-related expenses, and manage financial settlements with third-party vehicle owners.

Designed with a sleek, mobile-first dashboard and a premium dark-themed navigation system, TruckKhata brings intuitive logistics tracking to desktop and mobile devices.

---

## 🌟 Key Features

TruckKhata Frontend delivers an interactive user experience with the following core modules:

*   **📊 Unified Financial Dashboard:**
    *   **At-a-Glance Metrics:** Track total trips, active trips, total freight earnings, completed trip profits (booked profit), and ongoing trip profits (estimated profit).
    *   **Recent Trips Ledger:** Quick preview table (desktop) or card list (mobile) showing recent trips with direct access to details.
*   **🛣️ Trip Lifecycle Management:**
    *   Create new trips specifying drivers, vehicles, source, destination, freight price, owner rate, and start date.
    *   Manage active trips and close them (mark as completed) to settle balances.
    *   Detailed view showing trip status timelines, mapped assets, and custom financial breakdowns.
*   **💸 Expense Bookkeeping:**
    *   Log trip expenses instantly under standard categories: **Diesel**, **Toll**, **Driver Allowance**, and **Other**.
    *   Edit existing expense parameters or delete incorrect logs.
*   **🚛 Vehicle & Owner Ledgers:**
    *   **Asset Management:** Track registered vehicles and active drivers.
    *   **Owner Balance Sheets:** Double-entry ledger screens for third-party vehicle owners. Monitor total rental dues, advances, payouts, and net outstanding balances.
    *   Record new advances or custom payments with specific transaction dates and descriptions.
*   **🔐 JWT Session & Security Interceptors:**
    *   Auto-attaches user JWT authentication tokens from cookies to outgoing API requests.
    *   Handles session expirations (401 Unauthorized status) gracefully by routing users back to the secure login window.

---

## 🛠️ Tech Stack & Dependencies

*   **Framework Library:** [React 19](https://react.dev/)
*   **Development Server / Build Tool:** [Vite 8](https://vite.dev/) (with Hot Module Replacement)
*   **Styling Engine:** [Tailwind CSS v3](https://tailwindcss.com/)
*   **Routing System:** [React Router DOM v7](https://reactrouter.com/)
*   **Icons Set:** [Lucide React](https://lucide.dev/)
*   **HTTP Service Client:** [Axios](https://axios-http.com/)

---

## 📁 Directory & Code Structure

```bash
src/
├── assets/             # Static visual media assets (logos, fallback images)
├── components/         # Modular interface blocks and page layouts
│   ├── LoginPage.jsx        # Login & Signup screen
│   ├── DashBoard.jsx        # Analytics dashboard with metric cards
│   ├── Sidebar.jsx          # Desktop sidebar navigation (dark slate theme)
│   ├── MobileFooter.jsx     # Mobile bottom sticky navigation bar
│   ├── AllTrips.jsx         # Ledger view for all logistics trips
│   ├── TripDetails.jsx      # Details, status actions, and expenses for a trip
│   ├── AddTrip.jsx          # New trip scheduler form
│   ├── AllVehicles.jsx      # List of trucks/vehicles
│   ├── AddVehicle.jsx       # Truck onboarding form (maps to owner)
│   ├── AllDrivers.jsx       # List of active drivers
│   ├── AddDriver.jsx        # Driver profile onboarding form
│   ├── AllOwners.jsx        # Directory of third-party truck owners
│   ├── AddOwner.jsx         # Truck owner onboarding form
│   ├── OwnerBalanceSheet.jsx# Transaction ledger and payout statements
│   ├── AddPayment.jsx       # Advance / Payment record form
│   ├── AddExpense.jsx       # Log trip expense
│   ├── EditExpense.jsx      # Modify trip expense entries
│   └── Settings.jsx         # User profile manager configuration
├── service/            # Core HTTP client infrastructure
│   └── api.js               # Centralized Axios instance with request/response interceptors
├── App.jsx             # React root sub-component placeholder
├── index.css           # Global Tailwind directives and base styles
└── main.jsx            # Entrypoint declaring routing rules and application initialization
```

---

## ⚙️ Environment Configuration

To link the frontend to the backend REST API, create a `.env` file in the root folder of the project.

```env
# Backend REST API endpoint url base
VITE_BACKEND_URL=http://localhost:8080/api/v1
```

*Note: In production environments, replace the localhost URL with the deployed backend API domain (e.g. on Railway, AWS, or Heroku).*

---

## 🚀 Getting Started

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended) before proceeding.

### 1. Install Dependencies
Run the command below in the project directory to install all package requirements:
```bash
npm install
```

### 2. Launch Development Server
Start the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will start, usually accessible at: [http://localhost:5173](http://localhost:5173).

### 3. Build for Production
Create an optimized production bundle inside the `dist` folder:
```bash
npm run build
```

### 4. Preview Production Build
Locally preview the generated production files:
```bash
npm run preview
```

---

## 🔒 Session & Authentication Architecture

Authentication is fully cookie-based. Here is how the security layer in [src/service/api.js](file:///c:/YASHIT/SpringBoot/Fleet-Frontend/src/service/api.js) operates:

1.  **Request Interceptor:**
    Every API call automatically inspects the document cookies for a `token` entry. If present, it attaches it to the request headers:
    ```javascript
    config.headers.Authorization = tokenValue;
    ```
2.  **Response Interceptor:**
    If a request fails with an HTTP `401 Unauthorized` status (indicating an expired or invalid session), the application immediately redirects the user's browser back to the `/login` route:
    ```javascript
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    ```

---

## 🤝 Backend Connection

This frontend is designed to work in tandem with the **Fleet Management System (Spring Boot Backend)**. Make sure your Spring Boot server is running on `http://localhost:8080` (or your configured `VITE_BACKEND_URL`) before performing CRUD actions or trying to log in.
