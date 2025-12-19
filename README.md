# Admin Panel - Full-Featured React Application

A comprehensive admin panel built with React, Vite, Redux Toolkit, Tailwind CSS, and i18next for internationalization. This application provides a complete solution for managing projects and estimations with a modern, responsive user interface.

## 🚀 Features

### Authentication
- **Login Page**: Secure login with email and password validation
- **Register Page**: User registration with form validation
- **Forgot Password**: Password reset functionality with email verification
- **Protected Routes**: Authentication-based route protection
- **Session Management**: Token-based authentication with localStorage persistence

### Dashboard Module
- **Overview Statistics**: Total projects, active projects, total estimations, and revenue
- **Data Visualization**: 
  - Pie chart showing project distribution by status
  - Bar chart displaying monthly overview of projects and estimations
- **Real-time Data**: Dynamic updates from Redux store

### Project Module
- **CRUD Operations**: Create, Read, Update, and Delete projects
- **Advanced Filtering**: 
  - Search by project name or description
  - Filter by status (Active, Planning, Completed, On Hold)
  - Sort by name, date, or budget
- **Project Management**: 
  - Project name, description, status
  - Start and end dates
  - Budget tracking
- **Mock API Integration**: Simulated backend with realistic delays

### Estimation Module
- **CRUD Operations**: Full create, read, update, and delete functionality
- **Dynamic Sections**: Add/remove sections with plus/minus icons
- **Dynamic Items**: Add/remove items within sections
- **Item Fields**:
  - Title
  - Description
  - Unit
  - Quantity
  - Price
  - Margin (percentage)
  - Total (auto-calculated)
- **Automatic Calculations**:
  - Item Total = (Quantity × Price) + (Margin % of (Quantity × Price))
  - Section Total = Sum of all item totals in the section
  - Grand Total = Sum of all section totals
- **Search & Filter**: Filter estimations by title or client name
- **Visual Display**: Organized table view with section breakdowns

### Internationalization (i18next)
- **Multi-language Support**: English (en), Spanish (es), French (fr)
- **Language Switcher**: Easy language selection in navigation bar
- **Automatic Detection**: Browser language detection
- **Complete Translation**: All UI elements translated

### Utilities & Helpers
- **Validation Functions**: Email, password, required fields, numbers, percentages
- **Formatting Functions**: Currency, dates, numbers
- **Calculation Functions**: Item totals, section totals, estimation totals
- **Mock API Service**: Simulated backend with realistic API delays

## 📁 Project Structure

