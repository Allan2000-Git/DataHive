"use client"
import { Button } from "@/components/ui/button";
import { SignInButton, useSession } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const {isSignedIn} = useSession();
  return (
    <main className="flex flex-col items-center justify-between py-16">
      <section className="">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:items-center">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              Welcome to DataHive
              <strong className="font-extrabold text-primary_main sm:block mt-5">Your Central Hub for Secure File Storage</strong>
            </h1>

            <p className="mt-4 sm:text-xl/relaxed text-gray-500">
              Discover the ultimate solution for secure and efficient file storage with DataHive. DataHive offers a centralized platform to organize, access, and protect your valuable data.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {
                isSignedIn ? 
                (
                  <Link
                    className="block w-full rounded bg-secondary_main px-16 py-3 text-lg font-medium text-white shadow 
                    focus:outline-none focus:ring sm:w-auto hover:bg-primary_main transition"
                    href="/dashboard"
                  >
                    Visit Dashboard
                  </Link>
                ):(
                  <SignInButton afterSignInUrl="/dashboard" mode="modal">
                      <Button className="bg-secondary_main px-16 py-7 text-lg font-medium hover:bg-primary_main transition">Get Started</Button>
                  </SignInButton>
                )
              }
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
