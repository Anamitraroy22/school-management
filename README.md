School Directory  live link- https://school-management-zeta-five.vercel.app/
This project is a web application built with Next.js that functions as a simple school directory. It allows users to add, view, and manage school information through a responsive and user-friendly interface. The application uses a MySQL database for data persistence and a RESTful API to handle communication between the front-end and back-end.

Features
School Management: Create, read, update, and delete (CRUD) school records.

Responsive Design: The application is designed to work seamlessly on both mobile devices and desktops.

Client-Side Validation: The form for adding schools includes validation to ensure data integrity.

RESTful API: A robust API built with Next.js handles all data operations with the database.

Database Integration: Utilizes a MySQL database to store all school information.

Technologies Used
Framework: Next.js

Styling: Tailwind CSS

Database: MySQL

Form Management: React Hook Form

API: Next.js API Routes

Getting Started
Follow these steps to set up and run the project locally.

1. Database Setup
First, you need to set up the MySQL database and create the schools table. Connect to your MySQL server and run the following SQL command:

CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    image TEXT,
    email_id VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

2. Environment Variables
Create a .env.local file in the root of the project directory and add your database credentials.

DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=railway
DB_PORT=3306

Adjust the values to match your MySQL database configuration.

3. Install Dependencies
Navigate to the project directory in your terminal and install the required packages.

npm install

4. Run the Development Server
Start the development server.

npm run dev

The application will be accessible at http://localhost:3000.

Project Structure
The project follows the App Router structure of Next.js.

app/page.jsx: The homepage of the application.

app/addschool/page.jsx: The page with the form to add a new school.

app/showschools/page.jsx: The page that displays the list of all schools.

app/api/schools/route.js: API route for fetching and adding all schools.

app/api/schools/[id]/route.js: API route for fetching, updating, and deleting a single school by ID.

app/globals.css: Global styles using Tailwind CSS.

app/layout.jsx: The root layout for the application.


Should I add this to my portfolio or not ?

