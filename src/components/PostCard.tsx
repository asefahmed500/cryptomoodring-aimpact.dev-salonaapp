// src/components/community/PostCard.tsx
'use client';

import { Heart, MessageCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { CommunityPost } from '@/types/community';

interface PostCardProps {
  post: CommunityPost;
  currentUserId?: string;
  onUpdate: (updatedPost: CommunityPost) => void;
  onDelete: (postId: string) => void;
}

export default function PostCard({ post, currentUserId, onUpdate, onDelete }: PostCardProps) {
  const { data: session } = useSession();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLiked = currentUserId && post.likes.includes(currentUserId);
  const canInteract = !!session?.user;

  const handleLike = async () => {
    if (!canInteract || !currentUserId) return;
    
    try {
      const response = await fetch(`/api/community/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedPost = await response.json();
        onUpdate(updatedPost);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canInteract || !commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/community/${post._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: commentText.trim() }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        onUpdate(updatedPost);
        setCommentText('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!canInteract || post.userId !== currentUserId) return;
    
    try {
      const response = await fetch(`/api/community/${post._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(post._id);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const getSentimentIcon = () => {
    switch (post.marketSentiment) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'bearish':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return 'text-red-400';
    if (mood <= 6) return 'text-yellow-400';
    return 'text-green-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {post.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-white font-medium">{post.username}</h3>
            <p className="text-gray-400 text-sm">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getSentimentIcon()}
          <span className={`text-sm font-medium ${getMoodColor(post.mood)}`}>
            Mood: {post.mood}/10
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-100 mb-3">{post.content}</p>
        
        {post.cryptoSymbol && (
          <div className="inline-block bg-blue-600 text-white px-2 py-1 rounded text-sm mb-2">
            ${post.cryptoSymbol}
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={!canInteract}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked
                ? 'text-red-400 hover:text-red-300'
                : 'text-gray-400 hover:text-red-400'
            } ${!canInteract ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes.length}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments.length}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span className="capitalize">{post.marketSentiment}</span>
          {post.userId === currentUserId && (
            <button 
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          {/* Comment Form */}
          {canInteract && (
            <form onSubmit={handleComment} className="mb-4">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">
                    {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={2}
                    maxLength={200}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">
                      {commentText.length}/200
                    </span>
                    <button
                      type="submit"
                      disabled={!commentText.trim() || isSubmitting}
                      className="bg-purple-600 text-white px-4 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">
                    {comment.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-700 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white text-sm font-medium">
                        {comment.username}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-100 text-sm">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}