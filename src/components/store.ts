import { create } from "zustand";
import type { ChatMessage } from "~/server/api/routers/story";

interface StoryState {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  messages: [],
  setMessages: (messages) => set((state) => ({ ...state, messages })),
}));
