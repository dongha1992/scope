import React from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { options } from "../api/auth/[...nextauth]";
import Image from "next/image";
import Button from "@/components/Button";

function Signin() {
  return (
    <div
      className="h-full w-full flex flex-col justify-center items-center"
      style={{ backgroundColor: "#262626" }}
    >
      <div className="flex justify-center items-center">
        <Image src="/img/scope-logo.jpeg" width={200} height={200} alt="로고" />
      </div>
      <div className="flex justify-center items-center">
        <Button
          className="flex bg-white text-black p-4 rounded-md text-md w-100 hover:bg-white focus:outline-none focus:ring-0"
          type="button"
          onClick={() => signIn("google")}
        >
          <Image
            src="/img/google_logo.png"
            alt="구글 로고"
            width={25}
            height={25}
          />
          <span className="ml-4">구글로 시작하기</span>
        </Button>
      </div>
    </div>
  );
}

export default Signin;

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, options);

  if (session) {
    //redirect to login page

    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
