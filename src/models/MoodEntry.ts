import mongoose, { Document, Schema } from 'mongoose';

export interface IMoodEntry extends Document {
  userId: mongoose.Types.ObjectId;
  mood: number;
  emotions: string[];
  notes?: string;
  marketCondition: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  timestamp: Date;
}

const MoodEntrySchema = new Schema<IMoodEntry>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  emotions: [{
    type: String,
    required: true
  }],
  notes: {
    type: String,
    maxlength: 500
  },
  marketCondition: {
    type: String,
    enum: ['bullish', 'bearish', 'neutral'],
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.MoodEntry || mongoose.model<IMoodEntry>('MoodEntry', MoodEntrySchema);
