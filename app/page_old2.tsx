"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold">Signed In</h1>
        <pre className="mt-4 bg-gray-100 p-4 rounded">
          {JSON.stringify(session, null, 2)}
        </pre>

        <button
          onClick={() => signOut()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <button
        onClick={() => signIn("azure-ad")}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Sign In with Azure AD
      </button>
    </div>
  )
}
