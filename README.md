# 🚀 Agents & Task Management System

A scalable full-stack web application for managing agents and distributing tasks efficiently using automated logic. Built with **MERN + TypeScript + Tailwind CSS**, featuring role-based access, bulk task processing, and a modern dashboard UI.

---

## 🌐 Live Demo

Frontend: https://agents-and-task-management-v1.vercel.app  
Backend: https://agentsandtaskmanagement-v1.onrender.com  

---

## 📌 Overview

This system solves real-world task allocation problems in team environments.

Admins can:
- Manage agents
- Upload tasks in bulk (CSV/XLSX)
- Automatically distribute tasks
- Monitor workflows

Agents can:
- Access only assigned tasks
- View personal dashboard

---

## ✨ Core Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access (Admin / Agent)
- Protected API routes

---

### 👨‍💼 Admin Capabilities
- Create / deactivate agents
- Create / delete admins
- Upload tasks via CSV / XLSX
- Automatic task distribution
- Delete individual / all tasks
- Monitor agents & tasks

---

### 👨‍💻 Agent Capabilities
- Secure login
- Personal dashboard
- View assigned tasks only
- Profile management

---

### 📂 Task Management
- Bulk upload support (CSV, XLSX)
- File validation (headers + schema)
- Balanced distribution algorithm
- Automatic reassignment

---

## 🧠 Task Distribution Logic

Balanced **round-robin algorithm**:

- Tasks divided equally among active agents
- Extra tasks distributed sequentially
- Rebalancing happens when agents deactivate

Example:
25 Tasks + 5 Agents → Each gets 5 tasks


---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- TypeScript
- JWT Authentication
- Multer (file upload)
- Joi (validation)

### Database
- MongoDB
- Mongoose

---

## 🏗 Project Structure
```
project-root/
│
├── backend/
│ ├── controllers/
│ ├── services/
│ ├── models/
│ ├── routes/
│ ├── validators/
│ └── utils/
│
├── frontend/
│ ├── components/
│ ├── pages/
│ ├── api/
│ ├── context/
│ └── layout/
│
└── README.md
```


---

## ⚙️ Environment Variables

### Backend `.env`
```
NODE_ENV=production
PORT=5000

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/Vivek-DK/AgentsAndTaskManagement-v1.git
cd AgentsAndTaskManagement-v1
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```
Build for production:

```
npm run build
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📦 File Upload Format

Supported formats:
- `.csv`
- `.xlsx`

Required headers:
FirstName, Phone, Notes

---

## 🔌 API Overview

### Auth

POST /api/auth/login

### Agents

GET /api/agents
POST /api/agents
DELETE /api/agents/:id

### Tasks

GET /api/tasks/my-tasks
GET /api/upload/tasks
DELETE /api/tasks/:id
DELETE /api/tasks

### Upload

POST /api/upload

---

## 🔐 Security

- JWT Authentication  
- Role-Based Access Control  
- Rate Limiting  
- Input Validation (Joi)  
- MongoDB Sanitization  

---

## 🎯 UI/UX Highlights

- Glassmorphism UI  
- Fully Responsive Design  
- Smooth Animations  
- Loading States & Feedback  
- Real-time UI Updates  

---

## 📸 Screenshots

### Landing Page
![image alt](https://github.com/Vivek-DK/AgentsAndTaskManagement-v1/blob/95e0df4b0e26cc387d45b054645e9b8c97cb3969/project_images/landing_page.png)

---
### Admin Dashboard
![image alt](https://github.com/Vivek-DK/AgentsAndTaskManagement-v1/blob/95e0df4b0e26cc387d45b054645e9b8c97cb3969/project_images/Agent-dashboard.png)

---
### Agent Dashboard
![image alt](https://github.com/Vivek-DK/AgentsAndTaskManagement-v1/blob/95e0df4b0e26cc387d45b054645e9b8c97cb3969/project_images/Agent-dashboard.png)


---

## 📈 Future Improvements

- Task Status Tracking  
- Notification System  
- Analytics Dashboard  
- Pagination & Performance Optimization  
- Agent Performance Metrics  

---

## 👨‍💻 Author

**Vivek DK**  
Full Stack Developer  

Tech Stack:  
React • Node.js • MongoDB • TypeScript  

---

## ⭐ Support

If you found this project useful:

- ⭐ Star the repository  
- 🍴 Fork the repository  