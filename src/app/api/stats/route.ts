export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../lib/mongodb';
import { default as MoodEntry, IMoodEntry } from '../../../models/MoodEntry';
import PredictionModel, { IPrediction } from '../../../models/Prediction';

interface StatsResponse {
  totalMoods: number;
  totalPredictions: number;
  accuracyScore: number;
  streakDays: number;
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<StatsResponse>> {
  try {
    await dbConnect();

    const session = await getServerSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { totalMoods: 0, totalPredictions: 0, accuracyScore: 0, streakDays: 0, error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Execute all database queries in parallel for better performance
    const [totalMoods, totalPredictions, resolvedPredictions, recentMoods] = await Promise.all([
      MoodEntry.countDocuments({ userId }).exec(),
      PredictionModel.countDocuments({ userId }).exec(),
      PredictionModel.find({ userId, isResolved: true }).lean().exec() as Promise<IPrediction[]>,
      (MoodEntry as any).find({ userId })
        .sort({ timestamp: -1 })
        .limit(30)
        .lean()
        .exec() as Promise<IMoodEntry[]>
    ]);

    // Calculate accuracy score
    const accuracyScore = resolvedPredictions.length > 0 
      ? Math.round(
          resolvedPredictions.reduce((sum, pred) => sum + (pred.accuracy || 0), 0) / 
          resolvedPredictions.length
        )
      : 0;

    // Calculate streak days
    let streakDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < recentMoods.length; i++) {
      const moodDate = new Date(recentMoods[i].timestamp);
      moodDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (moodDate.getTime() === expectedDate.getTime()) {
        streakDays++;
      } else {
        break;
      }
    }

    return NextResponse.json({
      totalMoods,
      totalPredictions,
      accuracyScore,
      streakDays
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { 
        totalMoods: 0, 
        totalPredictions: 0, 
        accuracyScore: 0, 
        streakDays: 0, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}