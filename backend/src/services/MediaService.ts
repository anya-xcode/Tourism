import Media, { IMedia } from '../models/Media';
import CloudinaryConfig from '../config/cloudinary';
import { MediaType, CloudinaryResponse } from '../types';
import mongoose from 'mongoose';
import { AppError } from '../middleware/error';

export class MediaService {
  private cloudinary = CloudinaryConfig.getInstance().getCloudinary();

  async uploadMedia(
    file: Express.Multer.File,
    userId: string,
    placeId: string,
    type: MediaType,
    caption?: string
  ): Promise<IMedia> {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const resourceType = type === MediaType.VIDEO ? 'video' : 'image';
    
    // Using explicit any for upload response as cloudinary types can be tricky
    const uploadRes: any = await this.cloudinary.uploader.upload(dataURI, {
      resource_type: resourceType,
      folder: `tourism/${placeId}/${resourceType}s`,
    });

    const media = await Media.create({
      userId: new mongoose.Types.ObjectId(userId),
      placeId: new mongoose.Types.ObjectId(placeId),
      type,
      url: uploadRes.secure_url,
      cloudinaryPublicId: uploadRes.public_id,
      caption,
    });

    return media;
  }

  async getMediaByPlace(placeId: string): Promise<IMedia[]> {
    return Media.find({ placeId }).sort('-createdAt');
  }

  async deleteMedia(mediaId: string): Promise<void> {
    const media = await Media.findById(mediaId);
    if (!media) throw new AppError('Media not found', 404);

    await this.cloudinary.uploader.destroy(media.cloudinaryPublicId, {
      resource_type: media.type === MediaType.VIDEO ? 'video' : 'image',
    });
    
    await media.deleteOne();
  }
}
