// File: components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginFormProps {
  error?: string;
  callbackUrl?: string;
}

export default function LoginForm({ error, callbackUrl }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      await signIn('microsoft-entra-id', {
        callbackUrl: callbackUrl || '/dashboard',
        redirect: true,
      });
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {decodeURIComponent(error)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleLogin}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={isLoading}
          className={`
            relative w-full group
            px-6 py-4
            bg-gradient-to-r from-blue-600 to-purple-600
            text-white font-semibold
            rounded-xl
            hover:from-blue-700 hover:to-purple-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            shadow-lg hover:shadow-xl
            transform hover:-translate-y-0.5
            overflow-hidden
          `}
        >
          {/* Animated background effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
          
          {/* Content */}
          <div className="relative flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Connecting to SSO...</span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  <ShieldCheck className="h-4 w-4 text-green-300" />
                </div>
                <span className="font-medium text-lg">Sign in with Enterprise SSO</span>
                <ArrowRight className={`h-5 w-5 transition-transform duration-200 ${
                  isHovered ? 'translate-x-1' : ''
                }`} />
              </>
            )}
          </div>
          
          {/* Bottom glow effect */}
          <div className="absolute -bottom-1 left-1/4 right-1/4 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur transition-all duration-300 group-hover:w-full group-hover:left-0 group-hover:right-0" />
        </button>
      </div>

      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Single sign-on enabled</span>
          </div>
          <div className="h-1 w-1 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>No password required</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500">
          You will be redirected to your organization&apos;s secure login page
        </p>
      </div>
    </div>
  );
}