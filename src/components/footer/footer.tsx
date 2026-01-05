import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { HiHeartSolid } from '@qwikest/icons/heroicons';

export const Footer = component$(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer class="bg-linear-to-r from-pink-500 to-rose-500 text-white">
      <div class="container py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div class="md:col-span-1">
            <Link href="/" class="flex items-center gap-2 group mb-4">
              <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors">
                <HiHeartSolid class="size-5" />
              </span>
              <span class="text-2xl font-bold tracking-tight">WeddingGifts</span>
            </Link>
            <p class="text-pink-100 text-sm leading-relaxed">
              Making your special day even more memorable with thoughtful gifts for your beloved guests.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 class="font-semibold text-lg mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><Link href="/diensten" class="text-pink-100 hover:text-white transition-colors">For Brides</Link></li>
              <li><Link href="/over-ons" class="text-pink-100 hover:text-white transition-colors">For Guests</Link></li>
              <li><Link href="/inspiratie" class="text-pink-100 hover:text-white transition-colors">Franchise</Link></li>
              <li><Link href="/contact" class="text-pink-100 hover:text-white transition-colors">How it Works</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 class="font-semibold text-lg mb-4">Support</h3>
            <ul class="space-y-2">
              <li><Link href="/faq" class="text-pink-100 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" class="text-pink-100 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" class="text-pink-100 hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" class="text-pink-100 hover:text-white transition-colors">Returns</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 class="font-semibold text-lg mb-4">Legal</h3>
            <ul class="space-y-2">
              <li><Link href="/privacy" class="text-pink-100 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" class="text-pink-100 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" class="text-pink-100 hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div class="border-t border-white/20">
        <div class="container py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-pink-100 text-sm">
            © {currentYear} WeddingGifts. All rights reserved.
          </p>
          <p class="text-pink-100 text-sm flex items-center gap-1">
            Made with <HiHeartSolid class="size-4 text-white" /> in the Netherlands
          </p>
        </div>
      </div>
    </footer>
  );
});

