// src/models/CommunityPost.ts
import mongoose, { Document, Model } from 'mongoose';

// Interface for CommunityPost document
export interface ICommunityPost extends Document {
  userId: string;
  username: string;
  content: string;
  mood: number;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  cryptoSymbol?: string;
  tags: string[];
  likes: string[];
  comments: {
    id: string;
    userId: string;
    username: string;
    content: string;
    createdAt: Date;
  }[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommunityPostSchema = new mongoose.Schema<ICommunityPost>({
  userId: { 
    type: String, 
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  content: { 
    type: String, 
    required: true, 
    maxlength: 500,
    trim: true
  },
  mood: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 10 
  },
  marketSentiment: {
    type: String,
    enum: ['bullish', 'bearish', 'neutral'],
    required: true
  },
  cryptoSymbol: { 
    type: String,
    uppercase: true,
    trim: true
  },
  tags: [{ 
    type: String,
    trim: true,
    lowercase: true
  }],
  likes: [{ 
    type: String // userId of users who liked
  }],
  comments: [{
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    userId: { 
      type: String, 
      required: true 
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    content: { 
      type: String, 
      required: true, 
      maxlength: 200,
      trim: true
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  isPublic: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
CommunityPostSchema.index({ createdAt: -1 });
CommunityPostSchema.index({ userId: 1, createdAt: -1 });
CommunityPostSchema.index({ isPublic: 1, createdAt: -1 });
CommunityPostSchema.index({ tags: 1 });
CommunityPostSchema.index({ cryptoSymbol: 1 });

// Virtual for comment count
CommunityPostSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for like count
CommunityPostSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Method to check if user liked the post
CommunityPostSchema.methods.isLikedBy = function(userId: string) {
  return this.likes.includes(userId);
};

// Method to add like
CommunityPostSchema.methods.addLike = function(userId: string) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
  }
  return this.save();
};

// Method to remove like
CommunityPostSchema.methods.removeLike = function(userId: string) {
  this.likes = this.likes.filter((id: string) => id !== userId);
  return this.save();
};

// Method to add comment
CommunityPostSchema.methods.addComment = function(userId: string, username: string, content: string) {
  this.comments.push({
    id: new mongoose.Types.ObjectId().toString(),
    userId,
    username,
    content: content.trim(),
    createdAt: new Date()
  });
  return this.save();
};

// Define model type
type CommunityPostModel = Model<ICommunityPost>;

// Create and export model
const CommunityPost: CommunityPostModel = 
  (mongoose.models.CommunityPost as CommunityPostModel) || 
  mongoose.model<ICommunityPost>('CommunityPost', CommunityPostSchema);

export default CommunityPost;