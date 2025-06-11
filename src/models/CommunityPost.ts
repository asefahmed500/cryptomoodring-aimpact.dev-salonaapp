import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunityPost extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  mood: number;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  cryptoSymbol?: string;
  likes: mongoose.Types.ObjectId[];
  comments: {
    userId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommunityPostSchema = new Schema<ICommunityPost>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 500 },
  mood: { type: Number, required: true, min: 1, max: 10 },
  marketSentiment: { 
    type: String, 
    enum: ['bullish', 'bearish', 'neutral'], 
    required: true 
  },
  cryptoSymbol: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 200 },
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [{ type: String }],
  isPublic: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes for efficient queries
CommunityPostSchema.index({ createdAt: -1 });
CommunityPostSchema.index({ userId: 1, createdAt: -1 });
CommunityPostSchema.index({ isPublic: 1, createdAt: -1 });

export default mongoose.models.CommunityPost || mongoose.model<ICommunityPost>('CommunityPost', CommunityPostSchema);
