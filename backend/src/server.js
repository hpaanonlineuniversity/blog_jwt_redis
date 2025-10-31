import express from 'express';
import connectDB from './configs/db.js';
import userRoutes from './routes/user_route.js';
import authRoutes from './routes/auth_route.js';
import postRoutes from './routes/post_route.js';
import commentRoutes from './routes/comment_route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createDefaultAdmin } from './utils/createdefaultadmin.js';


const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173', 
      'http://frontend:5173',
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // ✅ ဒါအရေးကြီးတယ်
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Cookie' // ✅ ဒါထည့်ကြည့်ပါ
  ],
  exposedHeaders: ['Set-Cookie'], // ✅ ဒါလည်းထည့်ပါ
  optionsSuccessStatus: 200
};


const app = new express();
const PORT = process.env.PORT || 3000;

//CORS middleware
app.use(cors(corsOptions));

// JSON payload limit တိုးပါ
app.use(express.json({ limit: '10mb' })); // Default: 100kb
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Hello World!123');
});

connectDB().then(() => {
        // '0.0.0.0' ကို explicitly bind လုပ်ပါ
      app.listen(PORT, '0.0.0.0', () => {
          console.log(`✅ Server is running on http://0.0.0.0:${PORT}`);
          console.log(`✅ Accessible via http://localhost:${PORT}`);
          createDefaultAdmin();
      }); 
}).catch((err) => {
  console.error('Database connection failed:', err);
  process.exit(1); // Exit process with failure
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