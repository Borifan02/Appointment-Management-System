import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database', error);
    process.exit(1);
  });
