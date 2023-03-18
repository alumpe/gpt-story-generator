import { useState } from "react";

import { api } from "~/utils/api";
import { useStoryStore } from "./store";

export const ChatInput = () => {
  const [inputText, setInputText] = useState("");
  const storyState = useStoryStore();

  const { mutate: startStory, isLoading } = api.story.start.useMutation({
    onSuccess: (data) => {
      storyState.setMessages(data.messages);
    },
  });

  return (
    <div className="flex w-[50rem] flex-row gap-4">
      <input
        className="focus:shadow-outline w-96 flex-grow appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
        type="text"
        name=""
        id=""
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <button
        disabled={isLoading}
        className="rounded bg-gray-700 py-2 px-4 font-bold text-white"
        onClick={() => startStory({ storySetting: inputText })}
      >
        {isLoading ? "Loading..." : "Generate story"}
      </button>
    </div>
  );
};
