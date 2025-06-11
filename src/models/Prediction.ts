// src/models/Prediction.ts
import mongoose, { Document, Model } from "mongoose";

// 1. Define interface for Prediction document
export interface IPrediction extends Document {
  accuracy?: number;
  userId: string;
  symbol: string;
  direction: "up" | "down";
  confidence: number;
  targetPrice?: number;
  timeframe: "1h" | "4h" | "1d" | "1w" | "1m";
  reasoning: string;
  status: "pending" | "correct" | "incorrect";
  actualPrice?: number;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define schema
const PredictionSchema = new mongoose.Schema<IPrediction>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    direction: {
      type: String,
      required: true,
      enum: ["up", "down"],
    },
    confidence: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    targetPrice: {
      type: Number,
      required: false,
      min: 0,
    },
    timeframe: {
      type: String,
      required: true,
      enum: ["1h", "4h", "1d", "1w", "1m"],
    },
    reasoning: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "correct", "incorrect"],
    },
    actualPrice: {
      type: Number,
      required: false,
      min: 0,
    },
    resolvedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add compound indexes for better query performance
PredictionSchema.index({ userId: 1, createdAt: -1 });
PredictionSchema.index({ userId: 1, status: 1 });
PredictionSchema.index({ userId: 1, symbol: 1 });

// Add virtual for prediction accuracy calculation
PredictionSchema.virtual("isResolved").get(function () {
  return this.status !== "pending";
});

// Add method to calculate if prediction was correct based on direction and prices
PredictionSchema.methods.calculateCorrectness = function (
  currentPrice: number
) {
  if (!this.targetPrice) return null;

  if (this.direction === "up") {
    return currentPrice >= this.targetPrice;
  } else {
    return currentPrice <= this.targetPrice;
  }
};

// 3. Define model type
type PredictionModel = Model<IPrediction>;

// 4. Create and export model
const Prediction: PredictionModel =
  (mongoose.models.Prediction as PredictionModel) ||
  mongoose.model<IPrediction>("Prediction", PredictionSchema);

export default Prediction;
