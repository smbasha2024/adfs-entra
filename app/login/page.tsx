// File: app/login/page.tsx


export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; callbackUrl?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to your account using your organization&apos;s credentials
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Azure Entra ADFS Authentication
          </div>
        </div>


        <div className="text-center text-sm text-gray-500 pt-6 border-t">
          <p>You will be securely redirected to your organization&apos;s login page.</p>
        </div>
      </div>
    </div>
  );
}