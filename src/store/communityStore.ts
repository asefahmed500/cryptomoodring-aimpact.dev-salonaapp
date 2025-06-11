import { create } from 'zustand';

interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  type: 'insight' | 'prediction' | 'discussion' | 'analysis';
  tags: string[];
  likes: string[];
  comments: {
    id: string;
    userId: string;
    username: string;
    content: string;
    createdAt: string;
  }[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
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
        set({ isLoading: false });
      }
    } catch (error) {
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
      return false;
    } catch (error) {
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
      return false;
    } catch (error) {
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
      return false;
    } catch (error) {
      return false;
    }
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
