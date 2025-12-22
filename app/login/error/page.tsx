// File: app/login/error/page.tsx - Server Component version
import Link from 'next/link';

// This is now a Server Component (no 'use client')
export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Await the searchParams Promise
  const params = await searchParams;
  const error = params.error || 'An error occurred during authentication';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Authentication Error
          </h1>
          <p className="mt-2 text-gray-600">
            We couldn&apos;t sign you in
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-red-200">
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">
                {decodeURIComponent(error)}
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p>Possible reasons:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Your session may have expired</li>
                <li>There might be an issue with your organization&apos;s SSO</li>
                <li>The authentication request may have timed out</li>
              </ul>
            </div>

            <div className="pt-4 space-y-3">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </Link>
              
              <Link
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}