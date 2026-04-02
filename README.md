# Finance Dashboard Backend

## Overview
This project is a complete backend API for a finance dashboard application. It provides a secure, role-based system for managing users, tracking financial records (income and expenses), and viewing summarized financial data and trends. It is built with a modern tech stack and follows best practices for API development.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ORM**: Prisma
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Validation**: Zod

## Setup Instructions
1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd finance-dashboard-backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    -   Create a `.env` file in the root directory by copying the `.env.example` file.
    -   Fill in the required values, especially your `DATABASE_URL`.
4.  **Generate Prisma Client:**
    This command generates the Prisma client based on your schema. It's also included in the `npm run dev` script.
    ```bash
    npx prisma generate
    ```
5.  **Seed the database:**
    This will populate the database with initial test data (3 users and 20 financial records).
    ```bash
    npx prisma db seed
    ```
6.  **Run the development server:**
    ```bash
    npm run dev
    ```
7.  The server will start and be accessible at `http://localhost:3000` (or the port specified in your `.env` file).

## Environment Variables
The following variables must be set in your `.env` file:

| Variable         | Description                                             | Example                                                              |
| ---------------- | ------------------------------------------------------- | -------------------------------------------------------------------- |
| `DATABASE_URL`   | The connection string for your MongoDB database.        | `mongodb+srv://user:password@cluster.mongodb.net/finance_db?retryWrites=true&w=majority` |
| `JWT_SECRET`     | A secret key for signing JWT tokens.                    | `your_super_secret_and_long_jwt_key`                                 |
| `JWT_EXPIRES_IN` | The expiration time for JWT tokens.                     | `7d`                                                                 |
| `PORT`           | The port on which the server will run.                  | `3000`                                                               |
| `NODE_ENV`       | The application environment.                            | `development`                                                        |

## API Endpoints

### Auth
| Method | Endpoint             | Role Required | Description               |
| ------ | -------------------- | ------------- | ------------------------- |
| `POST` | `/api/auth/register` | Public        | Register a new user.      |
| `POST` | `/api/auth/login`    | Public        | Log in and receive a JWT. |

### Users
| Method   | Endpoint          | Role Required | Description                               |
| -------- | ----------------- | ------------- | ----------------------------------------- |
| `GET`    | `/api/users`      | ADMIN         | Get a paginated list of all users.        |
| `GET`    | `/api/users/:id`  | ADMIN         | Get a single user by their ID.            |
| `PATCH`  | `/api/users/:id`  | ADMIN         | Update a user's details, role, or status. |
| `DELETE` | `/api/users/:id`  | ADMIN         | Soft delete (deactivate) a user.          |

### Financial Records
| Method   | Endpoint            | Role Required   | Description                                      |
| -------- | ------------------- | --------------- | ------------------------------------------------ |
| `POST`   | `/api/records`      | ADMIN           | Create a new financial record.                   |
| `GET`    | `/api/records`      | ADMIN, ANALYST  | Get a paginated and filterable list of records.  |
| `GET`    | `/api/records/:id`  | ADMIN, ANALYST  | Get a single financial record by its ID.         |
| `PATCH`  | `/api/records/:id`  | ADMIN           | Update a financial record.                       |
| `DELETE` | `/api/records/:id`  | ADMIN           | Soft delete a financial record.                  |

### Dashboard
| Method | Endpoint                    | Role Required  | Description                                      |
| ------ | --------------------------- | -------------- | ------------------------------------------------ |
| `GET`  | `/api/dashboard/summary`    | ADMIN, ANALYST | Get a summary of totals (income, expense, etc.). |
| `GET`  | `/api/dashboard/by-category`| ADMIN, ANALYST | Get totals grouped by category and type.         |
| `GET`  | `/api/dashboard/trends`     | ADMIN, ANALYST | Get income/expense trends by week or month.      |
| `GET`  | `/api/dashboard/recent`     | ADMIN, ANALYST | Get the 10 most recent financial records.        |

## Role Permissions
| Role    | Register/Login | View Records | Create/Edit/Delete Records | View Dashboard | Manage Users |
|---------|:--------------:|:------------:|:--------------------------:|:--------------:|:------------:|
| VIEWER  | ✅             | ❌           | ❌                         | ❌             | ❌           |
| ANALYST | ✅             | ✅           | ❌                         | ✅             | ❌           |
| ADMIN   | ✅             | ✅           | ✅                         | ✅             | ✅           |

## Request and Response Examples

### Login (`POST /api/auth/login`)
**Request Body:**
```json
{
    "email": "admin@finance.com",
    "password": "admin123"
}
```
**Success Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "...",
            "name": "Admin User",
            "email": "admin@finance.com",
            "role": "ADMIN",
            "status": "ACTIVE"
        },
        "token": "ey..."
    }
}
```

### Create Record (`POST /api/records`)
**Request Body:**
```json
{
    "amount": 7500,
    "type": "INCOME",
    "category": "Consulting",
    "date": "2024-05-20"
}
```
**Success Response (201 Created):**
```json
{
    "success": true,
    "data": {
        "id": "...",
        "amount": 7500,
        "type": "INCOME",
        "category": "Consulting",
        "date": "2024-05-20T00:00:00.000Z",
        "notes": null,
        "createdById": "...",
        "isDeleted": false
    }
}
```

### Get Dashboard Summary (`GET /api/dashboard/summary`)
**Request:** (No body, just requires Bearer Token)
**Success Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "total_income": 550000,
        "total_expenses": 230000,
        "net_balance": 320000,
        "total_records": 20
    }
}
```

## Assumptions Made
- **Single Currency:** All financial amounts are treated as being in a single, unspecified currency.
- **Date Only:** The `date` field on financial records is treated as a date, not a full datetime with timestamp.
- **JWT Expiration:** JWT tokens are configured to expire in 7 days.
- **Soft Deletes:** Users are deactivated (soft deleted) and financial records are marked as deleted but never removed from the database, preserving data integrity.

## Tradeoffs and Design Decisions
- **Prisma ORM:** Chosen for its strong typing and ease of use with TypeScript, which helps prevent common database-related errors.
- **Zod for Validation:** Used for schema-based input validation on the server side, ensuring data integrity before it reaches the service layer. This provides clear, detailed error messages for developers.
- **Role-Based Access Control (RBAC):** Implemented via middleware to centralize and simplify security logic, making it easy to protect endpoints and manage permissions.

