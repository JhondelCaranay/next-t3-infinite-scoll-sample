import Image from "next/image";
import Link from "next/link";
import { CreateTweet } from ".";
import { api, RouterOutputs } from "../utils/api";
import moment from "moment";
import { useEffect, useState } from "react";

type Tweets = RouterOutputs["tweet"]["timeline"]["tweets"];
type Tweet = Tweets[number];

function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    // const position = window.pageYOffset;
    // setScrollPosition(position);
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const scrolled = (winScroll / height) * 100;

    setScrollPosition(scrolled);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { scrollPosition, setScrollPosition };
}

const TimeLine = () => {
  //  when scroll position is 100% fetch next page
  const { scrollPosition, setScrollPosition } = useScrollPosition();

  const {
    data: tweetList,
    isLoading,
    error,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    isFetching,
  } = api.tweet.timeline.useInfiniteQuery(
    {
      limit: 2,
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.nextCursor) {
          return lastPage.nextCursor;
        }
      },
    }
  );
  const tweets = tweetList?.pages.flatMap((page) => page.tweets);

  //  when scroll position is 100% fetch next page
  useEffect(() => {
    if (scrollPosition === 100 && hasNextPage && !isFetching) {
      // add debounce for scroll , 1000ms
      const timer = setTimeout(() => {
        fetchNextPage();
        setScrollPosition(99);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);
  // console.log({ scrollPosition });

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
        {tweets?.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}

        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetching}
        >
          load next
        </button>
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
