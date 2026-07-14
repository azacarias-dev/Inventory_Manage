# Servicio de Autenticación - Microservicio Inventory Manage

Este microservicio maneja la autenticación de usuarios, registro, gestión de perfiles y autorización basada en roles para el ecosistema de Inventory Manage.

## 🚀 Tecnologías Utilizadas
* **Framework:** .NET 8 (ASP.NET Core Web API)
* **Arquitectura:** Arquitectura Limpia (Clean Architecture: Api, Application, Domain, Persistence)
* **Lenguaje:** C#
* **Autenticación:** JWT (JSON Web Tokens)
* **Documentación de API:** Swagger/OpenAPI

## 📦 Estructura del Proyecto
El proyecto sigue el enfoque de Arquitectura Limpia (Clean Architecture):
* `AuthService.Api`: Punto de entrada, Controladores y configuración de inyección de dependencias.
* `AuthService.Application`: Lógica de negocio, casos de uso, interfaces y DTOs.
* `AuthService.Domain`: Reglas y entidades centrales del dominio.
* `AuthService.Persistence`: Contexto de base de datos, migraciones e implementaciones de repositorios.

## 🔌 Endpoints de la API

### Autenticación `api/v1/auth`
* `POST /api/v1/auth/register`: Registra un nuevo usuario.
* `POST /api/v1/auth/login`: Autentica un usuario y recibe un JWT.
* `POST /api/v1/auth/verify-email`: Verifica la dirección de correo electrónico de un usuario.
* `GET /api/v1/auth/profile`: Obtiene el perfil del usuario autenticado actualmente.
* `GET /api/v1/auth/profile/{id}`: Obtiene el perfil de un usuario específico por su ID.

### Gestión `api/v1/management`
* `GET /api/v1/management/admins`: Obtiene una lista de usuarios administradores.
* `GET /api/v1/management/users`: Obtiene una lista de usuarios regulares.

### Prueba de Correo `api/emailtest`
* `POST /api/emailtest/send-welcome`: Envía un correo de prueba de bienvenida.

## 🏃 Cómo Ejecutarlo Localmente

1. **Navega al directorio del servicio:**
   ```bash
   cd service-auth
   ```
2. **Restaura las dependencias:**
   ```bash
   dotnet restore
   ```
3. **Configura las variables de entorno:**
   Asegúrate de que tu archivo `appsettings.Development.json` tenga las cadenas de conexión a la base de datos correctas y las llaves secretas para JWT.
4. **Aplica las migraciones de base de datos (si aplica):**
   ```bash
   cd src/AuthService.Persistence
   dotnet ef database update --startup-project ../AuthService.Api
   ```
5. **Ejecuta la aplicación:**
   ```bash
   cd ../AuthService.Api
   dotnet run
   ```
6. **Accede a la interfaz de Swagger:**
   Navega a `https://localhost:<puerto>/swagger` o `http://localhost:<puerto>/swagger` en tu navegador para probar los endpoints interactivamente.
