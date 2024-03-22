"use client"
import { Button } from "@/components/ui/button";
import { SignInButton, useSession } from "@clerk/nextjs";
import { MoveRightIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const {isSignedIn} = useSession();
  return (
    <>
    <div className="main -z-10">
            <div className="gradient" />
          </div>
    <main className="flex flex-col items-center justify-between py-16 z-50">
      <section className="">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              Welcome to DataHive
              <strong className="font-extrabold bg-gradient-to-r from-primary_main to-secondary_main text-transparent bg-clip-text sm:block mt-5 py-1">Your Central Hub for Secure File Storage</strong>
            </h1>

            <p className="mt-4 sm:text-xl/relaxed text-gray-500">
              Discover the ultimate solution for secure and efficient file storage with DataHive. DataHive offers a centralized platform to organize, access, and protect your valuable data.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {
                isSignedIn ? 
                (
                  <Link
                    className="w-full rounded-xl bg-primary_main px-8 py-3 text-lg font-medium text-white shadow 
                    focus:outline-none sm:w-auto hover:bg-primary_main transition flex items-center gap-3"
                    href="/dashboard/files"
                  >
                    Visit Dashboard
                    <MoveRightIcon />
                  </Link>
                ):(
                  <SignInButton afterSignInUrl="/dashboard/files" mode="modal">
                      <Button className="w-full rounded-xl bg-secondary_main px-8 py-7 text-lg font-medium text-white shadow 
                    focus:outline-none focus:ring sm:w-auto hover:bg-primary_main transition flex items-center gap-3">
                        Get Started
                        <MoveRightIcon />
                      </Button>
                  </SignInButton>
                )
              }
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
