import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import Database from '../src/config/database';
import CloudinaryConfig from '../src/config/cloudinary';
import Logger from '../src/config/Logger';
import ConfigManager from '../src/config/ConfigManager';
import ServiceFactory from '../src/patterns/ServiceFactory';
import { errorHandler } from '../src/middleware/error';
import routes from '../src/routes';

const app = express();
const config = ConfigManager.getInstance();
const logger = Logger.getInstance();

// Connect to Database (Singleton)
Database.getInstance().connect();

// Configure Cloudinary (Singleton)
CloudinaryConfig.getInstance().configure();

// Initialize Observer pattern
ServiceFactory.getInstance().initializeObservers();

logger.info('All singletons initialized successfully', 'Bootstrap');

// Configure CORS based on environment variable
const corsOptions = {
  origin: process.env.CORS_ORIGIN || [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.use('/api', routes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Travel Explorer API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Travel Explorer API' });
});

// Error Handling Middleware
app.use(errorHandler);

export default app;
