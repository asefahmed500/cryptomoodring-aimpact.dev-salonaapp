import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  moodEntryId: mongoose.Types.ObjectId;
  content: string;
  likes: number;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moodEntryId: {
    type: Schema.Types.ObjectId,
    ref: 'MoodEntry',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 280
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
