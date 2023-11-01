import Head from "next/head";
import Link from "next/link";

export default function VerificationSuccess() {
  return (
    <>
      <Head>
        <title>Email Verification Success</title>
        <link rel="stylesheet" href="/style.css" />

      </Head>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center">{/* Add an icon here */}</div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Email Verification Successful
          </h1>
          <p className="text-gray-600 mt-2">
            Your email has been successfully verified. You can now access all
            the features of our website.
          </p>
          <div className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-5">
            <button className="w-full text-white font-bold py-2 px-4 rounded flex justify-center items-center">
              <Link href="/login">
                <div className="flex items-center">Back to logIn</div>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
