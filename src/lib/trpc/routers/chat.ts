import { z } from 'zod';
import { router, protectedProcedure } from '../server';
import { prisma } from '../../prisma/client';

export const chatRouter = router({
  // Create a new chat for a character
  create: protectedProcedure
    .input(z.object({ characterId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.chat.create({
        data: {
          userId: ctx.userId,
          characterId: input.characterId,
        },
      });
    }),

  // Get all chats for a character
  getAllByCharacter: protectedProcedure
    .input(z.object({ characterId: z.string() }))
    .query(async ({ ctx, input }) => {
      return prisma.chat.findMany({
        where: {
          userId: ctx.userId,
          characterId: input.characterId,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
            take: 1,
          },
        },
      });
    }),

  // Get a chat by ID with messages
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return prisma.chat.findUnique({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
          character: true,
          images: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    }),

  // Add a message to a chat
  addMessage: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        content: z.string(),
        role: z.enum(['user', 'assistant']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Update the chat's updatedAt timestamp
      await prisma.chat.update({
        where: {
          id: input.chatId,
          userId: ctx.userId,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      // Create the new message
      return prisma.message.create({
        data: {
          content: input.content,
          role: input.role,
          chatId: input.chatId,
        },
      });
    }),

  // Add an image to a chat
  addImage: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        url: z.string(),
        prompt: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Update the chat's updatedAt timestamp
      await prisma.chat.update({
        where: {
          id: input.chatId,
          userId: ctx.userId,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      // Create the new image
      return prisma.image.create({
        data: {
          url: input.url,
          prompt: input.prompt,
          chatId: input.chatId,
        },
      });
    }),

  // Delete a chat
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.chat.delete({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });
    }),
});
