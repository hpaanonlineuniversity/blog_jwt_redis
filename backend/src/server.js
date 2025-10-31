// server.js
import express from 'express';
import connectDB from './configs/db.js';
import redisClient from './configs/redis.js';
import userRoutes from './routes/user_route.js';
import authRoutes from './routes/auth_route.js';
import postRoutes from './routes/post_route.js';
import commentRoutes from './routes/comment_route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createDefaultAdmin } from './utils/createdefaultadmin.js';

const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://frontend:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
};

const app = new express();
const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World! - JWT with Redis Blacklist');
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check Redis connection
    await redisClient.set('health-check', 'ok', 10);
    const redisStatus = await redisClient.get('health-check');
    
    res.json({
      status: 'OK',
      redis: redisStatus === 'ok' ? 'connected' : 'error',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      redis: 'disconnected',
      error: error.message
    });
  }
});

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
    console.log(`✅ JWT with Redis Blacklist implementation`);
    createDefaultAdmin();
  }); 
}).catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1);
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});