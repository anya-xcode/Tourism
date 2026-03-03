import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import Database from './config/database';
import CloudinaryConfig from './config/cloudinary';
import { errorHandler } from './middleware/error';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (Singleton)
Database.getInstance().connect();

// Configure Cloudinary (Singleton)
CloudinaryConfig.getInstance().configure();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Travel Explorer API is running' });
});

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
