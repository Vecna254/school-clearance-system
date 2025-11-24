# School Clearance System

A simple web-based school clearance system with a React frontend and an Express.js + MySQL backend. The app supports student registration, department clearance workflows, PDF certificate generation, and email notifications.

## Features

- Student registration and login (JWT authentication)
- Department-based clearance workflow and status tracking
- PDF certificate generation for cleared students
- Email notifications to students and departments
- Admin and department management interfaces

## Tech Stack

- Frontend: React (create-react-app), styled-components
- Backend: Node.js, Express
- Database: MySQL (mysql2)
- Auth: JSON Web Tokens (JWT)
- Other: nodemailer for email, pdfkit for PDF generation, multer for uploads

## Repository Structure

- `client/` - React frontend
- `server/` - Express backend
  - `config/` - DB & env configuration
  - `controllers/`, `models/`, `routes/` - MVC structure
  - `utils/` - mailer, pdf helpers
  - `sql/` - DB schema and seed scripts

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MySQL server

## Environment

Create a `.env` file inside the `server/` folder (do not commit `.env`). A minimal set of environment variables:

```
JWT_SECRET=your_jwt_secret_here
MYSQL_HOST=localhost
MYSQL_USER=your_db_user
MYSQL_PASSWORD=your_db_password
MYSQL_DB=your_database_name
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
APP_ORIGIN=http://localhost:3000
PORT=5000
```

Consider creating a `server/.env.example` with the same keys (without real values) for onboarding.

## Database

Run the SQL scripts in `server/sql/schema.sql` to create the database schema. Use `server/sql/seed.sql` to populate sample data if desired.

## Setup & Run (development)

1. Install server dependencies and start the server:

```bash
cd server
npm install
# create .env as above
npm run dev
```

2. Install client dependencies and start the frontend:

```bash
cd ../client
npm install
npm start
```

The frontend defaults to `http://localhost:3000` and the server to `http://localhost:5000` (adjust `APP_ORIGIN` in `.env` as needed).

## Production

- Build the client with `npm run build` inside `client/` and serve the build via a static server or integrate with the backend.
- Use `npm start` inside `server/` to run the Node server.

## Security & Notes

- Remove debug logs that leak secrets (do not log `JWT_SECRET` or other secrets).
- Ensure `.env` is in `.gitignore` and never committed.
- Prefer app-specific email passwords or a transactional email service (SendGrid, Mailgun) instead of personal Gmail credentials.
- Consider adding input validation (e.g., Joi/Zod), rate limiting, stronger token lifetimes, and a refresh-token flow for production.

## Contributing

Feel free to open issues or submit pull requests. Add tests and documentation for larger changes.

## Where to look next

- Backend entrypoint: `server/server.js`
- API routes: `server/routes/*.js`
- Frontend entry: `client/src/index.js` and `client/src/App.js`

