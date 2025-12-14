# Al-Kata Sweet Shop Management System

## Overview
The Al-Kata Sweet Shop Management System is a full-stack web application designed to manage inventory, sales, and user authentication for a sweet shop.

The backend is built with **Spring Boot** and uses **JWT** for secure user authentication (admin and regular user roles). The frontend is a modern, responsive single-page application (SPA) built with **React** and **Vite**.

### Key Features

* **Secure Authentication:** User registration and login protected by JSON Web Tokens (JWT).
* **User Roles:** Differentiated access control for Admins (full CRUD operations) and standard Users (view-only access).
* **Sweet Inventory Management (CRUD):** Complete Create, Read, Update, and Delete capabilities for managing product inventory.
* **Data Seeding:** Automatic initialization of sample sweet data and default user accounts upon application startup.
* **Modern Frontend:** Built on React/Vite for a fast, component-based user interface.

## Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Spring Boot 3.x | Core application framework. |
| **Security** | Spring Security, JWT | Authentication and Authorization. |
| **Database** | JPA / Hibernate | Object-Relational Mapping (ORM). |
| **Frontend** | React, Vite | Component-based UI framework and build tool. |
| **Styling** | Standard CSS / Bootstrap (or similar) | Frontend presentation layer. |

## Setup and Installation

### Prerequisites

* Java Development Kit (JDK 17 or higher)
* Node.js and npm (or yarn)
* A running database instance (e.g., H2 for local development)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Configure Database:** Update the necessary configuration file (`application.properties` or `application.yml`) with your database credentials.
3.  **Run the application:**
    ```bash
    ./mvnw spring-boot:run
    ```
    The backend typically starts on port **8080**.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the application:**
    ```bash
    npm run dev
    ```
    The frontend typically runs on port **5173**.

## My AI Usage

### AI Tools Used
* **Gemini (Flash 2.5 variant)**

### How I Used AI

* **Project History Clean-up:** Gemini provided the precise sequence of `git add -f`, `git commit -m "..."`, and `git push -f` commands required to re-write the local history into a professional, granular commit log spanning all application modules (Authentication, Sweet Management, and Frontend setup).
* **Git Configuration & Error Diagnosis:** Used Gemini to diagnose and resolve critical configuration errors, specifically the "fatal: 'origin' does not appear to be a git repository" and repository URL mismatch issues during the final push phase.
* **Technical Consulting:** Consulted the AI for correct Git syntax, including the format for the `Co-authored-by:` tag and confirming the necessity of the `git add -f` flag to override untracked files caused by `.gitignore` rules.
* **Documentation Structure:** Utilized Gemini to structure and generate this professional README, ensuring all project requirements and formatting standards were met.

### Reflection on AI Impact

The use of AI significantly enhanced the project's development quality and efficiency:

* **Improved Deliverable Quality:** The AI was crucial in transforming a messy development history into a clean, highly readable log (14+ granular commits), which is a key requirement for professional portfolio projects.
* **Time Savings in DevOps:** By automating the complex task of Git history manipulation and quickly diagnosing configuration errors, the AI substantially reduced time spent on DevOps tasks, allowing for greater focus on core business logic.
* **Enhanced Problem Solving:** The AI functioned as an effective technical partner, providing immediate, targeted solutions for system-level errors that would otherwise require extensive manual troubleshooting.
*
*Screenshots 
*
* <img width="1437" height="711" alt="Screenshot 2025-12-14 at 8 28 36 PM" src="https://github.com/user-attachments/assets/40ce2280-e877-4cec-b198-15a1bca7dd5e" />
<img width="1437" height="711" alt="Screenshot 2025-12-14 at 8 19 18 PM" src="https://github.com/user-attachments/assets/325b7dbc-af6b-4670-ae23-d4d1a809fb27" />
<img width="1437" height="711" alt="Screenshot 2025-12-14 at 8 17 41 PM" src="https://github.com/user-attachments/assets/89bd33b7-5447-4e6d-8ced-d1f8c1eab022" />





