import { TRPCError } from "@trpc/server";
import type { ChatCompletionRequestMessage } from "openai";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { openai } from "../openai";

const systemMessage = {
  role: "system",
  content:
    "You are a story teller that lets the user choose how to continue the story.",
} as const;

export type ChatMessage = ChatCompletionRequestMessage & { imageUrl?: string };

export const storyRouter = createTRPCRouter({
  start: publicProcedure
    .input(
      z.object({
        storySetting: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { storySetting } = input;

      const initialUserMessage = {
        role: "user",
        content:
          "Generate the beginning of a story. The setting is the following: " +
          storySetting +
          "Generate 3 sentences of the story.",
        // "Give two different choices with short sentences on how to continue the story.",
      } as const;

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, initialUserMessage],

        max_tokens: 200,
      });

      console.log(response.data);
      console.log(response.data.choices);

      const newMessage = response.data.choices[0]?.message;
      if (!newMessage) throw new TRPCError({ code: "BAD_REQUEST" });

      const imageResponse = await openai.createImage({
        prompt: newMessage.content,
        n: 1,
        size: "512x512",
      });

      const imageUrl = imageResponse.data.data[0]?.url;
      console.log(imageUrl);

      return {
        messages: [initialUserMessage, { ...newMessage, imageUrl }],
      };
    }),
  continue: publicProcedure
    .input(
      z.array(
        z.object({
          role: z.enum(["system", "assistant", "user"]),
          content: z.string(),
          imageUrl: z.string().optional(),
        })
      )
    )
    .mutation(async ({ input }) => {
      const messages = input;

      const nextUserMessage = {
        role: "user",
        content: "Continue the story for 3 more sentences.",
      } as const;

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          systemMessage,
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          nextUserMessage,
        ],

        max_tokens: 200,
      });

      console.log(response.data);
      console.log(response.data.choices);

      const newMessage = response.data.choices[0]?.message;
      if (!newMessage) throw new TRPCError({ code: "BAD_REQUEST" });

      const imageResponse = await openai.createImage({
        prompt: newMessage.content,
        n: 1,
        size: "512x512",
      });

      const imageUrl = imageResponse.data.data[0]?.url;
      console.log(imageUrl);

      return {
        messages: [...messages, nextUserMessage, { ...newMessage, imageUrl }],
      };
    }),
});
