import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import Database from './config/database';
import CloudinaryConfig from './config/cloudinary';
import Logger from './config/Logger';
import ConfigManager from './config/ConfigManager';
import ServiceFactory from './patterns/ServiceFactory';
import { errorHandler } from './middleware/error';
import routes from './routes';

const app = express();
const config = ConfigManager.getInstance();
const logger = Logger.getInstance();
const PORT = process.env.PORT || config.getPort();

// Connect to Database (Singleton)
Database.getInstance().connect();

// Configure Cloudinary (Singleton)
CloudinaryConfig.getInstance().configure();

// Initialize Observer pattern — wire default notification listeners
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
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Travel Explorer API is running' });
});

// Error Handling Middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT} in ${config.getNodeEnv()} mode`, 'Server');
  });
}

export default app;
