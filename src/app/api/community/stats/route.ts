// src/app/api/community/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import CommunityPost from '../../../../models/CommunityPost';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get basic stats
    const totalPosts = await CommunityPost.countDocuments({ isPublic: true });
    
    // Get aggregated stats
    const stats = await CommunityPost.aggregate([
      { $match: { isPublic: true } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: { $size: '$likes' } },
          totalComments: { $sum: { $size: '$comments' } },
          avgMood: { $avg: '$mood' },
          bullishPosts: {
            $sum: { $cond: [{ $eq: ['$marketSentiment', 'bullish'] }, 1, 0] }
          },
          bearishPosts: {
            $sum: { $cond: [{ $eq: ['$marketSentiment', 'bearish'] }, 1, 0] }
          },
          neutralPosts: {
            $sum: { $cond: [{ $eq: ['$marketSentiment', 'neutral'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get trending tags
    const trendingTags = await CommunityPost.aggregate([
      { $match: { isPublic: true } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          tag: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Get trending symbols
    const trendingSymbols = await CommunityPost.aggregate([
      { 
        $match: { 
          isPublic: true, 
          $and: [
            { cryptoSymbol: { $exists: true } },
            { cryptoSymbol: { $ne: null } },
            { cryptoSymbol: { $ne: '' } }
          ]
        } 
      },
      {
        $group: {
          _id: '$cryptoSymbol',
          count: { $sum: 1 },
          avgMood: { $avg: '$mood' },
          sentiment: { $push: '$marketSentiment' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          symbol: '$_id',
          count: 1,
          avgMood: { $round: ['$avgMood', 1] },
          _id: 0
        }
      }
    ]);

    // Get recent activity (posts from last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentActivity = await CommunityPost.countDocuments({
      isPublic: true,
      createdAt: { $gte: yesterday }
    });

    const result = {
      totalPosts,
      totalLikes: stats[0]?.totalLikes || 0,
      totalComments: stats[0]?.totalComments || 0,
      avgMood: stats[0]?.avgMood ? Number(stats[0].avgMood.toFixed(1)) : 0,
      sentiment: {
        bullish: stats[0]?.bullishPosts || 0,
        bearish: stats[0]?.bearishPosts || 0,
        neutral: stats[0]?.neutralPosts || 0
      },
      trendingTags,
      trendingSymbols,
      recentActivity
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Get community stats error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}