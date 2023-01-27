import Image from "next/image";
import Link from "next/link";
import { CreateTweet } from ".";
import { api, RouterOutputs } from "../utils/api";
import moment from "moment";

type Tweets = RouterOutputs["tweet"]["timeline"]["tweets"];
type Tweet = Tweets[number];

const TimeLine = () => {
  const {
    data: tweetList,
    isLoading,
    error,
  } = api.tweet.timeline.useQuery({
    limit: 2,
  });

  if (isLoading) {
    console.log("loading");

    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      {/* create tweet form */}
      <CreateTweet />
      {/* tweets */}
      <div className="border-l-2 border-r-2 border-t-2 border-gray-500">
        {tweetList?.tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};
export default TimeLine;

type TweetProps = {
  tweet: Tweet;
};

const Tweet = ({ tweet }: TweetProps) => {
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
        {/* <AiFillHeart
          color={hasLiked ? "red" : "gray"}
          size="1.5rem"
          onClick={() => {
            if (hasLiked) {
              unlikeMutation({
                tweetId: tweet.id,
              });
              return;
            }

            likeMutation({
              tweetId: tweet.id,
            });
          }}
        /> */}

        <span className="text-sm text-gray-500">{"tweet._count.likes"}</span>
      </div>
    </div>
  );
};
