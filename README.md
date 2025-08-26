# Accounting System - MERN Stack

A modern, full-featured accounting system built with the MERN stack (MongoDB replaced with MySQL for better relational data handling).

## 🚀 Features

- **Modern Tech Stack**: React 18, Node.js, Express, MySQL
- **Authentication**: JWT-based authentication with secure HTTP-only cookies
- **Responsive Design**: Built with Tailwind CSS and Headless UI
- **Type Safety**: TypeScript for the frontend
- **Database**: MySQL with Sequelize ORM
- **State Management**: Zustand for client-side state
- **API**: RESTful API with proper error handling
- **Security**: Rate limiting, CORS, Helmet for security headers

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 5.7+ or MariaDB 10.3+
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd akaunting-mern
```

### 2. Install dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
npm run install-client
```

### 3. Database Setup

Create a MySQL database and user:

```sql
CREATE DATABASE akaunting;
CREATE USER 'akaunting'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON akaunting.* TO 'akaunting'@'localhost';
FLUSH PRIVILEGES;
```

Import the initial schema:

```bash
mysql -u akaunting -p akaunting < database/init-mysql.sql
```

### 4. Environment Configuration

Create a `.env` file in the root directory (copy from `env-template.txt`):

```env
# Application
NODE_ENV=development
PORT=5000
APP_NAME=Akaunting
APP_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=akaunting
DB_USERNAME=akaunting
DB_PASSWORD=your_password
DB_PREFIX=ak_

# Database Sync (set to 'true' only when you want to sync/update database schema)
SYNC_DB=false

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Email (Optional - for password resets, etc.)
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=noreply@akaunting.com
MAIL_FROM_NAME=Akaunting

# File Upload
MAX_FILE_SIZE=10485760

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. Start the Application

For development (runs both client and server concurrently):

```bash
npm run dev
```

Or run them separately:

```bash
# Start the server (port 5000)
npm run server

# Start the client (port 3000)
npm run client
```

For production:

```bash
# Build the client
npm run build

# Start the production server
npm start
```

## 🗄️ Database Management

The application now has controlled database syncing to prevent schema recreation on every restart.

### Database Setup Options:

**Option 1: Use MySQL script (Recommended for first setup)**
```bash
mysql -u root -p akaunting < database/init-mysql.sql
```

**Option 2: Use Sequelize sync (for development)**
```bash
# Sync database models once
npm run db:sync
```

### Database Sync Control:

- **Normal startup**: `npm start` or `npm run dev` - No schema sync
- **With sync**: Set `SYNC_DB=true` in `.env` or use `npm run db:sync`
- **Production**: Always use `SYNC_DB=false` to prevent accidental schema changes

### Environment Variables:

```env
# Set to 'true' only when you need to sync database schema
SYNC_DB=false
```

## 📁 Project Structure

```
akaunting-mern/
├── client/                 # React TypeScript frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand state stores
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js/Express backend
│   ├── config/             # Database and app configuration
│   ├── middleware/         # Express middleware
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   └── index.js           # Server entry point
├── database/               # Database schema and migrations
│   └── init-mysql.sql     # Initial database schema
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Core Features
- `GET|POST /api/contacts` - Manage customers/vendors
- `GET|POST /api/accounts` - Manage bank accounts
- `GET|POST /api/transactions` - Manage transactions
- `GET|POST /api/invoices` - Manage invoices
- `GET|POST /api/bills` - Manage bills
- `GET|POST /api/items` - Manage products/services
- `GET /api/reports` - Financial reports

## 🎨 Frontend Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Authentication**: Login/Register with form validation
- **Dashboard**: Overview of financial data with charts
- **Navigation**: Sidebar navigation with active states
- **Forms**: React Hook Form for form handling
- **State Management**: Zustand for global state
- **Type Safety**: Full TypeScript support

## 🔐 Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Helmet for security headers
- Input validation with express-validator
- SQL injection prevention with Sequelize ORM

## 🚀 Deployment

### Production Build

```bash
# Build the client for production
npm run build

# Set NODE_ENV to production
export NODE_ENV=production

# Start the server
npm start
```

### Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production
RUN cd client && npm ci --only=production

# Copy source code
COPY . .

# Build client
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### Environment Variables for Production

- Set `NODE_ENV=production`
- Use a strong `JWT_SECRET`
- Configure proper database credentials
- Set up proper CORS origins
- Configure email settings for notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the Business Source License 1.1 (BUSL-1.1) - see the [LICENSE.txt](LICENSE.txt) file for details.

## 🆘 Support

For support, please create an issue in the repository or contact the development team.

## 🔄 Migration from Laravel

This project is a complete rewrite of the original Laravel-based Akaunting application. Key differences:

- **Frontend**: Vue.js → React with TypeScript
- **Backend**: Laravel → Node.js/Express
- **Database**: Same MySQL schema with Sequelize ORM
- **Authentication**: Laravel Auth → JWT tokens
- **State Management**: Vuex → Zustand
- **Styling**: Bootstrap → Tailwind CSS

The database schema remains largely compatible with the original Laravel version, making data migration possible with some adjustments.

## 🗺️ Roadmap

- [ ] Complete CRUD operations for all entities
- [ ] Advanced reporting and analytics
- [ ] Multi-company support
- [ ] API documentation with Swagger
- [ ] Mobile app with React Native
- [ ] Real-time notifications
- [ ] Advanced permissions and roles
- [ ] Integration with payment gateways
- [ ] Automated testing suite
- [ ] Docker containerization