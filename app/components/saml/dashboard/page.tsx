// File: app/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { LogOut, User, Shield, Key, Calendar } from "lucide-react";

type SamlSession = {
  sub: string;
  email?: string;
  iat?: number;
  exp?: number;
};

export default async function DashboardPage() {
  /* 1. Read SAML session cookie */
  const cookieStore = await cookies();
  const token = cookieStore.get("saml-session")?.value;
  
  console.log("###### Token ", token);

  if (!token) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <span>Token value is empty.</span>
    </div>
  )}

  /* 2. Verify JWT */
  let session: SamlSession;
  try {
    session = jwt.verify(
      token,
      process.env.APP_SECRET!
    ) as SamlSession;
  } catch (err) {
    console.error("Invalid SAML session", err);
    //redirect("/login");
    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <span>Session value is empty.</span>
    </div>
    )
  }

  /* 3. Derived values */
  const username = session.sub;
  const email = session.email ?? "Not provided";
  const expiresAt = session.exp
    ? new Date(session.exp * 1000).toLocaleString()
    : "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Key className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">SAML Dashboard</span>
          </div>

          <form action="/auth/saml/logout" method="post">
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2">
          SAML-based authentication is successful
        </h1>
        <p className="text-gray-600 mb-8">
          You are authenticated via Microsoft Entra ID → AD FS (SAML 2.0)
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-blue-600" />
              User Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Username (Subject)</label>
                <p className="font-mono bg-gray-100 p-2 rounded">{username}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-semibold">{email}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Authentication Method</label>
                <p className="font-semibold">SAML 2.0</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Identity Provider</label>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                  <Shield className="h-4 w-4 mr-1" />
                  Microsoft Entra ID (Federated to AD FS)
                </span>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-purple-600" />
              Session Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Session Status</label>
                <span className="inline-flex px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                  Active
                </span>
              </div>

              <div>
                <label className="text-sm text-gray-500">Session Expires</label>
                <p>{expiresAt}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Session Type</label>
                <p>JWT (Application-issued)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Debug */}
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-8 bg-black text-green-400 p-4 rounded">
            {JSON.stringify(session, null, 2)}
          </pre>
        )}
      </main>
    </div>
  );
}
