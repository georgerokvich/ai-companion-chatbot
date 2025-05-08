import { initTRPC } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { cookies } from 'next/headers';
import { prisma } from '../prisma/client';

// Mock auth for the demo
const getSession = async () => {
  // For the demo, we'll always return a mock session with a user
  // In a real app, this would use Supabase Auth
  const mockUser = await prisma.user.findFirst();
  
  if (!mockUser) {
    // Create a demo user if none exists
    const newUser = await prisma.user.create({
      data: {
        email: 'demo@example.com',
      },
    });
    
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    };
  }
  
  return {
    user: {
      id: mockUser.id,
      email: mockUser.email,
    },
  };
};

// Create a context for our API
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const session = await getSession();
  
  return {
    userId: session?.user?.id,
    req: opts.req,
  };
};

// Initialize tRPC
const t = initTRPC.context<typeof createContext>().create();

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

// Middleware to enforce authentication
export const isAuthed = middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new Error('You must be logged in to access this resource');
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

export const protectedProcedure = publicProcedure.use(isAuthed);
