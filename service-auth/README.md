# Auth Service - Inventory Manage Microservice

This microservice handles user authentication, registration, profile management, and role-based authorization for the Inventory Manage ecosystem.

## 🚀 Technologies Used
* **Framework:** .NET 8 (ASP.NET Core Web API)
* **Architecture:** Clean Architecture (Api, Application, Domain, Persistence)
* **Language:** C#
* **Authentication:** JWT (JSON Web Tokens)
* **API Documentation:** Swagger/OpenAPI

## 📦 Project Structure
The project follows a Clean Architecture approach:
* `AuthService.Api`: Entry point, Controllers, and dependency injection setup.
* `AuthService.Application`: Business logic, use cases, interfaces, and DTOs.
* `AuthService.Domain`: Core domain entities and rules.
* `AuthService.Persistence`: Database context, migrations, and repository implementations.

## 🔌 API Endpoints

### Auth `api/v1/auth`
* `POST /api/v1/auth/register`: Register a new user.
* `POST /api/v1/auth/login`: Authenticate a user and receive a JWT.
* `POST /api/v1/auth/verify-email`: Verify a user's email address.
* `GET /api/v1/auth/profile`: Get the profile of the currently authenticated user.
* `GET /api/v1/auth/profile/{id}`: Get the profile of a specific user by ID.

### Management `api/v1/management`
* `GET /api/v1/management/admins`: Retrieve a list of admin users.
* `GET /api/v1/management/users`: Retrieve a list of regular users.

### Email Test `api/emailtest`
* `POST /api/emailtest/send-welcome`: Send a welcome test email.

## 🏃 How to Run Locally

1. **Navigate to the service directory:**
   ```bash
   cd service-auth
   ```
2. **Restore dependencies:**
   ```bash
   dotnet restore
   ```
3. **Set up configurations:**
   Ensure your `appsettings.Development.json` has the correct database connection strings and JWT secret keys.
4. **Apply Database Migrations (if applicable):**
   ```bash
   cd src/AuthService.Persistence
   dotnet ef database update --startup-project ../AuthService.Api
   ```
5. **Run the application:**
   ```bash
   cd ../AuthService.Api
   dotnet run
   ```
6. **Access Swagger UI:**
   Navigate to `https://localhost:<port>/swagger` or `http://localhost:<port>/swagger` in your browser to test the endpoints interactively.
