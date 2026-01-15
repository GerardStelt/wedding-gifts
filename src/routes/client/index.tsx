import { component$, useSignal, useStore, $, useComputed$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useNavigate } from '@builder.io/qwik-city';
import { HiPlusCircleSolid, HiTrashSolid, HiGiftSolid, HiBanknotesOutline, HiCheckCircleSolid, HiMagnifyingGlassSolid, HiFunnelSolid, HiSparklesSolid, HiXMarkSolid, HiEnvelopeSolid } from '@qwikest/icons/heroicons';
import { giftRepository } from '~/lib/data/gift-repository';
import { categoryLabels, categoryEmojis, type Gift, type GiftCategory, type GiftPreference, type WishlistItem } from '~/lib/types';

export default component$(() => {
  const nav = useNavigate();
  const searchQuery = useSignal('');
  const selectedCategory = useSignal<GiftCategory | 'all'>('all');
  const wishlist = useStore<{ items: WishlistItem[] }>({ items: [] });
  const showWishlist = useSignal(false);

  const filteredGifts = useComputed$(() => {
    return giftRepository.filter(gift => {
      const matchesSearch = gift.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        gift.description.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchesCategory = selectedCategory.value === 'all' || gift.category === selectedCategory.value;
      return matchesSearch && matchesCategory;
    });
  });

  const addToWishlist = $((gift: Gift, preference: GiftPreference) => {
    if (!wishlist.items.some(item => item.gift.id === gift.id)) {
      wishlist.items.push({
        gift,
        preference,
        addedAt: new Date(),
      });
    }
  });

  const removeFromWishlist = $((giftId: string) => {
    const index = wishlist.items.findIndex(item => item.gift.id === giftId);
    if (index > -1) {
      wishlist.items.splice(index, 1);
    }
  });

  const updatePreference = $((giftId: string, preference: GiftPreference) => {
    const item = wishlist.items.find(item => item.gift.id === giftId);
    if (item) {
      item.preference = preference;
    }
  });

  const totalValue = useComputed$(() => {
    return wishlist.items.reduce((sum, item) => sum + item.gift.price, 0);
  });

  const categories: (GiftCategory | 'all')[] = ['all', 'kitchen', 'bedroom', 'living', 'garden', 'electronics', 'experiences', 'travel'];

  return (
    <div class="min-h-dvh bg-linear-to-br from-rose-50 via-pink-50 to-amber-50">
      {/* Header */}
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-pink-100 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-linear-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-200">
                <HiSparklesSolid class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 class="text-2xl font-bold bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  My Wishlist
                </h1>
                <p class="text-sm text-gray-500">Curate your perfect wedding gifts</p>
              </div>
            </div>

            <button
              onClick$={() => showWishlist.value = !showWishlist.value}
              class="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-full font-medium shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 transition-all duration-300"
            >
              <HiGiftSolid class="w-5 h-5" />
              <span>Wishlist</span>
              <span class="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                {wishlist.items.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Gift Repository */}
          <div class="flex-1">
            {/* Search and Filters */}
            <div class="bg-white rounded-3xl shadow-xl shadow-pink-100 p-6 mb-8">
              <div class="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div class="relative flex-1">
                  <HiMagnifyingGlassSolid class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search gifts..."
                    bind:value={searchQuery}
                    class="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all duration-200"
                  />
                </div>

                {/* Category Filter */}
                <div class="relative">
                  <HiFunnelSolid class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    bind:value={selectedCategory}
                    title="Filter by category"
                    aria-label="Filter by category"
                    class="appearance-none pl-12 pr-10 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all duration-200 cursor-pointer min-w-[200px]"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? '✨ All Categories' : `${categoryEmojis[cat]} ${categoryLabels[cat]}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Gift Grid */}
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGifts.value.map(gift => {
                const inWishlist = wishlist.items.some(item => item.gift.id === gift.id);
                return (
                  <div
                    key={gift.id}
                    class={`group relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${inWishlist ? 'ring-2 ring-pink-400 ring-offset-2' : ''}`}
                  >
                    {/* Image */}
                    <div class="relative h-48 overflow-hidden">
                      <img
                        src={gift.imageUrl}
                        alt={gift.name}
                        width={400}
                        height={300}
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div class="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Category Badge */}
                      <div class="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-medium text-gray-700">
                        {categoryEmojis[gift.category]} {categoryLabels[gift.category]}
                      </div>

                      {/* In Wishlist Badge */}
                      {inWishlist && (
                        <div class="absolute top-3 right-3 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                          <HiCheckCircleSolid class="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div class="p-5">
                      <div class="mb-2">
                        {gift.brand && (
                          <span class="text-xs font-semibold text-pink-500 uppercase tracking-wide">
                            {gift.brand}
                          </span>
                        )}
                        <h3 class="text-lg font-bold text-gray-800 line-clamp-1">{gift.name}</h3>
                      </div>
                      <p class="text-sm text-gray-500 line-clamp-2 mb-4">{gift.description}</p>
                      
                      <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-gray-800">
                          €{gift.price.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                        </span>

                        {!inWishlist ? (
                          <div class="flex gap-2">
                            <button
                              onClick$={() => addToWishlist(gift, 'product')}
                              class="p-2 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors group/btn"
                              title="Add as product"
                            >
                              <HiGiftSolid class="w-5 h-5" />
                            </button>
                            <button
                              onClick$={() => addToWishlist(gift, 'monetary')}
                              class="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors group/btn"
                              title="Add as monetary value"
                            >
                              <HiBanknotesOutline class="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick$={() => removeFromWishlist(gift.id)}
                            class="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            title="Remove from wishlist"
                          >
                            <HiTrashSolid class="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredGifts.value.length === 0 && (
              <div class="text-center py-16">
                <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <HiMagnifyingGlassSolid class="w-10 h-10 text-gray-300" />
                </div>
                <h3 class="text-lg font-medium text-gray-600">No gifts found</h3>
                <p class="text-gray-400">Try adjusting your search or filter</p>
              </div>
            )}
          </div>

          {/* Mobile Backdrop */}
          {showWishlist.value && (
            <div
              class="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick$={() => showWishlist.value = false}
            />
          )}

          {/* Wishlist Sidebar / Mobile Drawer */}
          <div class={`
            fixed inset-y-0 right-0 z-50 w-full max-w-md transform transition-transform duration-300 ease-out
            lg:relative lg:inset-auto lg:z-auto lg:w-96 lg:max-w-none lg:transform-none lg:transition-none
            ${showWishlist.value ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}>
            <div class="h-full lg:h-auto lg:sticky lg:top-28 bg-white lg:rounded-3xl shadow-xl shadow-pink-100 overflow-hidden flex flex-col">
              <div class="bg-linear-to-r from-pink-500 to-rose-500 p-6 flex items-start justify-between">
                <div>
                  <h2 class="text-xl font-bold text-white flex items-center gap-2">
                    <HiGiftSolid class="w-6 h-6" />
                    Your Wishlist
                  </h2>
                  <p class="text-pink-100 text-sm mt-1">
                    {wishlist.items.length} {wishlist.items.length === 1 ? 'item' : 'items'} selected
                  </p>
                </div>
                <button
                  onClick$={() => showWishlist.value = false}
                  class="lg:hidden p-2 -mr-2 -mt-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close wishlist"
                >
                  <HiXMarkSolid class="w-6 h-6" />
                </button>
              </div>

              <div class="p-4 flex-1 overflow-y-auto lg:max-h-[calc(100vh-320px)]">
                {wishlist.items.length === 0 ? (
                  <div class="text-center py-12">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
                      <HiPlusCircleSolid class="w-8 h-8 text-pink-300" />
                    </div>
                    <p class="text-gray-500 text-sm">
                      Start adding gifts to your wishlist
                    </p>
                  </div>
                ) : (
                  <div class="space-y-3">
                    {wishlist.items.map(item => (
                      <div
                        key={item.gift.id}
                        class="group flex gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-pink-50 transition-colors"
                      >
                        <img
                          src={item.gift.imageUrl}
                          alt={item.gift.name}
                          width={64}
                          height={64}
                          class="w-16 h-16 rounded-xl object-cover"
                        />
                        <div class="flex-1 min-w-0">
                          <h4 class="font-medium text-gray-800 text-sm line-clamp-1">
                            {item.gift.name}
                          </h4>
                          <p class="text-sm font-semibold text-pink-600">
                            €{item.gift.price.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                          </p>
                          
                          {/* Preference Toggle */}
                          <div class="flex gap-1 mt-2">
                            <button
                              onClick$={() => updatePreference(item.gift.id, 'product')}
                              class={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                                item.preference === 'product'
                                  ? 'bg-pink-500 text-white'
                                  : 'bg-white text-gray-500 hover:bg-pink-100'
                              }`}
                            >
                              <HiGiftSolid class="w-3 h-3" />
                              Product
                            </button>
                            <button
                              onClick$={() => updatePreference(item.gift.id, 'monetary')}
                              class={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                                item.preference === 'monetary'
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-white text-gray-500 hover:bg-emerald-100'
                              }`}
                            >
                              <HiBanknotesOutline class="w-3 h-3" />
                              Money
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick$={() => removeFromWishlist(item.gift.id)}
                          title="Remove from wishlist"
                          aria-label="Remove from wishlist"
                          class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <HiTrashSolid class="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total */}
              {wishlist.items.length > 0 && (
                <div class="border-t border-gray-100 p-4 bg-gray-50">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-gray-600 font-medium">Total Value</span>
                    <span class="text-2xl font-bold text-gray-800">
                      €{totalValue.value.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div class="flex flex-col gap-3">
                    <button class="w-full py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 transition-all duration-300">
                      Save Wishlist
                    </button>
                    <button 
                      onClick$={() => nav('/list/123')}
                      class="w-full py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <HiEnvelopeSolid class="w-5 h-5" />
                      Invite Guests
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Manage Your Wishlist | Wedding Gifts',
  meta: [
    {
      name: 'description',
      content: 'Create and manage your perfect wedding gift wishlist',
    },
  ],
};
