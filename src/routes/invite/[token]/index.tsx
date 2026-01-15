import { component$, useSignal, $ } from '@builder.io/qwik';
import { Form, routeAction$, routeLoader$, Link } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import {
  HiHeartSolid,
  HiUserSolid,
  HiEnvelopeSolid,
  HiPhoneSolid,
  HiCalendarDaysSolid,
  HiLockClosedSolid,
  HiSparklesSolid,
  HiGiftSolid,
  HiCheckCircleSolid,
  HiExclamationTriangleSolid,
} from '@qwikest/icons/heroicons';

// Mock invite data - in production this would fetch from database
const mockInvites: Record<string, { brideName: string; partnerName?: string; weddingDate?: string; franchiseeName: string; email: string; status: string }> = {
  'abc123': {
    brideName: 'Maria Kuiper',
    partnerName: 'Jan Peters',
    weddingDate: '2026-07-20',
    franchiseeName: 'Wedding Dreams Amsterdam',
    email: 'maria.k@example.com',
    status: 'pending',
  },
  'xyz789': {
    brideName: 'Nina Bos',
    franchiseeName: 'Bridal Gifts Rotterdam',
    email: 'nina.b@example.com',
    status: 'expired',
  },
};

export const useInviteLoader = routeLoader$(async (requestEvent) => {
  const token = requestEvent.params.token;
  
  // TODO: Fetch actual invite from database
  const invite = mockInvites[token];
  
  if (!invite) {
    return { found: false, expired: false, invite: null };
  }
  
  if (invite.status === 'expired') {
    return { found: true, expired: true, invite };
  }
  
  return { found: true, expired: false, invite };
});

export const useAcceptInviteAction = routeAction$(async (data, requestEvent) => {
  const token = requestEvent.params.token;
  
  // Extract form data
  const formData = {
    token,
    brideName: data.brideName as string,
    partnerName: data.partnerName as string,
    email: data.email as string,
    phone: data.phone as string,
    weddingDate: data.weddingDate as string,
    password: data.password as string,
  };

  // TODO: Add actual registration logic here
  console.log('Bride registration:', formData);

  // Redirect to client dashboard on successful registration
  throw requestEvent.redirect(302, '/client');
});

