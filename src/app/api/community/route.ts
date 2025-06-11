// src/app/api/community/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../lib/mongodb';
import CommunityPost from '../../../models/CommunityPost';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const tag = searchParams.get('tag');
    const symbol = searchParams.get('symbol');
    const sentiment = searchParams.get('sentiment');

    // Build query
    const query: any = { isPublic: true };
    
    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }
    
    if (symbol) {
      query.cryptoSymbol = symbol.toUpperCase();
    }
    
    if (sentiment && ['bullish', 'bearish', 'neutral'].includes(sentiment)) {
      query.marketSentiment = sentiment;
    }

    const skip = (page - 1) * limit;

    const posts = await CommunityPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPosts = await CommunityPost.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { content, mood, marketSentiment, cryptoSymbol, tags } = await request.json();

    // Validation
    if (!content || !mood || !marketSentiment) {
      return NextResponse.json(
        { message: 'Missing required fields: content, mood, marketSentiment' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0 || content.length > 500) {
      return NextResponse.json(
        { message: 'Content must be between 1 and 500 characters' },
        { status: 400 }
      );
    }

    if (mood < 1 || mood > 10) {
      return NextResponse.json(
        { message: 'Mood must be between 1 and 10' },
        { status: 400 }
      );
    }

    if (!['bullish', 'bearish', 'neutral'].includes(marketSentiment)) {
      return NextResponse.json(
        { message: 'Invalid market sentiment' },
        { status: 400 }
      );
    }

    // Process tags
    const processedTags = tags 
      ? tags.split(',')
          .map((tag: string) => tag.trim().toLowerCase())
          .filter((tag: string) => tag.length > 0)
          .slice(0, 5) // Limit to 5 tags
      : [];

    const post = await CommunityPost.create({
      userId: session.user.email,
      username: session.user.name || 'Anonymous',
      content: content.trim(),
      mood: parseInt(mood),
      marketSentiment,
      cryptoSymbol: cryptoSymbol ? cryptoSymbol.toUpperCase() : undefined,
      tags: processedTags,
      likes: [],
      comments: [],
      isPublic: true
    });

    return NextResponse.json(post, { status: 201 });

  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}