import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../types';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: UserRole;
  preferences: string[];
  city: string;
  googleId?: string;
  /** Synthetic account created by the dev seed; the UI labels its contributions */
  isSample: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: '' },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    preferences: [{ type: String }],
    city: { type: String, default: '' },
    googleId: { type: String, default: null },
    isSample: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    // Never send the password hash (or googleId) to clients
    toJSON: {
      transform: (_doc, ret: Record<string, any>) => {
        delete ret.password;
        delete ret.googleId;
        return ret;
      },
    },
  }
);

UserSchema.index({ city: 1 });

export default mongoose.model<IUser>('User', UserSchema);