export default component$(() => {
  // const location = useLocation();
  const inviteData = useInviteLoader();
  const acceptAction = useAcceptInviteAction();
  const showPassword = useSignal(false);

  const togglePassword = $(() => {
    showPassword.value = !showPassword.value;
  });

  // Invalid or not found invite
  if (!inviteData.value.found) {
    return (
      <div class="min-h-dvh bg-linear-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-xl shadow-pink-100 p-8 max-w-md w-full text-center">
          <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <HiExclamationTriangleSolid class="w-8 h-8 text-red-500" />
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Invalid Invitation</h1>
          <p class="text-gray-500 mb-6">
            This invitation link is invalid or has already been used. Please contact your wedding planner for a new invitation.
          </p>
          <Link
            href="/"
            class="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-200 hover:shadow-xl transition-all"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Expired invite
  if (inviteData.value.expired) {
    return (
      <div class="min-h-dvh bg-linear-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-xl shadow-pink-100 p-8 max-w-md w-full text-center">
          <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
            <HiCalendarDaysSolid class="w-8 h-8 text-amber-500" />
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Invitation Expired</h1>
          <p class="text-gray-500 mb-6">
            This invitation has expired. Please contact <span class="font-medium text-gray-700">{inviteData.value.invite?.franchiseeName}</span> to request a new invitation link.
          </p>
          <Link
            href="/"
            class="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-200 hover:shadow-xl transition-all"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const invite = inviteData.value.invite!;

  return (
    <div class="min-h-dvh grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Welcome message (hidden on mobile) */}
      <div class="hidden lg:flex flex-col justify-center bg-linear-to-br from-pink-400 via-rose-500 to-pink-600 p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div class="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div class="absolute bottom-32 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />
        
        <div class="relative max-w-md mx-auto text-white space-y-8">
          <div>
            <div class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <HiHeartSolid class="w-8 h-8 text-white" />
            </div>
            <h1 class="text-4xl font-bold mb-4">
              Congratulations, {invite.brideName.split(' ')[0]}! 💍
            </h1>
            <p class="text-pink-100 text-lg">
              You've been invited to create your dream wedding gift registry.
            </p>
          </div>

          <div class="bg-white/10 backdrop-blur rounded-2xl p-6 space-y-4">
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <HiSparklesSolid class="w-5 h-5" />
              What you can do
            </h2>
            <ul class="space-y-3">
              {[
                'Browse our curated gift collection',
                'Create your personalized wishlist',
                'Share your registry with guests',
                'Track gifts and contributions',
              ].map((item, index) => (
                <li key={index} class="flex items-start gap-3">
                  <HiCheckCircleSolid class="w-5 h-5 text-pink-200 mt-0.5 shrink-0" />
                  <span class="text-pink-50">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div class="flex items-center gap-3 pt-4">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <HiGiftSolid class="w-5 h-5 text-white" />
            </div>
            <div>
              <p class="text-pink-100 text-sm">Invited by</p>
              <p class="font-semibold">{invite.franchiseeName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Registration form */}
      <div class="flex items-center justify-center bg-linear-to-br from-rose-50 via-pink-50 to-amber-50 px-4 py-12">
        <div class="w-full max-w-md space-y-8">
          {/* Mobile header (shown only on small screens) */}
          <div class="lg:hidden text-center space-y-3">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-linear-to-br from-pink-400 to-rose-500 flex items-center justify-center">
              <HiHeartSolid class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">
                Welcome, {invite.brideName.split(' ')[0]}! 💍
              </h1>
              <p class="text-gray-500 text-sm mt-1">
                Complete your profile to start building your registry
              </p>
            </div>
            <p class="text-xs text-gray-400">
              Invited by {invite.franchiseeName}
            </p>
          </div>

          {/* Registration card */}
          <div class="bg-white rounded-3xl shadow-xl shadow-pink-100 p-8">
            <div class="hidden lg:block mb-6">
              <h2 class="text-2xl font-bold text-gray-800">Complete Your Profile</h2>
              <p class="text-gray-500 text-sm mt-1">Fill in your details to get started</p>
            </div>

            <Form action={acceptAction} class="space-y-5">
              {/* Bride Name */}
              <div class="space-y-1.5">
                <label for="brideName" class="text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <div class="relative">
                  <HiUserSolid class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="brideName"
                    name="brideName"
                    type="text"
                    value={invite.brideName}
                    class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              {/* Partner Name */}
              <div class="space-y-1.5">
                <label for="partnerName" class="text-sm font-medium text-gray-700">
                  Partner's Name
                </label>
                <div class="relative">
                  <HiHeartSolid class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="partnerName"
                    name="partnerName"
                    type="text"
                    value={invite.partnerName || ''}
                    class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition"
                    placeholder="Your partner's name"
                  />
                </div>
              </div>

              {/* Email & Phone row */}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label for="email" class="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div class="relative">
                    <HiEnvelopeSolid class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={invite.email}
                      class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition bg-gray-50"
                      placeholder="you@example.com"
                      required
                      readOnly
                    />
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label for="phone" class="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div class="relative">
                    <HiPhoneSolid class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition"
                      placeholder="+31 6 12345678"
                    />
                  </div>
                </div>
              </div>

              {/* Wedding Date */}
              <div class="space-y-1.5">
                <label for="weddingDate" class="text-sm font-medium text-gray-700">
                  Wedding Date
                </label>
                <div class="relative">
                  <HiCalendarDaysSolid class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="weddingDate"
                    name="weddingDate"
                    type="date"
                    value={invite.weddingDate || ''}
                    title="Select your wedding date"
                    class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div class="space-y-1.5">
                <label for="password" class="text-sm font-medium text-gray-700">
                  Create Password
                </label>
                <div class="relative">
                  <HiLockClosedSolid class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword.value ? 'text' : 'password'}
                    class="w-full pl-11 pr-20 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition"
                    placeholder="••••••••"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick$={togglePassword}
                    class="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 font-medium"
                  >
                    {showPassword.value ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p class="text-xs text-gray-400">Minimum 8 characters</p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                class="w-full py-3.5 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <HiSparklesSolid class="w-5 h-5" />
                Start Building My Registry
              </button>
            </Form>
          </div>

          {/* Already have account link */}
          <p class="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" class="text-pink-600 font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Accept Your Invitation | Wedding Gifts',
  meta: [
    {
      name: 'description',
      content: 'Complete your profile and start building your dream wedding gift registry',
    },
  ],
};

