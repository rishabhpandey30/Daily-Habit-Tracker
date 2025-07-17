# MERN Stack Daily Habit Tracker

A full-stack web application built with the MERN (MongoDB, Express.js, React.js, Node.js) stack to help users track their daily habits, monitor progress, and build streaks.

## ✨ Features

*   **User Authentication:** Secure registration and login for individual users.
*   **Habit Management:**
    *   Create new habits with a name, description, and preferred time (Morning, Afternoon, Evening, Night, or Anytime).
    *   Mark habits as completed for a specific day.
    *   Edit existing habit details.
    *   Delete habits.
*   **Progress Tracking:**
    *   Daily summary of completed habits vs. total habits.
    *   Calculation and display of "Max Streak" across all habits.
*   **Calendar View:**
    *   Dedicated "Progress & Calendar" page to visualize habit completion on a monthly calendar.
    *   Select specific dates on the calendar to see progress for that day.
*   **Responsive Design:** Optimized for various screen sizes (desktop, tablet, mobile).
*   **User Profile Page:** A dedicated section for user-specific information.

## 🚀 Technologies Used

**Frontend:**
*   React.js
*   React Router DOM
*   Axios (for API calls)
*   Plain CSS for styling

**Backend:**
*   Node.js
*   Express.js
*   MongoDB (via Mongoose ODM)
*   JSON Web Tokens (JWT) for authentication
*   Bcrypt.js for password hashing
*   CORS for cross-origin requests

## 🛠️ Setup Instructions

Follow these steps to get the project up and running on your local machine.

### Prerequisites

*   Node.js (v14 or higher recommended)
*   npm (Node Package Manager) or Yarn
*   MongoDB (local installation or a cloud service like MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-repository-name>
```

### 2. Backend Setup

Navigate into the `backend` directory, install dependencies, and set up environment variables.

```bash
cd backend
npm install # or yarn install
```

Create a `.env` file in the `backend` directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_very_secret_key_for_jwt
FRONTEND_URL=http://localhost:3000 # Will be your deployed frontend URL in production
```

*   Replace `your_mongodb_connection_string` with your MongoDB connection URI (e.g., from MongoDB Atlas).
*   Replace `a_very_secret_key_for_jwt` with a strong, random string.

### 3. Frontend Setup

Navigate into the `frontend` directory and install dependencies.

```bash
cd ../frontend
npm install # or yarn install
```

Create a `.env` file in the `frontend` directory with the following variable:

```
REACT_APP_BACKEND_URL=http://localhost:5000/api # Will be your deployed backend URL in production
```

## ▶️ Running the Application

### 1. Start the Backend Server

From the `backend` directory:

```bash
npm start # or yarn start
```
The backend server will run on `http://localhost:5000`.

### 2. Start the Frontend Development Server

From the `frontend` directory:

```bash
npm start # or yarn start
```
The frontend application will open in your browser, usually at `http://localhost:3000`.

## 🚀 Deployment

This project is designed for deployment to cloud platforms.

*   **Frontend (React.js):** Can be easily deployed to platforms like [Vercel](https://vercel.com/) or Netlify. Remember to set the `REACT_APP_BACKEND_URL` environment variable on your chosen platform to point to your deployed backend API.
*   **Backend (Node.js/Express & MongoDB):** Can be deployed to a Platform as a Service (PaaS) like [Render](https://render.com/), [Railway](https://railway.app/), or Heroku. You will need to configure `MONGO_URI`, `JWT_SECRET`, and `FRONTEND_URL` environment variables on your backend hosting platform. MongoDB Atlas is recommended for cloud-hosted MongoDB.

---

Feel free to contribute or suggest improvements!
```
