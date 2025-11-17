# Academic Paper Organiser 📚

A full-stack web application for organizing and managing academic research papers with user authentication, paper management, and advanced database features.

## Features ✨

- **User Authentication**: Secure registration and login with JWT tokens
- **Admin Portal**: Dedicated admin login with full system management capabilities
- **User Management**: Admin can add, edit, and delete user accounts
- **Paper Management**: Add, view, edit, and organize academic papers
- **Admin Dashboard**: Manage all users and papers with CRUD operations
- **Author & Tag System**: Link papers with authors and categorize with tags
- **References Tracking**: Maintain paper citations and references
- **Search by Year**: Search papers by publication year
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
│   │   ├── AdminLoginScreen.jsx
│   │   ├── AdminDashboard.jsx
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
- `POST /api/auth/login` - Login user (returns is_admin flag)

### Papers
- `GET /api/papers` - Get all papers
- `GET /api/papers/:id` - Get single paper details
- `POST /api/papers` - Create new paper (requires auth)
- `PUT /api/papers/:id` - Update paper (requires auth, owner only)
- `DELETE /api/papers/:id` - Delete paper (requires auth, owner only)
- `GET /api/papers/search/:keyword` - Search papers by keyword or year
- `GET /api/users/:id/papers` - Get user's papers

### Admin Endpoints (require admin token)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get single user
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user (cannot delete admin)
- `GET /api/admin/papers` - Get all papers with user details
- `PUT /api/admin/papers/:id` - Update any paper
- `DELETE /api/admin/papers/:id` - Delete any paper

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
- 1 Admin User (email: `admin@example.com`, password: `password123`)
- 5 Authors
- 5 Tags
- 5 Papers with associated authors, tags, and references

## Usage Guide 📖

### Regular User
1. Register a new account at `/register`
2. Login with your credentials at `/login`
3. Browse existing papers on the dashboard
4. Add your own papers using the "Add Paper" button
5. Search papers by title, author, tags, or year

### Admin User
1. Click "Login as Admin" on the login page
2. Login with admin credentials:
   - **Email**: `admin@example.com`
   - **Password**: `password123`
3. Access the admin dashboard with two tabs:
   - **Users Management**: Add, edit, delete users
   - **Papers Management**: Edit, delete any paper in the system
4. Admin cannot delete other admin accounts (protected)

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
- `is_admin` column in Users table (BOOLEAN, default FALSE)
- `paper_count` column in Users table (INT, auto-incremented by trigger)
- Year-based search functionality in SearchPapers stored procedure
- All necessary triggers, procedures, and functions

**Note**: The `init.sql` migration file is kept for reference, but the main SQL file includes all schema changes.

## Future Enhancements 🚀

- [x] Admin dashboard ✅
- [x] Paper editing functionality ✅
- [x] Search by year ✅
- [ ] File upload for PDFs
- [ ] Advanced search and filtering
- [ ] Paper recommendations
- [ ] Export citations
- [ ] Email verification
- [ ] User profile management

## License 📄

MIT License

## Contributors 👥

Developed as part of DBMS Mini Project - Semester 5

---

**Happy Organizing! 🎓**
