// src/app/community/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import { Users, TrendingUp, MessageCircle, Heart, Filter, Search } from 'lucide-react';

import { CommunityPost, CommunityStats } from '@/types/community';
import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import CreatePostForm from '@/components/CreatePostForm';

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    sentiment: '',
    symbol: '',
    tag: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = async (pageNum = 1, reset = false) => {
    try {
      setIsLoading(pageNum === 1);
      setIsLoadingMore(pageNum > 1);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '20'
      });

      if (filters.sentiment) params.append('sentiment', filters.sentiment);
      if (filters.symbol) params.append('symbol', filters.symbol);
      if (filters.tag) params.append('tag', filters.tag);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/community?${params}`);
      const data = await response.json();

      if (response.ok) {
        if (reset || pageNum === 1) {
          setPosts(data.posts);
        } else {
          setPosts(prev => [...prev, ...data.posts]);
        }
        setHasMore(data.pagination.hasNext);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/community/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchPosts(1, true);
    fetchStats();
  }, [filters, searchQuery]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  const handlePostCreated = (newPost: CommunityPost) => {
    setPosts(prev => [newPost, ...prev]);
    fetchStats();
  };

  const handlePostUpdate = (updatedPost: CommunityPost) => {
    setPosts(prev => prev.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
    fetchStats();
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
    fetchStats();
  };

  const clearFilters = () => {
    setFilters({ sentiment: '', symbol: '', tag: '' });
    setSearchQuery('');
    setPage(1);
  };

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Users className="w-8 h-8 text-purple-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Community Hub
              </h1>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Share your crypto emotions, insights, and connect with fellow traders. 
              Track market sentiment through collective mood data.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Community Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.totalPosts}</p>
                    <p className="text-gray-400 text-sm">Posts</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.totalLikes}</p>
                    <p className="text-gray-400 text-sm">Likes</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.totalComments}</p>
                    <p className="text-gray-400 text-sm">Comments</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.avgMood.toFixed(1)}</p>
                    <p className="text-gray-400 text-sm">Avg Mood</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Create Post Form */}
              {session && (
                <div className="mb-8">
                  <CreatePostForm onPostCreated={handlePostCreated} />
                </div>
              )}

              {/* Filters */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <h3 className="text-white font-medium">Filters</h3>
                  </div>
                  {(filters.sentiment || filters.symbol || filters.tag || searchQuery) && (
                    <button
                      onClick={clearFilters}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={filters.sentiment}
                    onChange={(e) => setFilters(prev => ({ ...prev, sentiment: e.target.value }))}
                    className="bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Sentiments</option>
                    <option value="bullish">Bullish</option>
                    <option value="bearish">Bearish</option>
                    <option value="neutral">Neutral</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Filter by symbol (e.g., BTC)"
                    value={filters.symbol}
                    onChange={(e) => setFilters(prev => ({ ...prev, symbol: e.target.value }))}
                    className="bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                  <input
                    type="text"
                    placeholder="Filter by tag"
                    value={filters.tag}
                    onChange={(e) => setFilters(prev => ({ ...prev, tag: e.target.value }))}
                    className="bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Posts Feed */}
              <div className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading community posts...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">
                      No posts found
                    </h3>
                    <p className="text-gray-500">
                      {searchQuery || filters.sentiment || filters.symbol || filters.tag 
                        ? "Try adjusting your search or filters"
                        : "Be the first to share your crypto mood with the community!"}
                    </p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <PostCard 
                      key={post._id} 
                      post={post} 
                      currentUserId={session?.user?.id}
                      onUpdate={handlePostUpdate}
                      onDelete={handlePostDeleted}
                    />
                  ))
                )}

                {isLoadingMore && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  </div>
                )}
              </div>

              {/* Load More Button */}
              {!isLoading && !isLoadingMore && hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    className="bg-gray-800 text-white px-6 py-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    Load More Posts
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Market Sentiment */}
              {stats && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-white font-medium mb-4">Market Sentiment</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-400">Bullish</span>
                        <span>{stats.sentiment.bullish}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${stats.sentiment.bullish}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-400">Bearish</span>
                        <span>{stats.sentiment.bearish}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${stats.sentiment.bearish}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Neutral</span>
                        <span>{stats.sentiment.neutral}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gray-500 h-2 rounded-full" 
                          style={{ width: `${stats.sentiment.neutral}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trending Cryptos */}
              {stats && stats.trendingSymbols.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-white font-medium mb-4">Trending Cryptos</h3>
                  <div className="space-y-3">
                    {stats.trendingSymbols.slice(0, 5).map((crypto) => (
                      <div key={crypto.symbol} className="flex justify-between items-center">
                        <span className="font-medium">{crypto.symbol}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${
                            crypto.avgMood > 6 ? 'text-green-400' : 
                            crypto.avgMood < 4 ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            {crypto.avgMood.toFixed(1)}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {crypto.count} posts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Tags */}
              {stats && stats.trendingTags.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-white font-medium mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.trendingTags.slice(0, 10).map((tag) => (
                      <button
                        key={tag.tag}
                        onClick={() => setFilters(prev => ({ ...prev, tag: tag.tag }))}
                        className="px-3 py-1 bg-gray-700 text-sm rounded-full hover:bg-gray-600 transition-colors"
                      >
                        #{tag.tag} ({tag.count})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}