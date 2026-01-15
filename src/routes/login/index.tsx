import { component$ } from '@builder.io/qwik';
import { Form, routeAction$ } from '@builder.io/qwik-city';
import { setUserSession } from '~/lib/auth/session';
import type { User } from '~/lib/types';

// Dummy accounts for testing
const DUMMY_ACCOUNTS = {
  // Client/Bride account
  'bride@example.com': {
    password: 'password',
    role: 'client' as const,
    name: 'Sophie de Vries',
    id: 'client-1',
  },
  // Franchisee/Admin account
  'franchisee@example.com': {
    password: 'password',
    role: 'franchisee' as const,
    name: 'Wedding Dreams',
    id: 'franchisee-1',
  },
};

export const useLoginAction = routeAction$(async (data, requestEvent) => {
  const email = data.email as string;
  const password = data.password as string;

  // Check against dummy accounts
  const account = DUMMY_ACCOUNTS[email as keyof typeof DUMMY_ACCOUNTS];
  
  if (!account || account.password !== password) {
    return {
      success: false,
      failed: true,
      message: 'Wrong credentials. Please check your email and password.',
    };
  }

  // Create user object
  const user: User = {
    id: account.id,
    email: email,
    role: account.role,
    name: account.name,
    ...(account.role === 'client' 
      ? { clientId: account.id } 
      : { franchiseeId: account.id }
    ),
  };

  // Set user session
  setUserSession(requestEvent, user);

  // Redirect based on user role
  const redirectPath = user.role === 'franchisee' ? '/admin' : '/client';
  throw requestEvent.redirect(302, redirectPath);
});

export default component$(() => {
  const loginAction = useLoginAction();
  return (
    <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2 lg:min-h-dvh">
      {/* Left side - Branding (hidden on mobile) */}
      <div class="hidden lg:grid place-items-center bg-linear-to-br from-pink-500 to-rose-600 p-12">
        <div class="max-w-md text-center text-white space-y-6">
          {/* Your logo here */}
          <div class="text-6xl">💍</div>
          <h1 class="text-4xl font-bold">Our Wedding</h1>
          <p class="text-pink-100 text-lg">
            Manage your gift registry with ease
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div class="flex items-center justify-center bg-white px-4 py-12 min-h-screen lg:min-h-0 lg:grid lg:place-items-center">
        <div class="w-full max-w-sm space-y-8">
          {/* Mobile logo (shown only on small screens) */}
          <div class="lg:hidden text-center space-y-2">
            <div class="text-5xl">💍</div>
            <h1 class="text-2xl font-semibold text-neutral-800">Our Wedding</h1>
          </div>

          {/* Login card */}
          <div class="space-y-6">
            <div class="text-center lg:text-left">
              <h2 class="text-2xl font-semibold text-neutral-800">Welcome Back</h2>
              <p class="text-neutral-500 text-sm mt-1">Sign in to continue</p>
            </div>

            <Form action={loginAction} class="space-y-4">
              {loginAction.value?.failed && (
                <div class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {loginAction.value.message || 'Wrong credentials'}
                </div>
              )}

              <div class="space-y-2">
                <label for="email" class="text-sm font-medium text-neutral-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  class="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition"
                  placeholder="bride@example.com"
                  required
                />
              </div>

              <div class="space-y-2">
                <label for="password" class="text-sm font-medium text-neutral-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  class="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" class="btn btn-primary w-full">
                Sign In
              </button>
            </Form>

            {/* Dummy account info */}
            <div class="mt-4 p-3 bg-neutral-50 rounded-lg text-xs text-neutral-600 space-y-1">
              <p class="font-semibold">Test Accounts:</p>
              <p>Client: <span class="font-mono">bride@example.com</span> / password</p>
              <p>Franchisee: <span class="font-mono">franchisee@example.com</span> / password</p>
            </div>

            {/* Divider */}
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-neutral-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="bg-white px-4 text-neutral-500">New franchisee?</span>
              </div>
            </div>

            {/* Register link */}
            <a href="/register" class="btn btn-outline w-full">
              Register as Franchisee
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});
