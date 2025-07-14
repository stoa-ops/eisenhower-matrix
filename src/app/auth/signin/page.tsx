'use client';

import { signIn, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    
    checkSession();
  }, [router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn('todoist', { callbackUrl: '/dashboard' });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Eisenhower Matrix
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Organize your Todoist tasks by priority
              </p>
            </div>
            
            <div>
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Connecting...' : 'Connect with Todoist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}