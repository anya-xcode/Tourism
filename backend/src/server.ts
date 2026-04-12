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
const PORT = config.getPort();

// Connect to Database (Singleton)
Database.getInstance().connect();

// Configure Cloudinary (Singleton)
CloudinaryConfig.getInstance().configure();

// Initialize Observer pattern — wire default notification listeners
ServiceFactory.getInstance().initializeObservers();

logger.info('All singletons initialized successfully', 'Bootstrap');

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
  logger.info(`🚀 Server running on port ${PORT} in ${config.getNodeEnv()} mode`, 'Server');
});
