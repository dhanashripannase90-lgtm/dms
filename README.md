# Document Management System (DMS)

A comprehensive Document Management System built with a Spring Boot backend and a React frontend. This system allows users to securely upload, manage, search, and download documents, with an administrative layer for user and system management.

## 🚀 Features

### Core Functionality
- **Secure File Upload**: Support for various file types with a 10MB limit.
- **Document Management**: Update metadata, replace existing files, or delete documents.
- **Advanced Search & Filtering**: Search documents by file name or filter by categories.
- **Secure Downloads**: Role-based access to download documents.

### User & Security
- **Authentication**: JWT-based secure login and registration.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `ADMIN` and `USER` roles.
- **User Management**: Admins can view all users, delete accounts, and manage roles.
- **Dashboards**: Personalized dashboards for users and a comprehensive dashboard for administrators.

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.4.2
- **Language**: Java 17
- **Security**: Spring Security with JSON Web Token (JWT)
- **Database**: MySQL
- **ORM**: Spring Data JPA (Hibernate)
- **Utilities**: Lombok, Jakarta Validation

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS & Bootstrap 5
- **Routing**: React Router Dom 7
- **API Client**: Axios

## 📂 Project Structure

```text
dishuproject/
├── backend/                # Spring Boot Application
│   ├── src/main/java/      # Java Source Code
│   ├── src/main/resources/ # Configuration & Assets
│   └── pom.xml             # Maven Dependencies
├── frontend/               # React Application
│   ├── src/                # Frontend Source Code
│   ├── public/             # Static Assets
│   ├── index.html          # Entry HTML
│   └── package.json        # NPM Dependencies
└── README.md               # Project Documentation
```

## ⚙️ Configuration & Setup

### Prerequisites
- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher
- **Database**: MySQL 8.x

### Backend Setup
1. Navigate to the `backend` directory.
2. Update `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start at `http://localhost:8080`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (or the port shown in your terminal).

## 📊 Data Model

### User Entity
- `id`: Primary Key
- `name`: Full name of the user
- `email`: Unique login identifier
- `role`: `ADMIN` or `USER`

### Document Entity
- `id`: Primary Key
- `fileName`: Original name of the uploaded file
- `category`: User-defined category (e.g., Personal, Work, Invoice)
- `description`: Optional notes about the document
- `uploadedBy`: Reference to the User entity

## 🛣️ API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and receive JWT

### Documents
- `GET /api/documents` - List all documents (supports search/filter)
- `POST /api/documents/upload` - Upload a new file
- `GET /api/documents/my` - Get documents uploaded by current user
- `PUT /api/documents/{id}` - Update document metadata
- `DELETE /api/documents/{id}` - Delete a document

### Administration
- `GET /api/users` - List all registered users
- `PUT /api/users/{id}/role` - Update a user's role
- `GET /api/documents/user/{email}` - View documents for a specific user

## 📄 License
This project is private and for internal use only.
