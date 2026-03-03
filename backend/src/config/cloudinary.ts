import { v2 as cloudinary } from 'cloudinary';

/**
 * Singleton Pattern — Cloudinary Configuration
 * Ensures Cloudinary is configured only once.
 */
class CloudinaryConfig {
  private static instance: CloudinaryConfig;
  private isConfigured: boolean = false;

  private constructor() {}

  public static getInstance(): CloudinaryConfig {
    if (!CloudinaryConfig.instance) {
      CloudinaryConfig.instance = new CloudinaryConfig();
    }
    return CloudinaryConfig.instance;
  }

  public configure(): void {
    if (this.isConfigured) return;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    this.isConfigured = true;
    console.log('☁️ Cloudinary configured successfully');
  }

  public getCloudinary() {
    if (!this.isConfigured) {
      this.configure();
    }
    return cloudinary;
  }
}

export default CloudinaryConfig;
