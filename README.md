# ⛽ Fuel Finder App

The **Fuel Finder App** is a web-based platform designed to help drivers locate nearby fuel stations based on availability, fuel type, and location. It supports station owners, system administrators, and government fuel price regulators through role-based access.

## 🚀 Features

- 🔍 Search for nearby fuel stations by location
- 🟢 Live fuel availability status (Petrol/Diesel)
- 📊 Fuel station ratings and reviews
- 📌 Mark favorite stations
- 🧾 Fuel price set by government reps
- 🧑‍💼 Station owner and staff management
- 📬 Email verification & OTP login system
- 🗺️ Interactive Map with PostGIS integration


## 🧑‍💻 Tech Stack

- Node.js
- Express.js
- PostgreSQL with PostGIS
- Sequelize ORM
- JWT Authentication
- Nodemailer (for OTP email verification)


### Deployment
- Render (Backend & PostgresDB)


### Prerequisites
- Node.js
- PostgreSQL
- Git


## 📦 Installation

### Backend Setup

```bash
git clone https://github.com/EBAS-TECH/Fuel-Finder_BackEnd.git
cd Fuel-Finder_BackEnd
npm install
cp .env.example .env
# Edit .env file for DB and secret keys
npm run dev
```

---

## 🔐 Roles & Permissions

| Role              | Description                   |
| ----------------- | ----------------------------- |
| Admin             | System-wide control           |
| Gas Station Owner | Manages their station's data  |
| Fuel Minister Rep | Get stations report   |
| Driver            | Searches & bookmarks stations |

---

## 📍 Location & Mapping

* PostGIS stores latitude & longitude data
* Haversine formula or PostGIS queries used to calculate nearby stations

---
## 🗂 Project Structure 

```bash
FUEL-FINDER_BACKEND/
├── node_modules/                 # Installed Node.js dependencies
├── public/                       # Publicly accessible assets (like images, logos)
│   └── logo.png                  # Logo for branding or UI use
├── src/                          # Source code of the application
│
│   ├── config/                   # Configuration settings and setup files
│   │   └── db.js                 # PostgreSQL connection setup using Sequelize
│
│   ├── controllers/              # Express route controllers (business logic)
│   │   ├── authController.js            # Login, signup, OTP verification logic
│   │   ├── favoriteController.js        # Manage user-favorited stations
│   │   ├── feedbackController.js        # Handles feedback and user messages
│   │   ├── fuelAvailabilityController.js # Handles fuel availability per station
│   │   ├── fuelPriceController.js       # For setting/getting fuel prices
│   │   ├── generalCommentController.js  # Manages general station comments
│   │   ├── stationController.js         # CRUD for fuel stations
│   │   └── userController.js            # User CRUD operations
│
│   ├── data/                     # Database migration, seeders, and utilities
│   │   ├── seed/                        # Seed data to populate tables
│   │   │   ├── FavoriteSeedData.js     # Predefined favorites for testing
│   │   │   ├── feedbackSeedData.js     # Example feedback entries
│   │   │   ├── fuelAvailabilitySeedData.js # Petrol/Diesel seed data
│   │   │   ├── seedData.js             # General data initializer
│   │   │   └── seedStationAndUser.js   # Inserts users and stations at once
│   │   ├── alter_column.js             # Alters DB columns (e.g., data type change)
│   │   ├── data.sql                    # Raw SQL for initial database setup
│   │   ├── emailVerification.js        # OTP/token verification logic
│   │   ├── enablePostGis.js            # Enables PostGIS for geo queries
│   │   ├── favoriteTable.js            # Schema for user favorite stations
│   │   ├── feedbackTable.js            # Schema for feedback entries
│   │   ├── fuelAvailability.js         # Schema for fuel availability
│   │   ├── fuelPrice.js                # Schema for storing government fuel prices
│   │   ├── generalCommentTable.js      # Schema for general comments
│   │   ├── setupDatabase.js            # Entry point to run all migrations
│   │   ├── stationTable.js             # Schema for gas/electric stations
│   │   └── userTable.js                # Schema for different user roles
│
│   ├── middlewares/             # Express middleware for handling validation/auth
│   │   ├── authorizeRole.js            # Checks if user has permission for a route
│   │   ├── errorHandler.js             # Centralized error response formatting
│   │   ├── protectRoute.js             # Protects routes with JWT
│   │   ├── stationInputValidation.js   # Validates station inputs (name, lat, long)
│   │   ├── upload.js                   # Handles file uploads (e.g., station images)
│   │   └── userInputValidator.js       # Validates user input (email, password)
│
│   ├── routes/                  # Express route definitions and endpoints
│   │   ├── authRoutes.js               # Routes for /api/auth/
│   │   ├── authorizeRoute.js           # Routes for role-based access
│   │   ├── feedbackRoute.js            # Routes for feedback submission
│   │   ├── fuelAvailabilityRoute.js    # Routes for /fuel-availability
│   │   ├── fuelPriceRoute.js           # Routes for /fuel-price management
│   │   ├── generalCommentRoute.js      # General comment routes
│   │   ├── stationRoutes.js            # Station CRUD API routes
│   │   └── userRoutes.js               # Routes for managing users
│
│   ├── service/                 # Services for handling business logic
│   │   ├── emailVerificationService.js # Service to verify email tokens
│   │   ├── favoriteService.js          # Logic for managing favorites
│   │   ├── feedbackService.js          # Logic for feedback submissions
│   │   ├── fuelAvailabilityService.js  # Core logic for fuel status
│   │   ├── fuelPriceService.js         # Fuel price management logic
│   │   ├── generalCommentService.js    # Logic to manage general comments
│   │   ├── stationService.js           # Logic for station operations
│   │   └── userService.js              # Logic for user operations
│
│   └── utils/                   # Utility files shared across modules
│       ├── docs/                       # Developer documentation (e.g., API specs)
│       ├── emailNotification/         # Functions for sending emails
│       ├── genericService.js          # Utility for common DB/service operations
│       ├── generateToken.js           # Generates JWT tokens
│       └── index.js                   # Entry point for all utilities
│
├── .dockerignore               # Files and folders Docker should ignore
├── .env                        # Environment-specific configuration (secret keys)
├── .gitignore                  # Git should ignore these files
├── docker-commands.txt         # Helpful Docker CLI commands
├── docker-compose.yml          # Multi-container Docker orchestration file
├── Dockerfile                  # Instructions to build the backend image
├── package-lock.json           # Locked versions of installed packages
├── package.json                # Project metadata and dependencies
└── README.md                   # This file
````

📌 API Endpoints (Sample)
POST /api/auth/signup – Register user

POST /api/auth/login – Login

GET /api/stations – List all stations

GET /api/stations/:id – Get station detail

POST /api/fuel-availability – Update fuel data

POST /api/favorite/:stationId – Add to favorites


## 📮 Contact

**Solomon Bekele**
[GitHub](https://github.com/SolomonBekele) | [Email](solubman28@gmail.com)

---

