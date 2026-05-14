# React Store - Full-Stack E-commerce Application

A complete e-commerce store built with React (frontend) and Node.js + Express + SQLite (backend).

## Features

### Frontend
- Modern React application with TypeScript
- Responsive design with Tailwind CSS
- Product catalog with search and filtering
- Shopping cart functionality
- User authentication (JWT)
- Admin panel for managing products, orders, and users
- Favorites system
- Order checkout process

### Backend
- RESTful API built with Node.js and Express
- SQLite database for data persistence
- JWT authentication with role-based access
- Password hashing with bcrypt
- Input validation and error handling
- File upload support
- Admin notifications system

## Tech Stack

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- Lucide React for icons

### Backend
- Node.js
- Express.js
- SQLite3
- JWT for authentication
- bcryptjs for password hashing
- Winston for logging
- express-validator for input validation
- CORS support

## Project Structure

```
react-store/
├── my-app/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth, Cart, Favorites)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── ui/             # UI components
│   │   └── data/           # Static data (initially)
│   ├── package.json
│   └── .env
├── server/                 # Backend Node.js application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── database/       # Database initialization and models
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── .env
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
DB_PATH=./database/store.db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@store.com
ADMIN_PASSWORD=admin123
```

4. Initialize the database and seed data:
```bash
npm run init-db
npm run seed
```

5. Start the backend server:
```bash
npm run dev  # Development mode with nodemon
# or
npm start    # Production mode
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
VITE_API_URL=http://localhost:5000/api
# Firebase config (if using Firebase features)
VITE_FIREBASE_API_KEY=your_firebase_api_key
# ... other Firebase config
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with pagination, filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders or all orders (admin)
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status (admin)
- `DELETE /api/orders/:id` - Delete order (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item quantity
- `DELETE /api/cart/item/:product_id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Reviews
- `GET /api/reviews/product/:product_id` - Get product reviews
- `GET /api/reviews/user` - Get user's reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/notifications` - Get admin notifications
- `PATCH /api/admin/notifications/:id/read` - Mark notification as read
- `DELETE /api/admin/notifications/:id` - Delete notification

### Contacts
- `POST /api/contacts` - Send contact message
- `GET /api/contacts` - Get all contacts (admin)
- `PATCH /api/contacts/:id/read` - Mark contact as read (admin)
- `DELETE /api/contacts/:id` - Delete contact (admin)

## Database Schema

The application uses SQLite with the following main tables:

- `users` - User accounts
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Order line items
- `cart` - Shopping cart items
- `reviews` - Product reviews
- `contacts` - Contact form submissions
- `admin_notifications` - Admin notifications

## Default Admin Account

After running the seed script, you can login as admin with:
- Email: `admin@store.com`
- Password: `admin123`

## Development

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd my-app
npm test
```

### Building for Production

#### Backend
```bash
cd server
npm run build
```

#### Frontend
```bash
cd my-app
npm run build
```

### Database Management

#### Initialize Database
```bash
cd server
npm run init-db
```

#### Seed Database
```bash
cd server
npm run seed
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.
