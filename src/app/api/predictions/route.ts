// src/app/api/predictions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../lib/mongodb';
import Prediction from '../../../models/Prediction';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { symbol, direction, confidence, targetPrice, timeframe, reasoning } = await request.json();

    // Validation
    if (!symbol || !direction || !confidence || !timeframe || !reasoning) {
      return NextResponse.json(
        { message: 'Missing required fields: symbol, direction, confidence, timeframe, reasoning' },
        { status: 400 }
      );
    }

    if (!['up', 'down'].includes(direction)) {
      return NextResponse.json(
        { message: 'Direction must be either "up" or "down"' },
        { status: 400 }
      );
    }

    if (confidence < 1 || confidence > 10) {
      return NextResponse.json(
        { message: 'Confidence must be between 1 and 10' },
        { status: 400 }
      );
    }

    if (!['1h', '4h', '1d', '1w', '1m'].includes(timeframe)) {
      return NextResponse.json(
        { message: 'Invalid timeframe' },
        { status: 400 }
      );
    }

    const prediction = await Prediction.create({
      userId: session.user.email, // Using email as userId since that's what NextAuth provides
      symbol: symbol.toUpperCase(),
      direction,
      confidence: parseInt(confidence),
      targetPrice: targetPrice ? parseFloat(targetPrice) : undefined,
      timeframe,
      reasoning: reasoning.trim()
    });

    return NextResponse.json(prediction, { status: 201 });
  } catch (error) {
    console.error('Create prediction error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const predictions = await Prediction.find({ userId: session.user.email })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(predictions);
  } catch (error) {
    console.error('Get predictions error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}