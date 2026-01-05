import { component$ } from '@builder.io/qwik';
import { Form, routeAction$ } from '@builder.io/qwik-city';

export const useLoginAction = routeAction$(async (data, requestEvent) => {
  const email = data.email as string;
  const password = data.password as string;

  // TODO: Add actual authentication logic here
  console.log('Login attempt:', email);

  // Redirect to client page on successful login
  throw requestEvent.redirect(302, '/client');
});

export default component$(() => {
  const loginAction = useLoginAction();
  return (
    <div class="min-h-dvh grid grid-cols-1 lg:grid-cols-2">
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
      <div class="grid place-items-center bg-white px-4 py-12">
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
              <div class="space-y-2">
                <label for="email" class="text-sm font-medium text-neutral-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  class="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition"
                  placeholder="you@example.com"
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
