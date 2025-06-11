import mongoose from 'mongoose';

const MoodSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  moodScore: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  emotions: [{
    type: String,
    required: true
  }],
  marketCondition: {
    type: String,
    required: true,
    enum: ['bullish', 'bearish', 'neutral', 'volatile']
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

export default mongoose.models.Mood || mongoose.model('Mood', MoodSchema);
