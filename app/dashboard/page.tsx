// File: app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import { LogOut, User, Shield, Key, Calendar } from 'lucide-react';

export default async function DashboardPage() {
  // Get the session
  const session = await auth();
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Key className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">SAML Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                  <p className="text-xs text-gray-500">{session.user.email}</p>
                </div>
              </div>
              
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/login' });
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-gray-600">
            You have successfully authenticated using SAML 2.0
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="h-6 w-6 mr-2 text-blue-600" />
                User Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {session.user.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email Address</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {session.user.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">User ID</label>
                    <p className="mt-1 font-mono text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {session.user.id}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Authentication Method</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      SAML 2.0
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Provider</label>
                    <p className="mt-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Shield className="h-4 w-4 mr-1" />
                        BoxyHQ
                      </span>
                    </p>
                  </div>
                  {session.user.firstName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">First Name</label>
                      <p className="mt-1 text-sm text-gray-600">{session.user.firstName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Roles Section */}
              {session.user.roles && session.user.roles.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    User Roles & Permissions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {session.user.roles.map((role: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Session Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-purple-600" />
                Session Information
              </h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Status
                  </label>
                  <p className="mt-1 font-semibold text-gray-900">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Expires
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {session.expires ? new Date(session.expires).toLocaleString() : '24 hours from login'}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Authentication Provider
                  </label>
                  <p className="mt-1">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      BoxyHQ SAML
                    </span>
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full text-left py-2 px-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                    >
                      Refresh Session
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(session, null, 2))}
                      className="w-full text-left py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      Copy Session Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8">
            <details className="bg-gray-900 text-gray-100 p-6 rounded-2xl">
              <summary className="cursor-pointer font-mono font-bold mb-4">Session Debug Data</summary>
              <pre className="text-sm overflow-x-auto mt-4">
                {JSON.stringify(session, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}