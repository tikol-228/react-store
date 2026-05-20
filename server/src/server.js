import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import winston from 'winston';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categories.js';
import cartRoutes from './routes/cart.js';
import reviewRoutes from './routes/reviews.js';
import contactRoutes from './routes/contacts.js';
import adminRoutes from './routes/admin.js';

// Import database initialization
import { initDatabase } from './db/init.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { loggerMiddleware } from './middleware/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://web-production-acff8.up.railway.app',
];

const corsOrigins = process.env.FRONTEND_URL
  ? [
      ...defaultOrigins,
      ...process.env.FRONTEND_URL.split(',').map((o) => o.trim()).filter(Boolean),
    ]
  : defaultOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (corsOrigins.includes(origin)) return callback(null, true);
      if (origin.endsWith('.up.railway.app')) return callback(null, true);
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(loggerMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start HTTP first so Railway healthcheck passes, then init DB + seed
async function bootstrap() {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database: ${process.env.DB_PATH || 'default path'}`);
    console.log(`CORS origins: ${corsOrigins.join(', ')}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `\nPort ${PORT} is already in use (EADDRINUSE).\n` +
          `Stop the old API process: npm run kill-api-port\n` +
          `Or find it: lsof -i :${PORT}\n`
      );
      process.exit(1);
    }
    throw err;
  });

  try {
    const { seedDatabase } = await import('./db/seed.js');
    await initDatabase();
    if (process.env.RUN_SEED !== 'false') {
      await seedDatabase();
    }
    console.log('Database ready');
  } catch (error) {
    console.error('Database bootstrap failed:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});