import { z } from 'zod';
import { router, protectedProcedure } from '../server';
import { prisma } from '../../prisma/client';
import { mockChats } from '../../mock-data/chats';

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
      // For demo mode, always return mock chats
      const characterChats = mockChats.filter(chat => chat.characterId === input.characterId);
      if (characterChats.length > 0) {
        return characterChats.map(chat => ({
          ...chat,
          messages: [chat.messages[0]] // Take only the first message for preview
        }));
      }
      // If no matching character chats, return the first one
      return [{
        ...mockChats[0],
        messages: [mockChats[0].messages[0]] // Take only the first message
      }];
    }),

  // Get a chat by ID with messages
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // For demo mode, always return mock chat
      const mockChat = mockChats.find(chat => chat.id === input.id);
      if (mockChat) {
        return mockChat;
      }
      // If no matching mock chat, return the first one
      return mockChats[0];
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
