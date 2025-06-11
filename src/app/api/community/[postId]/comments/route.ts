// src/app/api/community/[postId]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../../../lib/mongodb';
import CommunityPost from '../../../../../models/CommunityPost';

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await dbConnect();

    const { postId } = params;
    
    if (!postId) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }

    const post = await CommunityPost.findById(postId).select('comments').lean();
    
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      comments: post.comments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    });

  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const { content } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { message: 'Post ID is required' },
        { status: 400 }
      );
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { message: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (content.length > 200) {
      return NextResponse.json(
        { message: 'Comment must be 200 characters or less' },
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

    const newComment = {
      id: new Date().getTime().toString(), // Simple ID generation
      userId: session.user.email,
      username: session.user.name || 'Anonymous',
      content: content.trim(),
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    return NextResponse.json({
      comment: newComment,
      message: 'Comment added successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}