import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'streak' | 'accuracy' | 'social' | 'milestone' | 'special';
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt: Date;
  metadata?: any;
}

const AchievementSchema = new Schema<IAchievement>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['streak', 'accuracy', 'social', 'milestone', 'special'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: {
    type: Number,
    default: 10
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  metadata: Schema.Types.Mixed
}, {
  timestamps: true
});

AchievementSchema.index({ userId: 1, unlockedAt: -1 });

export default mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);
