import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { TimeLine } from "../components";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { data: session } = useSession();

  const handleLogin = async () => {
    await signIn();
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* container */}
      <main className="container mx-auto bg-slate-200">
        <button type="button" onClick={handleLogin}>
          Login
        </button>
        {/* <div>
          <pre>
            <code>{JSON.stringify(session, null, 2)}</code>
          </pre>
        </div> */}
        <TimeLine />
      </main>
    </>
  );
};

export default Home;
