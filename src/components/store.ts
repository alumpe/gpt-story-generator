import type { ChatCompletionResponseMessage } from "openai";
import { create } from "zustand";

interface StoryState {
  messages: ChatCompletionResponseMessage[];
  setMessages: (messages: ChatCompletionResponseMessage[]) => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  messages: [],
  setMessages: (messages) => set((state) => ({ ...state, messages })),
}));
