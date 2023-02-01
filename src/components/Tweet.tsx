import { InfiniteData, QueryClient } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { AiFillHeart } from "react-icons/ai";
import { api, RouterInputs, RouterOutputs } from "../utils/api";
import { LIMIT } from "./TimeLine";

type TweetType = RouterOutputs["tweet"]["timeline"]["tweets"][number];

type TweetProps = {
  tweet: TweetType;
  client: QueryClient;
  input: RouterInputs["tweet"]["timeline"];
};

function updateCache({
  client,
  variables,
  data,
  action,
  input,
}: {
  client: QueryClient;
  input: RouterInputs["tweet"]["timeline"];
  variables: {
    tweetId: string;
  };
  data: {
    userId: string;
  };
  action: "like" | "unlike";
}) {
  client.setQueryData(
    [
      ["tweet", "timeline"],
      {
        input,
        type: "infinite",
      },
    ],
    (oldData) => {
      const newData = oldData as InfiniteData<
        RouterOutputs["tweet"]["timeline"]
      >;

      const value = action === "like" ? 1 : -1;

      const newTweets = newData.pages.map((page) => {
        return {
          tweets: page.tweets.map((tweet) => {
            if (tweet.id === variables.tweetId) {
              return {
                ...tweet,
                likes: action === "like" ? [data.userId] : [],
                _count: {
                  likes: tweet._count.likes + value,
                },
              };
            }

            return tweet;
          }),
        };
      });

      return {
        ...newData,
        pages: newTweets,
      };
    }
  );
}

const Tweet = ({ tweet, client, input }: TweetProps) => {
  const { mutateAsync: likeMutaiton } = api.tweet.like.useMutation({
    onSuccess: (data, variables, context) => {
      updateCache({ client, data, variables, input, action: "like" });
    },
  });
  const { mutateAsync: unlikeMutation } = api.tweet.unlike.useMutation({
    onSuccess: (data, variables, context) => {
      updateCache({ client, data, variables, input, action: "unlike" });
    },
  });

  const hasLiked = tweet.likes.length > 0;

  return (
    <div className="mb-4 border-b-2 border-gray-500">
      <div className="flex p-2">
        {tweet.author.image && (
          <Image
            src={tweet.author.image}
            alt={`${tweet.author.name} profile picture`}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}

        <div className="ml-2">
          <div className="flex items-center">
            <p className="font-bold">
              <Link href={`/${tweet.author.name}`}>{tweet.author.name}</Link>
            </p>
            <p className="pl-1 text-xs text-gray-500">
              - {moment(tweet.createdAt).fromNow()}
              {/* {new Date(tweet.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })} */}
            </p>
          </div>

          <div>{tweet.text}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center p-2">
        <AiFillHeart
          color={hasLiked ? "red" : "gray"}
          size="1.5rem"
          onClick={() => {
            if (hasLiked) {
              unlikeMutation({
                tweetId: tweet.id,
              });
              return;
            }

            likeMutaiton({
              tweetId: tweet.id,
            });
          }}
        />

        <span className="text-sm text-gray-500">{tweet._count.likes}</span>
      </div>
    </div>
  );
};

export default Tweet;
