import { CreateTweet, Tweet } from ".";
import { api, RouterInputs, RouterOutputs } from "../utils/api";
import { useEffect } from "react";

import { useScrollPosition } from "../hooks/useScrollPosition";
import { useQueryClient } from "@tanstack/react-query";

const LIMIT = 10;

const TimeLine = () =>
  //   {
  //   where = {},
  // }: {
  //   where: RouterInputs["tweet"]["timeline"]["where"];
  // }
  {
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

    const client = useQueryClient();

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
            <Tweet
              key={tweet.id}
              tweet={tweet}
              client={client}
              // input={{
              //   where,
              //   limit: LIMIT,
              // }}
            />
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
