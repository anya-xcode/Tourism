import Reel, { IReel } from '../models/Reel';
import CloudinaryConfig from '../config/cloudinary';
import mongoose from 'mongoose';
import { AppError } from '../middleware/error';

export class ReelService {
  private cloudinary = CloudinaryConfig.getInstance().getCloudinary();

  async uploadReel(
    file: Express.Multer.File,
    userId: string,
    placeId: string,
    caption: string
  ): Promise<IReel> {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const uploadRes: any = await this.cloudinary.uploader.upload(dataURI, {
      resource_type: 'video',
      folder: 'tourism/reels',
      eager: [
        { width: 300, height: 300, crop: "pad", audio_codec: "none" }
      ],
      eager_async: true
    });

    const thumbnailUrl = uploadRes.eager ? uploadRes.eager[0].secure_url : '';

    const reel = await Reel.create({
      userId: new mongoose.Types.ObjectId(userId),
      placeId: new mongoose.Types.ObjectId(placeId),
      videoUrl: uploadRes.secure_url,
      cloudinaryPublicId: uploadRes.public_id,
      caption,
      thumbnailUrl,
    });

    return reel;
  }

  async getReelsFeed(page: number = 1, limit: number = 10): Promise<IReel[]> {
    return Reel.find()
      .populate('userId', 'name avatar')
      .populate('placeId', 'name city')
      .sort('-views -createdAt')
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async toggleLike(reelId: string, userId: string): Promise<{ liked: boolean; likes: number }> {
    const reel = await Reel.findById(reelId);
    if (!reel) throw new AppError('Reel not found', 404);

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const likeIndex = reel.likedBy.indexOf(userObjectId);

    let liked = false;
    if (likeIndex === -1) {
      reel.likedBy.push(userObjectId);
      reel.likes += 1;
      liked = true;
    } else {
      reel.likedBy.splice(likeIndex, 1);
      reel.likes -= 1;
      liked = false;
    }

    await reel.save();
    return { liked, likes: reel.likes };
  }

  async incrementViews(reelId: string): Promise<void> {
    await Reel.findByIdAndUpdate(reelId, { $inc: { views: 1 } });
  }
}