```
admin-panel/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   └── Modal.jsx
│   │   └── layout/          # Layout components
│   │       ├── Navbar.jsx
│   │       └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── auth/            # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── dashboard/       # Dashboard module
│   │   │   └── Dashboard.jsx
│   │   ├── projects/        # Projects module
│   │   │   └── Projects.jsx
│   │   └── estimations/     # Estimations module
│   │       └── Estimations.jsx
│   ├── store/               # Redux store configuration
│   │   ├── index.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── projectSlice.js
│   │       └── estimationSlice.js
│   ├── utils/               # Utility functions
│   │   ├── validation.js
│   │   ├── format.js
│   │   ├── calculations.js
│   │   └── i18n.js
│   ├── constants/           # Application constants
│   │   ├── routes.js
│   │   └── api.js
│   ├── helpers/             # Helper functions
│   │   └── mockApi.js
│   ├── locales/            # i18next translation files
│   │   ├── en/
│   │   │   └── translation.json
│   │   ├── es/
│   │   │   └── translation.json
│   │   └── fr/
│   │       └── translation.json
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles with Tailwind
├── public/                  # Static assets
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🛠️ Technology Stack

- **React 19**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **Redux Toolkit**: State management
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **i18next & react-i18next**: Internationalization
- **Recharts**: Chart library for data visualization
- **React Hook Form**: Form handling (ready for use)
- **React Icons**: Icon library

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd admin-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎯 Usage

### Authentication

1. **Login**: Use any email and password (mock authentication)
   - Example: `admin@example.com` / `password123`

2. **Register**: Create a new account with name, email, and password

3. **Forgot Password**: Enter your email to receive a reset link (simulated)

### Projects Management

1. **View Projects**: Navigate to Projects from the navigation bar
2. **Create Project**: Click "Create Project" button
   - Fill in project details (name, description, status, dates, budget)
   - Click "Create" to save
3. **Edit Project**: Click the edit icon on any project row
4. **Delete Project**: Click the delete icon and confirm
5. **Filter Projects**: Use search bar and status filter

### Estimations Management

1. **View Estimations**: Navigate to Estimations from the navigation bar
2. **Create Estimation**: Click "Create Estimation" button
   - Enter estimation title and client (optional)
   - Add sections using the "+" button
   - Add items to sections using the "+" button within each section
   - Fill in item details (title, description, unit, quantity, price, margin)
   - Total is automatically calculated
3. **Edit Estimation**: Click the edit icon on any estimation card
4. **Delete Estimation**: Click the delete icon and confirm
5. **Search**: Use the search bar to filter estimations

### Language Switching

Click the language dropdown in the navigation bar to switch between:
- English (EN)
- Spanish (ES)
- French (FR)

## 🔧 Mock API

The application uses a mock API service located in `src/helpers/mockApi.js`. This simulates a real backend with:

- **Delayed Responses**: 300-500ms delays to simulate network latency
- **In-Memory Storage**: Data persists during the session
- **CRUD Operations**: Full create, read, update, delete functionality
- **Filtering & Sorting**: Server-side filtering and sorting simulation

### Mock API Endpoints

- **Authentication**:
  - `authApi.login(email, password)`
  - `authApi.register(userData)`
  - `authApi.forgotPassword(email)`

- **Projects**:
  - `projectsApi.getAll(filters)`
  - `projectsApi.getById(id)`
  - `projectsApi.create(project)`
  - `projectsApi.update(id, project)`
  - `projectsApi.delete(id)`

- **Estimations**:
  - `estimationsApi.getAll(filters)`
  - `estimationsApi.getById(id)`
  - `estimationsApi.create(estimation)`
  - `estimationsApi.update(id, estimation)`
  - `estimationsApi.delete(id)`

## 🎨 Design Choices

### Tailwind CSS
- **Why**: Modern, utility-first CSS framework
- **Benefits**: Rapid development, consistent design, responsive by default
- **Customization**: Easy to extend with custom colors and utilities

### Redux Toolkit
- **Why**: Simplified Redux with less boilerplate
- **Benefits**: Better developer experience, built-in best practices
- **Structure**: Feature-based slices for better organization

### Component Architecture
- **Reusable Components**: Common components (Button, Input, Select, Modal) for consistency
- **Page Components**: Feature-specific pages for better organization
- **Layout Components**: Shared layout elements (Navbar, ProtectedRoute)

### State Management
- **Redux for Global State**: Authentication, projects, estimations
- **Local State for UI**: Forms, modals, temporary UI states
- **Separation of Concerns**: Clear distinction between global and local state

## 📝 Code Quality

- **Modular Structure**: Well-organized folders and files
- **Reusable Utilities**: Validation, formatting, and calculation functions
- **Type Safety**: Consistent naming conventions and error handling
- **Error Handling**: Try-catch blocks and user-friendly error messages
- **Loading States**: Loading indicators for async operations
- **Form Validation**: Client-side validation with error messages

## 🚀 Future Enhancements

Potential improvements for production use:

1. **Backend Integration**: Replace mock API with real backend
2. **Authentication**: JWT tokens, refresh tokens, role-based access
3. **Data Persistence**: Database integration (PostgreSQL, MongoDB)
4. **Testing**: Unit tests, integration tests, E2E tests
5. **Performance**: Code splitting, lazy loading, memoization
6. **Accessibility**: ARIA labels, keyboard navigation
7. **Error Boundaries**: React error boundaries for better error handling
8. **Pagination**: For large datasets
9. **Export Functionality**: PDF/Excel export for estimations
10. **Real-time Updates**: WebSocket integration for live updates

## 📄 License

This project is created for evaluation purposes.

## 👤 Author

Created as part of a React.js technical assessment.

---

**Note**: This is a demonstration project with mock data. For production use, integrate with a real backend API and implement proper authentication and authorization mechanisms.
