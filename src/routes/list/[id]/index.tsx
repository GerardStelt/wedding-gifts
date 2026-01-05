import { component$, useSignal, useStore, $, useComputed$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useLocation } from '@builder.io/qwik-city';
import { 
  HiGiftSolid, 
  HiHeartSolid, 
  HiMagnifyingGlassSolid, 
  HiFunnelSolid,
  HiCheckCircleSolid,
  HiXMarkSolid,
  HiShoppingBagSolid,
  HiSparklesSolid,
  HiCreditCardSolid,
  HiEnvelopeSolid,
  HiUserSolid,
  HiChatBubbleLeftSolid
} from '@qwikest/icons/heroicons';
import { giftRepository } from '~/lib/data/gift-repository';
import { categoryLabels, categoryEmojis, type Gift, type GiftCategory } from '~/lib/types';

interface PurchasedGift {
  giftId: string;
  buyerName: string;
  purchasedAt: Date;
}

interface WishlistItem {
  gift: Gift;
  isPurchased: boolean;
  purchasedBy?: string;
}

// Demo wishlist (in production, this would come from the database based on the list ID)
const demoWishlistIds = ['k1', 'k2', 'k3', 'b1', 'b3', 'l1', 'l2', 'g1', 'e1', 'x1', 'x3', 't1', 't2', 't4'];

// Demo couple info (in production, this would come from the database)
const demoCoupleInfo = {
  brideName: 'Sophie',
  partnerName: 'Thomas',
  weddingDate: 'June 15, 2026',
};

