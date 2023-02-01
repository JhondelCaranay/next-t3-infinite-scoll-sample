import Link from "next/link";
import { useRouter } from "next/router";
import { TimeLine } from "../components";

const UserPage = () => {
  const router = useRouter();

  const name = router.query.name as string;
  return (
    <div>
      <Link href="/">FEED BACK</Link>
      <TimeLine
        where={{
          author: {
            name,
          },
        }}
      />
    </div>
  );
};
export default UserPage;
