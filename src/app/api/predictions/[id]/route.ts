// src/app/api/predictions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../../lib/mongodb';
import Prediction, { IPrediction } from '../../../../models/Prediction';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid prediction ID' },
        { status: 400 }
      );
    }

    const prediction = await Prediction.findOne({
      _id: params.id,
      userId: session.user.email
    }).lean();

    if (!prediction) {
      return NextResponse.json(
        { message: 'Prediction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Get prediction error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid prediction ID' },
        { status: 400 }
      );
    }

    const updates = await request.json();

    // Only allow specific fields to be updated
    const validUpdates: Partial<IPrediction> = {};
    
    if (updates.status && ['pending', 'correct', 'incorrect'].includes(updates.status)) {
      validUpdates.status = updates.status;
    }
    
    if (updates.actualPrice !== undefined && typeof updates.actualPrice === 'number' && updates.actualPrice > 0) {
      validUpdates.actualPrice = updates.actualPrice;
    }
    
    if (updates.resolvedAt) {
      validUpdates.resolvedAt = new Date(updates.resolvedAt);
    }

    // Don't allow updating resolved predictions unless explicitly unresolving
    const existingPrediction = await Prediction.findOne({
      _id: params.id,
      userId: session.user.email
    });

    if (!existingPrediction) {
      return NextResponse.json(
        { message: 'Prediction not found' },
        { status: 404 }
      );
    }

    // If prediction is already resolved, only allow changing back to pending
    if (existingPrediction.status !== 'pending' && validUpdates.status !== 'pending') {
      return NextResponse.json(
        { message: 'Cannot modify resolved prediction' },
        { status: 400 }
      );
    }

    const prediction = await Prediction.findOneAndUpdate(
      { _id: params.id, userId: session.user.email },
      validUpdates,
      { new: true }
    );

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Update prediction error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid prediction ID' },
        { status: 400 }
      );
    }

    const prediction = await Prediction.findOneAndDelete({
      _id: params.id,
      userId: session.user.email
    });

    if (!prediction) {
      return NextResponse.json(
        { message: 'Prediction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Prediction deleted successfully' });
  } catch (error) {
    console.error('Delete prediction error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}