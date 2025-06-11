// src/app/api/predictions/resolve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../../lib/mongodb';
import Prediction from '../../../../models/Prediction';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { predictionId, actualPrice, isCorrect } = await request.json();

    // Validation
    if (!predictionId || actualPrice === undefined || isCorrect === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields: predictionId, actualPrice, isCorrect' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(predictionId)) {
      return NextResponse.json(
        { message: 'Invalid prediction ID' },
        { status: 400 }
      );
    }

    if (typeof actualPrice !== 'number' || actualPrice <= 0) {
      return NextResponse.json(
        { message: 'Actual price must be a positive number' },
        { status: 400 }
      );
    }

    if (typeof isCorrect !== 'boolean') {
      return NextResponse.json(
        { message: 'isCorrect must be a boolean' },
        { status: 400 }
      );
    }

    // Find and update the prediction
    const prediction = await Prediction.findOneAndUpdate(
      { 
        _id: predictionId, 
        userId: session.user.email,
        status: 'pending' // Only allow resolving pending predictions
      },
      {
        actualPrice: parseFloat(actualPrice.toString()),
        status: isCorrect ? 'correct' : 'incorrect',
        resolvedAt: new Date()
      },
      { new: true }
    );

    if (!prediction) {
      return NextResponse.json(
        { message: 'Prediction not found or already resolved' },
        { status: 404 }
      );
    }

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Resolve prediction error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}