# NexusTech – IT Solutions & ATS Recruitment Platform

TechNova is a full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed for an IT solutions provider. It features a complete corporate website experience alongside a robust Admin Portal and an automated Applicant Tracking System (ATS) resume matcher.

## Key Features

- **Automated ATS Resume Matcher:** Parses uploaded candidate resumes (PDFs) and scores them against job requirements using custom keyword/skill matching logic.
- **Admin Management Portal:** Secure dashboard to manage job postings, candidate applications, team members, services, client testimonials, blogs, and FAQs with role-based JWT authentication.
- **Dynamic Content & Blog System:** Full CRUD operations for publishing engineering articles, company updates, and client success stories.
- **Interactive SPA Experience:** Responsive, modern UI styled with custom modules and high-contrast design.

## Tech Stack

- **Frontend:** React.js, Vite, React Router, CSS Modules
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT)
- **Database:** MongoDB, Mongoose
- **Libraries/Tools:** `pdf2json` for resume text parsing, Git & GitHub

## Getting Started & Installation

Follow these instructions to run the project locally on your machine.

### Prerequisites
- Node.js installed on your system
- MongoDB running locally or via MongoDB Atlas

### 1. Clone the Repository
git clone https://github.com/priyanshi-2608/nexustech-it-solutions/edit/main/README.md
cd Nexustech

### 2. Setup Backend
cd backend
npm install

Create a `.env` file inside the `backend` folder and add your configuration:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Start the backend server:
npm run dev

### 3. Setup Frontend
Open a new terminal window, navigate to the frontend folder, and install dependencies:
cd frontend
npm install
npm run dev
