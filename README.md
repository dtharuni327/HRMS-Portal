**User Registration API (Node.js + TypeScript)**

**Description**

This project provides a REST API for User Registration using:
  *Node.js
  *Express.js
  *TypeScript
  *MySQL
Users can register with name, email, and password, and the data is securely stored in the database.

**Features**
  *User Registration API
  *Password hashing using bcrypt
  *MySQL database integration
  *Clean project structure (MVC pattern)
  *Environment variable support using dotenv

**Project Structure**

project-root/
│
├── src/
│   ├── config/
│   │   └── db.ts
│   │
│   ├── controllers/
│   │   └── user.controller.ts
│   │
│   ├── models/
│   │   └── user.model.ts
│   │
│   ├── routes/
│   │   └── user.routes.ts
│   │
│   ├── services/
│   │   └── user.service.ts
│   │
│   ├── types/
│   │   └── user.types.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── package.json
├── tsconfig.json


**Database Setup**
Table : user_auth_db

Columns:

Name
Email
Password

**API Endpoints**

Register:
Post/register
Sample Request :{"name" : "Kiruthika", "email" : "kiri@gmail.com", "password" : "123456"}


Login:
Post/login
Sample request - {"email" : "kiri@gmail.com", "password" : "123456"}
