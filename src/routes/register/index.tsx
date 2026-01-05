import { component$, useSignal, $ } from '@builder.io/qwik';
import { Form, routeAction$, Link } from '@builder.io/qwik-city';
import {
  HiBuildingStorefrontSolid,
  HiUserSolid,
  HiEnvelopeSolid,
  HiPhoneSolid,
  HiMapPinSolid,
  HiLockClosedSolid,
  HiCheckCircleSolid,
  HiSparklesSolid,
} from '@qwikest/icons/heroicons';

export const useRegisterAction = routeAction$(async (data, requestEvent) => {
  // Extract form data
  const formData = {
    companyName: data.companyName as string,
    contactName: data.contactName as string,
    email: data.email as string,
    phone: data.phone as string,
    city: data.city as string,
    password: data.password as string,
  };

  // TODO: Add actual registration logic here
  console.log('Franchisee registration:', formData);

  // Redirect to admin dashboard on successful registration
  throw requestEvent.redirect(302, '/admin');
});

export default component$(() => {
  const registerAction = useRegisterAction();
  const agreedToTerms = useSignal(false);
  const showPassword = useSignal(false);

  const togglePassword = $(() => {
    showPassword.value = !showPassword.value;
  });

  const benefits = [
    'Access to our curated gift catalog',
    'Dedicated dashboard to manage clients',
    '10% commission on all gift purchases',
    'Marketing materials & support',
    'Real-time analytics & reporting',
  ];

  return (
    <div class="min-h-dvh grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Benefits (hidden on mobile) */}
      <div class="hidden lg:flex flex-col justify-center bg-linear-to-br from-teal-500 to-emerald-600 p-12">
        <div class="max-w-md mx-auto text-white space-y-8">
          <div>
            <div class="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <HiBuildingStorefrontSolid class="w-8 h-8 text-white" />
            </div>
            <h1 class="text-4xl font-bold mb-4">Become a Franchisee</h1>
            <p class="text-teal-100 text-lg">
              Join our network of wedding gift specialists and grow your business with us.
            </p>
          </div>

          <div class="space-y-4">
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <HiSparklesSolid class="w-5 h-5" />
              What you'll get
            </h2>
            <ul class="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} class="flex items-start gap-3">
                  <HiCheckCircleSolid class="w-5 h-5 text-teal-200 mt-0.5 shrink-0" />
                  <span class="text-teal-50">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div class="pt-6 border-t border-white/20">
            <p class="text-teal-100 text-sm">
              Already a partner?{' '}
              <Link href="/login" class="text-white font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Registration form */}
      <div class="flex items-center justify-center bg-slate-50 px-4 py-12">
        <div class="w-full max-w-md space-y-8">
          {/* Mobile header (shown only on small screens) */}
          <div class="lg:hidden text-center space-y-2">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-linear-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <HiBuildingStorefrontSolid class="w-7 h-7 text-white" />
            </div>
            <h1 class="text-2xl font-bold text-slate-800">Become a Franchisee</h1>
            <p class="text-slate-500 text-sm">Join our network of wedding gift specialists</p>
          </div>

          {/* Registration card */}
          <div class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8">
            <div class="hidden lg:block mb-6">
              <h2 class="text-2xl font-bold text-slate-800">Create your account</h2>
              <p class="text-slate-500 text-sm mt-1">Fill in your details to get started</p>
            </div>

            <Form action={registerAction} class="space-y-5">
              {/* Company Name */}
              <div class="space-y-1.5">
                <label for="companyName" class="text-sm font-medium text-slate-700">
                  Company / Business Name
                </label>
                <div class="relative">
                  <HiBuildingStorefrontSolid class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition"
                    placeholder="Your Business Name"
                    required
                  />
                </div>
              </div>

              {/* Contact Name */}
              <div class="space-y-1.5">
                <label for="contactName" class="text-sm font-medium text-slate-700">
                  Your Full Name
                </label>
                <div class="relative">
                  <HiUserSolid class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="contactName"
                    name="contactName"
                    type="text"
                    class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email & Phone row */}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label for="email" class="text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <div class="relative">
                    <HiEnvelopeSolid class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label for="phone" class="text-sm font-medium text-slate-700">
                    Phone Number
                  </label>
                  <div class="relative">
                    <HiPhoneSolid class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition"
                      placeholder="+31 6 12345678"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* City */}
              <div class="space-y-1.5">
                <label for="city" class="text-sm font-medium text-slate-700">
                  City / Region
                </label>
                <div class="relative">
                  <HiMapPinSolid class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="city"
                    name="city"
                    type="text"
                    class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition"
                    placeholder="Amsterdam"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div class="space-y-1.5">
                <label for="password" class="text-sm font-medium text-slate-700">
                  Password
                </label>
                <div class="relative">
                  <HiLockClosedSolid class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword.value ? 'text' : 'password'}
                    class="w-full pl-11 pr-20 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition"
                    placeholder="••••••••"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick$={togglePassword}
                    class="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700 font-medium"
                  >
                    {showPassword.value ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p class="text-xs text-slate-400">Minimum 8 characters</p>
              </div>

              {/* Terms checkbox */}
              <div class="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  bind:checked={agreedToTerms}
                  class="mt-1 w-4 h-4 rounded border-slate-300 text-teal-500 focus:ring-teal-400"
                  required
                />
                <label for="terms" class="text-sm text-slate-600">
                  I agree to the{' '}
                  <a href="/terms" class="text-teal-600 hover:underline font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" class="text-teal-600 hover:underline font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                class="w-full py-3.5 bg-linear-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                Create Franchisee Account
              </button>
            </Form>
          </div>

          {/* Mobile sign in link */}
          <p class="lg:hidden text-center text-sm text-slate-500">
            Already a partner?{' '}
            <Link href="/login" class="text-teal-600 font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
});

