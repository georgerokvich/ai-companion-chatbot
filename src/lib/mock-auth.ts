// This is a mock authentication provider for the demo
// In a real application, this would be replaced with Supabase Auth

import { prisma } from './prisma/client';

// Mock user session storage
let currentUser: any = null;

export const mockAuth = {
  // Sign in with email and password
  signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
    // Find user or create if not exists (for demo purposes)
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For demo, auto-create user on sign in attempt
      user = await prisma.user.create({
        data: {
          email,
          // In a real app, we would hash the password
          // This is just for demo purposes
        },
      });
    }

    // Set current user
    currentUser = {
      id: user.id,
      email: user.email,
    };

    return { error: null, data: { session: { user: currentUser } } };
  },

  // Sign up with email and password
  signUp: async ({ email, password }: { email: string; password: string }) => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: { message: 'User already exists' } };
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        // In a real app, we would hash the password
      },
    });

    // Set current user
    currentUser = {
      id: user.id,
      email: user.email,
    };

    return { error: null, data: { user: currentUser } };
  },

  // Sign out
  signOut: async () => {
    currentUser = null;
    return { error: null };
  },

  // Get current session
  getSession: async () => {
    if (!currentUser) {
      return { data: { session: null } };
    }

    return {
      data: {
        session: {
          user: currentUser,
        },
      },
    };
  },
};

// Replace the Supabase client with our mock auth
export const supabase = {
  auth: mockAuth,
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        // Mock successful upload
        return { error: null, data: { path } };
      },
      getPublicUrl: (path: string) => {
        // Return a placeholder image URL
        return { data: { publicUrl: `https://placekitten.com/200/200?${path}` } };
      },
    }),
  },
};
