// src/app/api/community/[postId]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../../../lib/mongodb';
import CommunityPost from '../../../../../models/CommunityPost';

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await dbConnect();

    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = params;
    
    if (!postId) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }

    const post = await CommunityPost.findById(postId);
    
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    const userId = session.user.email;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter((id: string) => id !== userId);
    } else {
      // Like the post
      post.likes.push(userId);
    }

    await post.save();

    return NextResponse.json({
      postId: post._id,
      isLiked: !isLiked,
      likesCount: post.likes.length,
      message: isLiked ? 'Post unliked' : 'Post liked'
    });

  } catch (error) {
    console.error('Toggle like error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}