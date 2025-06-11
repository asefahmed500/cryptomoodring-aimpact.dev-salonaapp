import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  description: string;
  type: string;
  startDate: Date;
  endDate: Date;
  participants: mongoose.Types.ObjectId[];
  rewards: {
    first: string;
    second: string;
    third: string;
  };
  isActive: boolean;
}

const ChallengeSchema = new Schema<IChallenge>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['mood_streak', 'prediction_accuracy', 'community_engagement']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  rewards: {
    first: {
      type: String,
      required: true
    },
    second: {
      type: String,
      required: true
    },
    third: {
      type: String,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);
