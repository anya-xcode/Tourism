/**
 * Singleton Pattern — Configuration Manager
 * Centralizes access to all environment variables.
 * Provides typed getters and avoids scattered process.env calls.
 */
class ConfigManager {
  private static instance: ConfigManager;

  private constructor() {}

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  // ─── Server ──────────────────────────────────────────
  public getPort(): number {
    return parseInt(process.env.PORT || '5000', 10);
  }

  public getNodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  // ─── Database ────────────────────────────────────────
  public getMongoUri(): string {
    return process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-explorer';
  }

  // ─── JWT ─────────────────────────────────────────────
  public getJwtSecret(): string {
    return process.env.JWT_SECRET || 'secret';
  }

  public getJwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '7d';
  }

  // ─── Cloudinary ──────────────────────────────────────
  public getCloudinaryCloudName(): string {
    return process.env.CLOUDINARY_CLOUD_NAME || '';
  }

  public getCloudinaryApiKey(): string {
    return process.env.CLOUDINARY_API_KEY || '';
  }

  public getCloudinaryApiSecret(): string {
    return process.env.CLOUDINARY_API_SECRET || '';
  }

  // ─── Google Maps ─────────────────────────────────────
  public getGoogleMapsApiKey(): string {
    return process.env.GOOGLE_MAPS_API_KEY || '';
  }

  // ─── Utility ─────────────────────────────────────────
  public get(key: string, defaultValue: string = ''): string {
    return process.env[key] || defaultValue;
  }

  public isProduction(): boolean {
    return this.getNodeEnv() === 'production';
  }
}

export default ConfigManager;
