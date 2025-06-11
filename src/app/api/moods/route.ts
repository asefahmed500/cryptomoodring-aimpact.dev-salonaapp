import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Mood from '../../../models/Mood';
import { verifyAuthToken } from '../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    
    // Debug logs to see what we're getting
    console.log('Raw userId from verifyAuthToken:', userId);
    console.log('Type of userId:', typeof userId);
    console.log('Is userId a string?', typeof userId === 'string');
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Additional check to ensure userId is a string
    if (typeof userId !== 'string') {
      console.error('UserId is not a string, it is:', typeof userId, userId);
      return NextResponse.json({ message: 'Invalid user ID format' }, { status: 400 });
    }

    await dbConnect();

    const { moodScore, emotions, marketCondition, notes } = await request.json();

    if (!moodScore || !emotions || !marketCondition) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Final debug before creating mood
    console.log('About to create mood with userId:', userId, 'type:', typeof userId);

    const moodDoc = {
      userId: userId, // Explicitly ensure it's a string
      moodScore,
      emotions,
      marketCondition,
      notes
    };
    const mood = await new Mood(moodDoc).save();

    return NextResponse.json(mood, { status: 201 });
  } catch (error) {
    console.error('Create mood error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    
    // Debug logs
    console.log('GET - Raw userId from verifyAuthToken:', userId);
    console.log('GET - Type of userId:', typeof userId);
    
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Additional check to ensure userId is a string
    if (typeof userId !== 'string') {
      console.error('GET - UserId is not a string, it is:', typeof userId, userId);
      return NextResponse.json({ message: 'Invalid user ID format' }, { status: 400 });
    }

    await dbConnect();

    console.log('GET - About to query moods with userId:', userId, 'type:', typeof userId);

    const moods = await (Mood as any).find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(30);

    return NextResponse.json(moods);
  } catch (error) {
    console.error('Get moods error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}