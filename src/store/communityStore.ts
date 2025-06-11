import { create } from 'zustand';

interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  content: string;
  mood: number;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  cryptoSymbol?: string;
  tags: string[];
  likes: string[];
  comments: {
    id: string;
    userId: string;
    username: string;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
}

interface CommunityState {
  posts: CommunityPost[];
  isLoading: boolean;
  fetchPosts: () => Promise<void>;
  addPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'comments'>) => Promise<boolean>;
  likePost: (postId: string) => Promise<boolean>;
  addComment: (postId: string, content: string) => Promise<boolean>;
  setLoading: (loading: boolean) => void;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  posts: [],
  isLoading: false,

  fetchPosts: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/community');
      if (response.ok) {
        const data = await response.json();
        set({ posts: data.posts, isLoading: false });
      } else {
        console.error('Failed to fetch posts');
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({ isLoading: false });
    }
  },

  addPost: async (postData) => {
    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const newPost = await response.json();
        set((state) => ({
          posts: [newPost, ...state.posts],
        }));
        return true;
      }
      console.error('Failed to create post');
      return false;
    } catch (error) {
      console.error('Error creating post:', error);
      return false;
    }
  },

  likePost: async (postId: string) => {
    try {
      const response = await fetch(`/api/community/${postId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const updatedPost = await response.json();
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? updatedPost : p
          ),
        }));
        return true;
      }
      console.error('Failed to toggle like');
      return false;
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  },

  addComment: async (postId: string, content: string) => {
    try {
      const response = await fetch(`/api/community/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? updatedPost : p
          ),
        }));
        return true;
      }
      console.error('Failed to add comment');
      return false;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
