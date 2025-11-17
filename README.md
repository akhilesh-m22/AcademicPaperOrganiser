# Academic Paper Organiser 📚

A full-stack web application for organizing and managing academic research papers with user authentication, paper management, and advanced database features.

## Features ✨

- **User Authentication**: Secure registration and login with JWT tokens
- **Paper Management**: Add, view, and organize academic papers
- **Author & Tag System**: Link papers with authors and categorize with tags
- **References Tracking**: Maintain paper citations and references
- **User Dashboard**: View all papers and personal collections
- **Responsive UI**: Modern, glassmorphic design with Tailwind CSS

## Tech Stack 🛠️

### Frontend
- React 19 with Vite
- React Router v7 for navigation
- Tailwind CSS v4 for styling
- Framer Motion for animations
- Lucide React for icons

### Backend
- Node.js with Express
- MySQL database
- JWT authentication
- Bcrypt for password hashing
- CORS enabled

## Prerequisites 📋

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **MySQL** (v8 or higher)
- **npm** or **yarn** package manager

## Installation & Setup 🚀

### 1. Clone the Repository

```bash
git clone https://github.com/akhilesh-m22/AcademicPaperOrganiser.git
cd AcademicPaperOrganiser
```

### 2. Database Setup

1. **Start MySQL server** on your machine

2. **Open MySQL Workbench** or MySQL command line

3. **Run the main SQL file** to create database and tables:
   ```bash
   mysql -u root -p < server/sql/AcademicPaperOrganiser.sql
   ```
   
   Or in MySQL Workbench:
   - Open `server/sql/AcademicPaperOrganiser.sql`
   - Execute the entire script (this will create the database, tables, triggers, procedures, and sample data)

4. **Verify the setup**:
   ```sql
   USE AcademicPaperOrganiser;
   SHOW TABLES;
   SELECT * FROM Users;
   ```

### 3. Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - The `.env` file is already created in the server folder
   - **Update `DB_PASSWORD`** in `server/.env` with your MySQL root password:
   ```env
   DB_PASSWORD=your_mysql_password
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

   Server will run on: `http://localhost:4000`

### 4. Frontend Setup

1. Open a new terminal and navigate to project root:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

   Frontend will run on: `http://localhost:5173`

## Running the Application 🎯

1. **Start MySQL** service
2. **Start Backend**: `cd server && npm start`
3. **Start Frontend**: `npm run dev` (in root directory)
4. **Open browser**: Navigate to `http://localhost:5173`

## Project Structure 📁

```
AcademicPaperOrganiser/
├── server/                    # Backend application
│   ├── db.js                  # Database connection
│   ├── index.js               # Express server & API routes
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables
│   ├── sql/
│   │   └── AcademicPaperOrganiser.sql  # Main database schema
│   └── migrations/
│       └── init.sql           # Migration file (not needed if using main SQL)
├── src/                       # Frontend application
│   ├── main.jsx               # App entry point
│   ├── App.jsx                # Main app component with routes
│   ├── screens/               # Page components
│   │   ├── LoginScreen.jsx
│   │   ├── RegistrationScreen.jsx
│   │   ├── userDashboard.jsx
│   │   ├── addPaperScreen.jsx
│   │   ├── userPapersScreen.jsx
│   │   └── paperDetailsScreen.jsx
│   ├── components/
│   │   └── ui/                # Reusable UI components
│   └── lib/
│       ├── api.js             # API client functions
│       └── utils.js           # Utility functions
├── package.json               # Frontend dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS config
└── .env                       # Frontend environment variables
```

## API Endpoints 🔌

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Papers
- `GET /api/papers` - Get all papers
- `GET /api/papers/:id` - Get single paper details
- `POST /api/papers` - Create new paper (requires auth)
- `GET /api/users/:id/papers` - Get user's papers

### Tags & Authors
- `GET /api/tags` - Get all tags
- `GET /api/authors` - Get all authors

## Database Features 🗄️

The database includes:
- **Triggers**: Auto-update timestamps, increment paper counts
- **Stored Procedures**: AddNewPaper, GetUserPapers
- **Functions**: CountUserPapers, CountPapersByTag
- **Relationships**: Many-to-many for papers-authors and papers-tags

## Default Data 📊

The SQL script includes sample data:
- 5 Users
- 5 Authors
- 5 Tags
- 5 Papers with associated authors, tags, and references

## Usage Guide 📖

### First Time Setup
1. Register a new account at `/register`
2. Login with your credentials
3. Browse existing papers on the dashboard
4. Add your own papers using the "Add Paper" button

### Adding a Paper
- Fill in the title (required)
- Add abstract, year, URL, and PDF key (optional)
- Enter author names (comma-separated)
- Add tags (comma-separated, e.g., "AI, Machine Learning, NLP")
- Add references (comma-separated paper titles)

## Troubleshooting 🔧

### Database Connection Issues
- Verify MySQL is running
- Check credentials in `server/.env`
- Ensure database `AcademicPaperOrganiser` exists

### Port Already in Use
- Backend (4000): Change `PORT` in `server/.env`
- Frontend (5173): Vite will suggest alternate port

### CORS Errors
- Ensure backend is running on port 4000
- Check `VITE_API_URL` in frontend `.env`

### Login/Registration Not Working
- Verify backend server is running
- Check browser console for errors
- Ensure database has been set up correctly

## Development Notes 💡

- Frontend uses path alias `@` for `./src` directory
- JWT tokens stored in localStorage
- Passwords hashed with bcrypt (10 rounds)
- Token expiry: 7 days
- All forms include validation and error handling

## SQL Schema Changes

The main SQL file (`server/sql/AcademicPaperOrganiser.sql`) now includes:
- `password` column in Users table (VARCHAR(255))
- `paper_count` column in Users table (INT, auto-incremented by trigger)
- All necessary triggers, procedures, and functions

**Note**: The `init.sql` migration file is no longer needed as the main SQL file includes all schema changes.

## Future Enhancements 🚀

- [ ] File upload for PDFs
- [ ] Advanced search and filtering
- [ ] Paper recommendations
- [ ] Export citations
- [ ] Admin dashboard
- [ ] Email verification
- [ ] Paper editing functionality

## License 📄

MIT License

## Contributors 👥

Developed as part of DBMS Mini Project - Semester 5

---

**Happy Organizing! 🎓**
