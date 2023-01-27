import { useState } from "react";
import { api } from "../utils/api";
import { z } from "zod";

export const tweetSchema = z.object({
  text: z
    .string({
      required_error: "Tweet text is required",
    })
    .min(10)
    .max(280),
});

const CreateTweet = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // const utils = api.useContext();

  const { mutateAsync } = api.tweet.create.useMutation({
    onSuccess: () => {
      setText("");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      tweetSchema.parse({ text });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.message);
        return;
      }
    }

    await mutateAsync({ text });
  };

  return (
    <>
      {error && <div className="text-red-500">{error}</div>}
      <form
        className="mb-4 flex w-full flex-col rounded-md border-2 p-4"
        onSubmit={handleSubmit}
      >
        <textarea
          className="w-full p-4 shadow"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />

        <div className="mt-4 flex justify-end">
          <button
            className="rounded-md bg-primary px-4 py-2 text-white"
            type="submit"
          >
            Tweet
          </button>
        </div>
      </form>
    </>
  );
};
export default CreateTweet;
