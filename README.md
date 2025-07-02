# 🚚 Live Order Trucker API

A modern REST API for real-time order management built with NestJS, TypeScript, and PostgreSQL.

## 📋 Description

Live Order Trucker is a backend application that enables order management between clients and delivery drivers, featuring JWT authentication, data validation, and role-based access control.

## 🚀 Features

- **JWT Authentication** with bcrypt password encryption
- **Role-based access control** (client/delivery) with specific permissions
- **Order management** with trackable status updates
- **Robust validation** with DTOs and Joi for environment variables
- **Complete Type Safety** with TypeScript
- **Unit testing** with Jest
- **Centralized configuration** with environment variables

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator + Joi
- **Testing**: Jest
- **Encryption**: bcrypt

## 📁 Project Structure

```
src/
├── auth/              # Authentication module
│   ├── dto/           # DTOs for login/register
│   ├── guards/        # JWT and Local guards
│   └── strategies/    # Passport strategies
├── config/            # Centralized configuration
├── orders/            # Orders module
│   ├── dto/           # Validation DTOs
│   └── entities/      # TypeORM entities
├── users/             # Users module
└── types.ts           # Shared types
```

## ⚙️ Setup

### 1. Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=live_order_trucker_db

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Application
PORT=3000
```

### 2. Installation

```bash
npm install
```

### 3. Database

Make sure PostgreSQL is running and create the database:

```sql
CREATE DATABASE live_order_trucker_db;
```

## 🏃‍♂️ Running the Application

```bash
# Development
npm run start:dev

# Production
npm run start:prod

# Testing
npm test

# Testing in watch mode
npm run test:watch
```

## 📚 API Endpoints

### 🔐 Authentication

#### POST `/auth/register`
Register a new user and automatically return JWT token.

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "client" // or "delivery"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "client"
  }
}
```

#### POST `/auth/login`
Login with existing credentials.

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 📦 Orders

#### GET `/orders/:id`
Get an order by ID (public endpoint).

#### GET `/orders/user/:userId` 🔒
Get orders for a specific user.
- **Access**: Only the owner user or delivery users
- **Requires**: JWT token

#### PUT `/orders/:id/status` 🔒
Update order status.
- **Access**: Only delivery users  
- **Requires**: JWT token

```json
{
  "status": "pending" // "pending" | "in_progress" | "delivered"
}
```

## 🔒 Authentication & Authorization

### Token Usage

Include the JWT token in the Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles & Permissions

- **Client**: 
  - Can only view their own orders
  - Cannot update order status

- **Delivery**:
  - Can view orders from any user
  - Can update order status

## 🧪 Testing

The project includes unit tests for main services:

```bash
# Run all tests
npm test

# Specific tests
npm test -- orders.service.spec.ts
npm test -- users.service.spec.ts
```

**Test Coverage:**
- OrdersService: 7 tests
- UsersService: 5 tests
- Complete repository mocking
- Edge case validation

## 🔧 Data Validation

### DTOs with class-validator
- **LoginDto**: Email and password validation
- **RegisterDto**: Registration validation with roles
- **UpdateOrderStatusDto**: Order status validation

### Environment Variables with Joi
Automatic validation of all required variables on application startup.

## 🏗️ Architecture

### Applied Principles
- **Separation of Concerns**: Each module has specific responsibility
- **Type Safety**: Complete TypeScript usage with custom types
- **Dependency Injection**: NestJS pattern
- **Configuration Management**: Centralized configuration

### Implemented Patterns
- **Repository Pattern**: With TypeORM
- **Strategy Pattern**: With Passport for authentication
- **Guard Pattern**: For endpoint protection
- **DTO Pattern**: For data validation and transformation

## 🚦 Order Status Flow

```typescript
type OrderStatus = 'pending' | 'in_progress' | 'delivered'
```

- **pending**: Order created, awaiting confirmation
- **in_progress**: Order being delivered
- **delivered**: Order successfully delivered

## 📝 Development Notes

- Passwords are encrypted with bcrypt (salt rounds: 10)
- JWT tokens expire in 24 hours
- TypeORM auto-synchronization enabled (development only)
- Global pipe validation enabled
- Centralized error handling with specific exceptions
