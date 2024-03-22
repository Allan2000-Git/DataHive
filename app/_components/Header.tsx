import { Button } from '@/components/ui/button'
import { OrganizationSwitcher, SignInButton, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Header() {
    return (
        <header className="bg-white border-b sticky top-0 z-50">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="md:flex md:items-center md:gap-12">
                        <Link className="block text-teal-600" href="/">
                            <span className="sr-only">DataHive</span>
                            <Image className="object-contain" src="/datahive-favicon.png" alt="DataHive logo" width={40} height={40} />
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="sm:flex sm:gap-4">
                            <OrganizationSwitcher />
                            <UserButton afterSignOutUrl="/" />
                            <SignedOut>
                                <SignInButton afterSignInUrl="/dashboard/files" mode="modal">
                                    <Button>Sign in</Button>
                                </SignInButton>
                            </SignedOut>
                        </div>

                        <div className="block md:hidden">
                            <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                                >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
