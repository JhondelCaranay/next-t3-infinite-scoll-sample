import { useSession } from "next-auth/react";

const LogoutBanner = () => {
  const { data: session } = useSession();

  if (session?.user) {
    return null;
  } else {
    return (
      <div className="fixed bottom-0 w-full">
        <div className="container mx-auto flex items-center justify-between bg-primary p-4">
          <p className="text-white">Do not miss out</p>
          <div>
            <button className="bg-blue-600 px-4 py-2 text-white shadow-md">
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }
};
export default LogoutBanner;