export default component$(() => {
  const location = useLocation();
  const listId = location.params.id;
  
  const searchQuery = useSignal('');
  const selectedCategory = useSignal<GiftCategory | 'all'>('all');
  const showPurchaseModal = useSignal(false);
  const selectedGift = useSignal<Gift | null>(null);
  
  // Purchased gifts store (simulates database)
  const purchasedGifts = useStore<{ items: PurchasedGift[] }>({ 
    items: [
      // Pre-purchased items for demo
      { giftId: 'k2', buyerName: 'Aunt Maria', purchasedAt: new Date('2026-01-03') },
      { giftId: 'b1', buyerName: 'Uncle Jan', purchasedAt: new Date('2026-01-04') },
    ] 
  });
  
  // Form state
  const buyerName = useSignal('');
  const buyerEmail = useSignal('');
  const buyerMessage = useSignal('');
  const isPurchasing = useSignal(false);
  const purchaseComplete = useSignal(false);

  // Build wishlist with purchase status
  const wishlistItems = useComputed$(() => {
    return demoWishlistIds
      .map(id => giftRepository.find(g => g.id === id))
      .filter((g): g is Gift => g !== undefined)
      .map(gift => {
        const purchased = purchasedGifts.items.find(p => p.giftId === gift.id);
        return {
          gift,
          isPurchased: !!purchased,
          purchasedBy: purchased?.buyerName,
        } as WishlistItem;
      });
  });

  const filteredWishlist = useComputed$(() => {
    return wishlistItems.value.filter(item => {
      const matchesSearch = item.gift.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.gift.description.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchesCategory = selectedCategory.value === 'all' || item.gift.category === selectedCategory.value;
      return matchesSearch && matchesCategory;
    });
  });

  const stats = useComputed$(() => {
    const total = wishlistItems.value.length;
    const purchased = wishlistItems.value.filter(i => i.isPurchased).length;
    const totalValue = wishlistItems.value.reduce((sum, i) => sum + i.gift.price, 0);
    const purchasedValue = wishlistItems.value.filter(i => i.isPurchased).reduce((sum, i) => sum + i.gift.price, 0);
    return { total, purchased, available: total - purchased, totalValue, purchasedValue };
  });

  const openPurchaseModal = $((gift: Gift) => {
    selectedGift.value = gift;
    showPurchaseModal.value = true;
    purchaseComplete.value = false;
    buyerName.value = '';
    buyerEmail.value = '';
    buyerMessage.value = '';
  });

  const closePurchaseModal = $(() => {
    showPurchaseModal.value = false;
    selectedGift.value = null;
    purchaseComplete.value = false;
  });

  const handlePurchase = $(async () => {
    if (!selectedGift.value || !buyerName.value || !buyerEmail.value) return;
    
    isPurchasing.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    purchasedGifts.items.push({
      giftId: selectedGift.value.id,
      buyerName: buyerName.value,
      purchasedAt: new Date(),
    });
    
    isPurchasing.value = false;
    purchaseComplete.value = true;
  });

  const categories: (GiftCategory | 'all')[] = ['all', 'kitchen', 'bedroom', 'living', 'garden', 'electronics', 'experiences', 'travel'];

  // For debugging/demo purposes
  console.log('Viewing gift list:', listId);

  return (
    <div class="min-h-dvh bg-linear-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section class="relative pt-12 pb-16 overflow-hidden">
        {/* Cloudy gradient background */}
        <div class="absolute inset-0 bg-linear-to-br from-pink-100/80 via-rose-50/60 to-pink-50/40" />
        <div class="absolute -top-20 -left-20 w-96 h-96 bg-pink-200/50 rounded-full blur-3xl" />
        <div class="absolute top-10 right-1/4 w-80 h-80 bg-rose-200/40 rounded-full blur-3xl" />
        <div class="absolute top-1/2 -left-10 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl" />
        <div class="absolute -bottom-20 right-10 w-[500px] h-[500px] bg-rose-100/50 rounded-full blur-3xl" />
        <div class="absolute bottom-20 left-1/3 w-64 h-64 bg-pink-200/40 rounded-full blur-3xl" />
        
        <div class="container relative">
          <div class="max-w-3xl mx-auto text-center">
            {/* Wedding Rings Icon */}
            <div class="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-linear-to-br from-pink-400 to-rose-500 shadow-xl shadow-pink-200">
              <HiHeartSolid class="w-10 h-10 text-white" />
            </div>
            
            <p class="text-pink-600 font-medium tracking-widest uppercase text-sm mb-3">Wedding Gift Registry</p>
            
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 mb-4">
              {demoCoupleInfo.brideName} & {demoCoupleInfo.partnerName}
            </h1>
            
            <div class="flex items-center justify-center gap-4 text-gray-500 mb-6">
              <span class="w-12 h-px bg-gray-300" />
              <span class="font-light text-lg">{demoCoupleInfo.weddingDate}</span>
              <span class="w-12 h-px bg-gray-300" />
            </div>
            
            <p class="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
              We're so grateful you're joining us on our special day. If you'd like to help us 
              start our new life together, we've curated a selection of gifts we'd love.
            </p>
          </div>

          {/* Stats Cards */}
          <div class="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
            <div class="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 text-center">
              <div class="text-3xl font-bold text-gray-800">{stats.value.total}</div>
              <div class="text-sm text-gray-500 mt-1">Total Gifts</div>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 text-center">
              <div class="text-3xl font-bold text-emerald-600">{stats.value.purchased}</div>
              <div class="text-sm text-gray-500 mt-1">Purchased</div>
            </div>
            <div class="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 text-center">
              <div class="text-3xl font-bold text-pink-600">{stats.value.available}</div>
              <div class="text-sm text-gray-500 mt-1">Still Needed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift List Section */}
      <section class="container py-12">
        {/* Search and Filters */}
        <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 mb-10">
          <div class="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div class="relative flex-1">
              <HiMagnifyingGlassSolid class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search gifts..."
                bind:value={searchQuery}
                class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Category Filter */}
            <div class="relative">
              <HiFunnelSolid class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                bind:value={selectedCategory}
                title="Filter by category"
                aria-label="Filter by category"
                class="appearance-none pl-12 pr-12 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all duration-200 cursor-pointer min-w-[220px] text-gray-700"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? '✨ All Categories' : `${categoryEmojis[cat]} ${categoryLabels[cat]}`}
                  </option>
                ))}
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Gift Grid - using subgrid for aligned buttons */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWishlist.value.map(item => (
            <div
              key={item.gift.id}
              class={`group grid grid-rows-subgrid row-span-4 bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 ${
                item.isPurchased ? '' : 'hover:shadow-2xl hover:-translate-y-1'
              }`}
            >
              {/* Image */}
              <div class="relative aspect-4/3 overflow-hidden">
                <img
                  src={item.gift.imageUrl}
                  alt={item.gift.name}
                  width={400}
                  height={300}
                  class={`w-full h-full object-cover transition-transform duration-500 ${
                    item.isPurchased ? 'grayscale opacity-60' : 'group-hover:scale-110'
                  }`}
                />
                <div class={`absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent ${item.isPurchased ? 'opacity-60' : ''}`} />
                
                {/* Category Badge */}
                <div class={`absolute top-4 left-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm ${item.isPurchased ? 'opacity-60' : ''}`}>
                  {categoryEmojis[item.gift.category]} {categoryLabels[item.gift.category]}
                </div>

                {/* Purchased Ribbon Banner */}
                {item.isPurchased && (
                  <div class="absolute -right-[50px] top-[18px] rotate-45 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider py-2 w-[170px] text-center shadow-md">
                    Purchased
                  </div>
                )}

                {/* Price Tag */}
                <div class={`absolute bottom-4 left-4 ${item.isPurchased ? 'opacity-60' : ''}`}>
                  <span class="text-2xl font-bold text-white drop-shadow-lg">
                    €{item.gift.price.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Brand & Title */}
              <div class={`px-5 pt-4 ${item.isPurchased ? 'opacity-60' : ''}`}>
                <span class="block text-xs font-semibold text-pink-500 uppercase tracking-wider min-h-4">
                  {item.gift.brand || '\u00A0'}
                </span>
                <h3 class="text-lg font-bold text-gray-800 line-clamp-1">{item.gift.name}</h3>
              </div>

              {/* Description */}
              <p class={`px-5 text-sm text-gray-500 line-clamp-2 ${item.isPurchased ? 'opacity-60' : ''}`}>{item.gift.description}</p>
              
              {/* Action Button */}
              <div class="px-5 pt-4 pb-5 mt-auto">
                {item.isPurchased ? (
                  <div class="flex items-center gap-2 text-sm py-3">
                    <HiGiftSolid class="w-4 h-4 text-emerald-500" />
                    <span class="text-gray-600">Gifted by <span class="font-medium text-gray-800">{item.purchasedBy}</span></span>
                  </div>
                ) : (
                  <button
                    onClick$={() => openPurchaseModal(item.gift)}
                    class="w-full py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <HiShoppingBagSolid class="w-5 h-5" />
                    Purchase This Gift
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredWishlist.value.length === 0 && (
          <div class="text-center py-20">
            <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <HiMagnifyingGlassSolid class="w-12 h-12 text-gray-300" />
            </div>
            <h3 class="text-xl font-semibold text-gray-600">No gifts found</h3>
            <p class="text-gray-400 mt-2">Try adjusting your search or filter</p>
          </div>
        )}
      </section>

      {/* Message to Couple Section */}
      <section class="bg-white py-16">
        <div class="container">
          <div class="max-w-2xl mx-auto text-center">
            <HiSparklesSolid class="w-10 h-10 text-pink-400 mx-auto mb-4" />
            <h2 class="text-2xl md:text-3xl font-serif text-gray-800 mb-4">Thank You for Your Generosity</h2>
            <p class="text-gray-600 leading-relaxed">
              Every gift, big or small, helps us build our new home together. 
              We're so touched by your kindness and can't wait to celebrate with you!
            </p>
            <div class="mt-8 flex items-center justify-center gap-2 text-pink-600">
              <HiHeartSolid class="w-5 h-5" />
              <span class="font-medium">{demoCoupleInfo.brideName} & {demoCoupleInfo.partnerName}</span>
              <HiHeartSolid class="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Modal */}
      {showPurchaseModal.value && selectedGift.value && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick$={closePurchaseModal}
          />
          
          {/* Modal */}
          <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {!purchaseComplete.value ? (
              <>
                {/* Modal Header */}
                <div class="relative h-40 overflow-hidden">
                  <img
                    src={selectedGift.value.imageUrl}
                    alt={selectedGift.value.name}
                    width={600}
                    height={200}
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                  <button
                    onClick$={closePurchaseModal}
                    class="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                    aria-label="Close modal"
                  >
                    <HiXMarkSolid class="w-5 h-5" />
                  </button>
                  <div class="absolute bottom-4 left-6 right-6">
                    <h3 class="text-xl font-bold text-white">{selectedGift.value.name}</h3>
                    <p class="text-white/80 text-lg font-semibold mt-1">
                      €{selectedGift.value.price.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Modal Body */}
                <div class="p-6">
                  <div class="mb-6">
                    <div class="flex items-center gap-2 text-pink-600 mb-2">
                      <HiGiftSolid class="w-5 h-5" />
                      <span class="font-semibold">Purchase this gift for {demoCoupleInfo.brideName} & {demoCoupleInfo.partnerName}</span>
                    </div>
                    <p class="text-sm text-gray-500">
                      Fill in your details below. The couple will be notified of your generous gift!
                    </p>
                  </div>

                  <form preventdefault:submit onSubmit$={handlePurchase} class="space-y-4">
                    {/* Name Input */}
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
                      <div class="relative">
                        <HiUserSolid class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          bind:value={buyerName}
                          required
                          placeholder="Enter your name"
                          class="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1.5">Your Email *</label>
                      <div class="relative">
                        <HiEnvelopeSolid class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          bind:value={buyerEmail}
                          required
                          placeholder="your@email.com"
                          class="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Message Input */}
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1.5">Personal Message (Optional)</label>
                      <div class="relative">
                        <HiChatBubbleLeftSolid class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <textarea
                          bind:value={buyerMessage}
                          placeholder="Write a message to the couple..."
                          rows={3}
                          class="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Payment Notice */}
                    <div class="flex items-start gap-3 p-4 bg-pink-50 rounded-xl">
                      <HiCreditCardSolid class="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                      <p class="text-sm text-pink-800">
                        <strong>Demo Mode:</strong> In a real scenario, you would be redirected to a secure payment page. 
                        For this demo, clicking "Confirm Purchase" will simulate the purchase.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isPurchasing.value || !buyerName.value || !buyerEmail.value}
                      class="w-full py-4 bg-linear-to-r from-pink-500 to-rose-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isPurchasing.value ? (
                        <>
                          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <HiCreditCardSolid class="w-5 h-5" />
                          Confirm Purchase - €{selectedGift.value.price.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* Success State */
              <div class="p-8 text-center">
                <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <HiCheckCircleSolid class="w-12 h-12 text-emerald-500" />
                </div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
                <p class="text-gray-600 mb-6">
                  Your purchase of <strong>{selectedGift.value.name}</strong> has been confirmed. 
                  {demoCoupleInfo.brideName} & {demoCoupleInfo.partnerName} will be thrilled!
                </p>
                <div class="p-4 bg-pink-50 rounded-2xl mb-6">
                  <p class="text-sm text-pink-800">
                    A confirmation email has been sent to <strong>{buyerEmail.value}</strong>
                  </p>
                </div>
                <button
                  onClick$={closePurchaseModal}
                  class="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Back to Gift List
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Wedding Gift Registry | Wedding Gifts",
  meta: [
    {
      name: 'description',
      content: "Browse and purchase gifts from the wedding gift registry",
    },
  ],
};
