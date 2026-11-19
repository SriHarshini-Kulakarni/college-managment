# CollegePro – College Management System

A responsive, frontend-only college administration dashboard built with HTML5, CSS3 and vanilla JavaScript.

## Features
- Dashboard with student, faculty, course and department statistics
- Student CRUD: add, edit, delete, search and filter
- Faculty CRUD and department assignment
- Course creation, faculty assignment and filtering
- Department management
- Daily attendance marking (Present / Absent / Not marked)
- Weekly timetable management
- Reports and CSV exports, plus full JSON backup
- Login/register demo flow
- Dark mode and responsive sidebar
- Data persistence using browser `localStorage`

## Run locally
1. Extract `CollegePro_Project.zip`.
2. Open `index.html` in a modern browser.
3. Sign in with the demo account:
   - Email: `admin@collegepro.edu`
   - Password: `admin123`

No server or database is required.

## Files
- `index.html` – application structure
- `style.css` – layout, colors and responsive styles
- `script.js` – sample data, CRUD logic, attendance, reports and localStorage

## Important project notes
This is an educational frontend demonstration. Authentication is simulated in the browser, and passwords/accounts are stored locally for demonstration only. It is not secure production authentication. Data is stored in the current browser's localStorage and is not shared between users or devices. CSV export is implemented in the browser; PDF export and server-side services are not included.
