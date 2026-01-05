import { component$, useSignal, useStore, $, useComputed$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import {
  HiUserPlusSolid,
  HiUserGroupSolid,
  HiCurrencyEuroSolid,
  HiClockSolid,
  HiEnvelopeSolid,
  HiCheckCircleSolid,
  HiXCircleSolid,
  HiArrowTrendingUpSolid,
  HiPaperAirplaneSolid,
  HiCalendarDaysSolid,
  HiPhoneSolid,
  HiMagnifyingGlassSolid,
  HiChartBarSolid,
  HiSparklesSolid,
} from '@qwikest/icons/heroicons';
import type { Client, Invite, FranchiseeStats, InviteStatus, ClientStatus } from '~/lib/types';

// Mock data for demonstration
const mockClients: Client[] = [
  {
    id: '1',
    brideName: 'Sophie de Vries',
    partnerName: 'Thomas Bakker',
    email: 'sophie@example.com',
    phone: '+31 6 12345678',
    weddingDate: new Date('2026-06-15'),
    registeredAt: new Date('2025-12-01'),
    status: 'active',
    totalGiftsValue: 4250,
    commissionEarned: 425,
    giftCount: 24,
  },
  {
    id: '2',
    brideName: 'Emma Jansen',
    partnerName: 'Lucas van Dijk',
    email: 'emma.j@example.com',
    phone: '+31 6 98765432',
    weddingDate: new Date('2026-08-22'),
    registeredAt: new Date('2025-11-15'),
    status: 'active',
    totalGiftsValue: 3180,
    commissionEarned: 318,
    giftCount: 18,
  },
  {
    id: '3',
    brideName: 'Lisa Smit',
    partnerName: 'Daan Visser',
    email: 'lisa.smit@example.com',
    weddingDate: new Date('2025-09-10'),
    registeredAt: new Date('2025-05-20'),
    status: 'completed',
    totalGiftsValue: 5600,
    commissionEarned: 560,
    giftCount: 32,
  },
  {
    id: '4',
    brideName: 'Anna Mulder',
    partnerName: 'Bram de Jong',
    email: 'anna.m@example.com',
    phone: '+31 6 55544433',
    weddingDate: new Date('2026-04-05'),
    registeredAt: new Date('2025-12-20'),
    status: 'active',
    totalGiftsValue: 1890,
    commissionEarned: 189,
    giftCount: 12,
  },
];

const mockInvites: Invite[] = [
  {
    id: '1',
    email: 'maria.k@example.com',
    brideName: 'Maria Kuiper',
    partnerName: 'Jan Peters',
    weddingDate: new Date('2026-07-20'),
    sentAt: new Date('2025-12-28'),
    expiresAt: new Date('2026-01-11'),
    status: 'pending',
  },
  {
    id: '2',
    email: 'nina.b@example.com',
    brideName: 'Nina Bos',
    sentAt: new Date('2025-12-15'),
    expiresAt: new Date('2025-12-29'),
    status: 'expired',
  },
];

const mockStats: FranchiseeStats = {
  totalClients: 4,
  activeClients: 3,
  pendingInvites: 1,
  totalRevenue: 14920,
  totalCommission: 1492,
  thisMonthRevenue: 2450,
  thisMonthClients: 2,
};

export default component$(() => {
  const searchQuery = useSignal('');
  const activeTab = useSignal<'clients' | 'invites'>('clients');
  const showInviteModal = useSignal(false);
  
  // Invite form signals
  const inviteBrideName = useSignal('');
  const invitePartnerName = useSignal('');
  const inviteEmail = useSignal('');
  const inviteWeddingDate = useSignal('');

  const clients = useStore<{ items: Client[] }>({ items: [...mockClients] });
  const invites = useStore<{ items: Invite[] }>({ items: [...mockInvites] });
  const stats = useStore<FranchiseeStats>({ ...mockStats });

  const filteredClients = useComputed$(() => {
    return clients.items.filter(client =>
      client.brideName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (client.partnerName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ?? false)
    );
  });

  const filteredInvites = useComputed$(() => {
    return invites.items.filter(invite =>
      invite.brideName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      invite.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  const sendInvite = $(() => {
    if (!inviteEmail.value || !inviteBrideName.value) return;

    const newInvite: Invite = {
      id: Date.now().toString(),
      email: inviteEmail.value,
      brideName: inviteBrideName.value,
      partnerName: invitePartnerName.value || undefined,
      weddingDate: inviteWeddingDate.value ? new Date(inviteWeddingDate.value) : undefined,
      sentAt: new Date(),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      status: 'pending',
    };

    invites.items.unshift(newInvite);
    stats.pendingInvites++;

    // Reset form
    inviteBrideName.value = '';
    invitePartnerName.value = '';
    inviteEmail.value = '';
    inviteWeddingDate.value = '';
    showInviteModal.value = false;
  });

  const resendInvite = $((inviteId: string) => {
    const invite = invites.items.find(i => i.id === inviteId);
    if (invite) {
      invite.sentAt = new Date();
      invite.expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      invite.status = 'pending';
    }
  });

  const cancelInvite = $((inviteId: string) => {
    const index = invites.items.findIndex(i => i.id === inviteId);
    if (index > -1) {
      invites.items.splice(index, 1);
      stats.pendingInvites = Math.max(0, stats.pendingInvites - 1);
    }
  });

  const getStatusColor = (status: ClientStatus | InviteStatus) => {
    switch (status) {
      case 'active':
      case 'accepted':
        return 'bg-rose-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'completed':
        return 'bg-sky-100 text-sky-700';
      case 'expired':
      case 'inactive':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div class="min-h-dvh bg-slate-50">
      {/* Header */}
      <header class="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-linear-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-200">
                <HiChartBarSolid class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 class="text-2xl font-bold text-slate-800">
                  Franchisee Dashboard
                </h1>
                <p class="text-sm text-slate-500">Manage your clients & invitations</p>
              </div>
            </div>

            <button
              onClick$={() => showInviteModal.value = true}
              class="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-0.5 transition-all duration-300"
            >
              <HiUserPlusSolid class="w-5 h-5" />
              <span>Invite New Client</span>
            </button>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Clients */}
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                <HiUserGroupSolid class="w-5 h-5 text-pink-600" />
              </div>
              <span class="flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                <HiArrowTrendingUpSolid class="w-3 h-3" />
                +{stats.thisMonthClients} this month
              </span>
            </div>
            <p class="text-3xl font-bold text-slate-800">{stats.totalClients}</p>
            <p class="text-sm text-slate-500 mt-1">Total Clients</p>
          </div>

          {/* Active Clients */}
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <HiSparklesSolid class="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <p class="text-3xl font-bold text-slate-800">{stats.activeClients}</p>
            <p class="text-sm text-slate-500 mt-1">Active Clients</p>
          </div>

          {/* Pending Invites */}
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <HiClockSolid class="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p class="text-3xl font-bold text-slate-800">{stats.pendingInvites}</p>
            <p class="text-sm text-slate-500 mt-1">Pending Invites</p>
          </div>

          {/* Commission Earned */}
          <div class="bg-linear-to-br from-pink-500 to-rose-500 rounded-2xl p-5 shadow-lg shadow-pink-200">
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <HiCurrencyEuroSolid class="w-5 h-5 text-white" />
              </div>
              <span class="flex items-center gap-1 text-xs font-medium text-white/80 bg-white/20 px-2 py-1 rounded-full">
                +{formatCurrency(stats.thisMonthRevenue)}
              </span>
            </div>
            <p class="text-3xl font-bold text-white">{formatCurrency(stats.totalCommission)}</p>
            <p class="text-sm text-pink-100 mt-1">Total Commission</p>
          </div>
        </div>

        {/* Tabs & Search */}
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-slate-100">
            {/* Tabs */}
            <div class="flex gap-2">
              <button
                onClick$={() => activeTab.value = 'clients'}
                class={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeTab.value === 'clients'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <HiUserGroupSolid class="w-4 h-4" />
                Clients
                <span class={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab.value === 'clients' ? 'bg-white/20' : 'bg-slate-200'
                }`}>
                  {clients.items.length}
                </span>
              </button>
              <button
                onClick$={() => activeTab.value = 'invites'}
                class={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  activeTab.value === 'invites'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <HiEnvelopeSolid class="w-4 h-4" />
                Invitations
                <span class={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab.value === 'invites' ? 'bg-white/20' : 'bg-slate-200'
                }`}>
                  {invites.items.length}
                </span>
              </button>
            </div>

            {/* Search */}
            <div class="relative">
              <HiMagnifyingGlassSolid class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab.value}...`}
                bind:value={searchQuery}
                class="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-pink-300 focus:bg-white transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Clients Tab */}
          {activeTab.value === 'clients' && (
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-slate-100">
                    <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Client</th>
                    <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Contact</th>
                    <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Wedding Date</th>
                    <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                    <th class="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Value</th>
                    <th class="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Commission</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  {filteredClients.value.map(client => (
                    <tr key={client.id} class="hover:bg-slate-50/50 transition-colors">
                      <td class="px-4 py-4">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-full bg-linear-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                            {client.brideName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p class="font-medium text-slate-800">{client.brideName}</p>
                            {client.partnerName && (
                              <p class="text-sm text-slate-500">& {client.partnerName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-4 hidden sm:table-cell">
                        <div class="space-y-1">
                          <p class="text-sm text-slate-600 flex items-center gap-1.5">
                            <HiEnvelopeSolid class="w-3.5 h-3.5 text-slate-400" />
                            {client.email}
                          </p>
                          {client.phone && (
                            <p class="text-sm text-slate-500 flex items-center gap-1.5">
                              <HiPhoneSolid class="w-3.5 h-3.5 text-slate-400" />
                              {client.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td class="px-4 py-4 hidden md:table-cell">
                        <div class="flex items-center gap-1.5 text-sm text-slate-600">
                          <HiCalendarDaysSolid class="w-4 h-4 text-slate-400" />
                          {formatDate(client.weddingDate)}
                        </div>
                      </td>
                      <td class="px-4 py-4">
                        <span class={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </td>
                      <td class="px-4 py-4 text-right">
                        <p class="font-semibold text-slate-800">{formatCurrency(client.totalGiftsValue)}</p>
                        <p class="text-xs text-slate-500">{client.giftCount} gifts</p>
                      </td>
                      <td class="px-4 py-4 text-right hidden lg:table-cell">
                        <p class="font-semibold text-rose-600">{formatCurrency(client.commissionEarned)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredClients.value.length === 0 && (
                <div class="text-center py-12">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <HiUserGroupSolid class="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 class="text-lg font-medium text-slate-600">No clients found</h3>
                  <p class="text-slate-400 text-sm mt-1">Try adjusting your search or invite new clients</p>
                </div>
              )}
            </div>
          )}

          {/* Invites Tab */}
          {activeTab.value === 'invites' && (
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-slate-100">
                    <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Invitee</th>
                    <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Email</th>
                    <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Sent</th>
                    <th class="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                    <th class="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  {filteredInvites.value.map(invite => (
                    <tr key={invite.id} class="hover:bg-slate-50/50 transition-colors">
                      <td class="px-4 py-4">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                            {invite.brideName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p class="font-medium text-slate-800">{invite.brideName}</p>
                            {invite.partnerName && (
                              <p class="text-sm text-slate-500">& {invite.partnerName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-4 hidden sm:table-cell">
                        <p class="text-sm text-slate-600">{invite.email}</p>
                      </td>
                      <td class="px-4 py-4 hidden md:table-cell">
                        <p class="text-sm text-slate-600">{formatDate(invite.sentAt)}</p>
                        <p class="text-xs text-slate-400">Expires {formatDate(invite.expiresAt)}</p>
                      </td>
                      <td class="px-4 py-4">
                        <span class={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(invite.status)}`}>
                          {invite.status}
                        </span>
                      </td>
                      <td class="px-4 py-4">
                        <div class="flex items-center justify-end gap-2">
                          {invite.status !== 'accepted' && (
                            <>
                              <button
                                onClick$={() => resendInvite(invite.id)}
                                class="p-2 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors"
                                title="Resend invite"
                              >
                                <HiPaperAirplaneSolid class="w-4 h-4" />
                              </button>
                              <button
                                onClick$={() => cancelInvite(invite.id)}
                                class="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                title="Cancel invite"
                              >
                                <HiXCircleSolid class="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {invite.status === 'accepted' && (
                            <span class="p-2 text-emerald-500">
                              <HiCheckCircleSolid class="w-5 h-5" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredInvites.value.length === 0 && (
                <div class="text-center py-12">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <HiEnvelopeSolid class="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 class="text-lg font-medium text-slate-600">No invitations found</h3>
                  <p class="text-slate-400 text-sm mt-1">Send your first invite to get started</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Revenue Summary Card */}
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <HiCurrencyEuroSolid class="w-5 h-5 text-pink-500" />
            Revenue Overview
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div class="text-center p-4 rounded-xl bg-slate-50">
              <p class="text-sm text-slate-500 mb-1">Total Gift Value</p>
              <p class="text-2xl font-bold text-slate-800">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div class="text-center p-4 rounded-xl bg-rose-50">
              <p class="text-sm text-rose-600 mb-1">Your Commission (10%)</p>
              <p class="text-2xl font-bold text-rose-600">{formatCurrency(stats.totalCommission)}</p>
            </div>
            <div class="text-center p-4 rounded-xl bg-pink-50">
              <p class="text-sm text-pink-600 mb-1">This Month</p>
              <p class="text-2xl font-bold text-pink-600">{formatCurrency(stats.thisMonthRevenue * 0.1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal.value && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick$={() => showInviteModal.value = false}
          />

          {/* Modal */}
          <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div class="bg-linear-to-r from-pink-500 to-rose-500 p-6">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <HiUserPlusSolid class="w-6 h-6" />
                Invite New Client
              </h2>
              <p class="text-pink-100 text-sm mt-1">
                Send an invitation to a bride-to-be
              </p>
            </div>

            {/* Form */}
            <div class="p-6 space-y-4">
              <div>
                <label for="bride-name" class="block text-sm font-medium text-slate-700 mb-1.5">
                  Bride's Name *
                </label>
                <input
                  type="text"
                  id="bride-name"
                  bind:value={inviteBrideName}
                  placeholder="e.g., Sophie de Vries"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition"
                />
              </div>

              <div>
                <label for="partner-name" class="block text-sm font-medium text-slate-700 mb-1.5">
                  Partner's Name
                </label>
                <input
                  type="text"
                  id="partner-name"
                  bind:value={invitePartnerName}
                  placeholder="e.g., Thomas Bakker"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition"
                />
              </div>

              <div>
                <label for="invite-email" class="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="invite-email"
                  bind:value={inviteEmail}
                  placeholder="sophie@example.com"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition"
                />
              </div>

              <div>
                <label for="wedding-date" class="block text-sm font-medium text-slate-700 mb-1.5">
                  Wedding Date
                </label>
                <input
                  type="date"
                  id="wedding-date"
                  bind:value={inviteWeddingDate}
                  title="Select the wedding date"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition"
                />
              </div>

              <div class="flex gap-3 pt-4">
                <button
                  onClick$={() => showInviteModal.value = false}
                  class="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick$={sendInvite}
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-lg shadow-pink-200 hover:shadow-xl transition-all"
                >
                  <HiPaperAirplaneSolid class="w-4 h-4" />
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Franchisee Dashboard | Wedding Gifts',
  meta: [
    {
      name: 'description',
      content: 'Manage your wedding gifts franchise - invite clients and track your earnings',
    },
  ],
};
