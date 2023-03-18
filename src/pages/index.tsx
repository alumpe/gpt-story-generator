import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ChatInput } from "~/components/ChatInput";
import { useStoryStore } from "~/components/store";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { messages, setMessages } = useStoryStore((state) => ({
    messages: state.messages.filter((m) => m.role === "assistant"),
    setMessages: state.setMessages,
  }));
  const { mutate, isLoading } = api.story.continue.useMutation({
    onSuccess: (data) => {
      setMessages(data.messages);
    },
  });

  return (
    <>
      <Head>
        <title>GPT Story Generator</title>
        <meta
          name="description"
          content="Continuous story generator powered by GPT-3.5"
        />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-800 text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Describe your story setting in one sentence
          </h1>

          <ChatInput />

          {messages.length > 0 && (
            <>
              <ul className="flex max-w-[50rem] flex-col gap-4">
                {messages.map((message, index) => (
                  <div key={index}>
                    <li className="rounded-xl bg-gray-700 p-4">
                      {message.content}
                    </li>
                  </div>
                ))}
              </ul>
              <button
                className="relative rounded bg-gray-700 py-2 px-4 font-bold text-white"
                onClick={() => mutate(useStoryStore.getState().messages)}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Continue"}
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
