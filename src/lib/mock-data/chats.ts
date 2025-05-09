// Mock chat data for the demo
import { mockCharacters } from './characters';

export const mockChats = [
  {
    id: 'chat-1',
    userId: 'demo-user',
    characterId: 'char-1',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(),
    messages: [
      {
        id: 'msg-1',
        content: 'Hello! How are you today?',
        role: 'user',
        chatId: 'chat-1',
        createdAt: new Date(Date.now() - 86000000),
      },
      {
        id: 'msg-2',
        content: 'Hi there! I\'m doing wonderful, thanks for asking! How about you? Is there anything specific you\'d like to chat about today?',
        role: 'assistant',
        chatId: 'chat-1',
        createdAt: new Date(Date.now() - 85000000),
      },
      {
        id: 'msg-3',
        content: 'I\'m curious about your hobbies. What do you enjoy doing?',
        role: 'user',
        chatId: 'chat-1',
        createdAt: new Date(Date.now() - 84000000),
      },
      {
        id: 'msg-4',
        content: 'I love exploring new ideas and having interesting conversations! I enjoy discussing art, science, philosophy, and just about anything that involves creativity and learning. I also love helping people and sharing knowledge. What about you? Do you have any favorite hobbies or interests?',
        role: 'assistant',
        chatId: 'chat-1',
        createdAt: new Date(Date.now() - 83000000),
      }
    ],
    character: mockCharacters[0],
    images: []
  },
  {
    id: 'chat-2',
    userId: 'demo-user',
    characterId: 'char-2',
    createdAt: new Date(Date.now() - 176400000), // 2 days ago
    updatedAt: new Date(Date.now() - 90000000),
    messages: [
      {
        id: 'msg-5',
        content: 'Can you help me with some programming advice?',
        role: 'user',
        chatId: 'chat-2',
        createdAt: new Date(Date.now() - 176000000),
      },
      {
        id: 'msg-6',
        content: 'Absolutely! I\'d be happy to help with programming. What language or framework are you working with, and what kind of project are you building? The more details you can provide, the better advice I can offer!',
        role: 'assistant',
        chatId: 'chat-2',
        createdAt: new Date(Date.now() - 175000000),
      }
    ],
    character: mockCharacters[1],
    images: []
  },
  {
    id: 'chat-3',
    userId: 'demo-user',
    characterId: 'char-3',
    createdAt: new Date(Date.now() - 256400000), // 3 days ago
    updatedAt: new Date(Date.now() - 180000000),
    messages: [
      {
        id: 'msg-7',
        content: 'What\'s your favorite art style?',
        role: 'user',
        chatId: 'chat-3',
        createdAt: new Date(Date.now() - 256000000),
      },
      {
        id: 'msg-8',
        content: 'I find myself particularly drawn to impressionism! There\'s something magical about how artists like Monet and Renoir captured light and movement with those distinctive brushstrokes. I love how impressionist works convey feeling and atmosphere rather than exact details. What about you? Do you have a favorite art style or movement?',
        role: 'assistant',
        chatId: 'chat-3',
        createdAt: new Date(Date.now() - 255000000),
      }
    ],
    character: mockCharacters[2],
    images: []
  }
];