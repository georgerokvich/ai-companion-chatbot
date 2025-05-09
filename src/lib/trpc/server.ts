import { initTRPC } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { cookies } from 'next/headers';
import { prisma } from '../prisma/client';

// Mock auth for the demo
const getSession = async () => {
  // For demo mode, always return a mock session
  return {
    user: {
      id: 'demo-user-id',
      email: 'demo@example.com',
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
