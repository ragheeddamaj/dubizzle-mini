"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export default function Home() {
  const { user } = useAuth()
  const isModerator = user?.userType === "moderator"

  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Find what you need, sell what you don't
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
            Dubizzle mini connects buyers and sellers in your local community. Browse thousands of listings or create
              your own ad today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/browse"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Browse Listings
              </Link>
              {!isModerator && (
                <Link
                  href="/ads/create"
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600"
                >
                  Post an Ad <span aria-hidden="true">→</span>
                </Link>
              )}
              {isModerator && (
                <Link
                  href="/moderation"
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600"
                >
                  Moderate Ads <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:text-center">
        <h2 className="text-base font-semibold leading-7 text-red-600">Dubizzle mini</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to buy and sell locally
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform makes it easy to connect with buyers and sellers in your area. With powerful search, secure
            messaging, and a simple listing process, you'll find what you need in no time.
          </p>
        </div>

        <div className="mt-16 flex items-center justify-center gap-x-6">
          {!user ? (
            <Link
              href="/register"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get Started
            </Link>
          ) : !isModerator ? (
            <Link
              href="/ads/create"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create New Ad
            </Link>
          ) : (
            <Link
              href="/moderation"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go to Moderation Panel
            </Link>
          )}
          <Link href="/browse" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
            View Listings <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

