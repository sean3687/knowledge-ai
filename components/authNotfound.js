import Link from "next/link";

const AuthNotFound = () => {
  return (
    <div className="w-full bg-white p-8 rounded-lg shadow-md w-80 justify-center">
      <div className=" text-xl text-center font-medium">
        Please login to get started
      </div>
      <div className=" mt-5 text-lg text-center font-medium ">
        <Link
          href="/login"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default AuthNotFound;
