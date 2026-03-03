import mongoose from 'mongoose';

/**
 * Singleton Pattern — Database Connection
 * Ensures only one MongoDB connection instance exists throughout the app lifecycle.
 */
class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('⚡ Using existing database connection');
      return;
    }

    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-explorer';
      await mongoose.connect(uri);
      this.isConnected = true;
      console.log('✅ MongoDB connected successfully');

      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
        this.isConnected = false;
      });
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    await mongoose.disconnect();
    this.isConnected = false;
    console.log('🔌 MongoDB disconnected');
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export default Database;
