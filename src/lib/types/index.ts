export type GiftPreference = 'product' | 'monetary';

export interface Gift {
  id: string;
  name: string;
  description: string;
  price: number;
  category: GiftCategory;
  imageUrl: string;
  brand?: string;
}

export interface WishlistItem {
  gift: Gift;
  preference: GiftPreference;
  addedAt: Date;
  notes?: string;
}

export type GiftCategory = 
  | 'kitchen'
  | 'bedroom'
  | 'living'
  | 'garden'
  | 'electronics'
  | 'experiences'
  | 'travel';

export const categoryLabels: Record<GiftCategory, string> = {
  kitchen: 'Kitchen & Dining',
  bedroom: 'Bedroom & Bath',
  living: 'Living Room',
  garden: 'Garden & Outdoor',
  electronics: 'Electronics',
  experiences: 'Experiences',
  travel: 'Travel & Honeymoon',
};

export const categoryEmojis: Record<GiftCategory, string> = {
  kitchen: '🍳',
  bedroom: '🛏️',
  living: '🛋️',
  garden: '🌻',
  electronics: '📱',
  experiences: '🎭',
  travel: '✈️',
};

// Admin / Franchisee types
export type InviteStatus = 'pending' | 'accepted' | 'expired';
export type ClientStatus = 'active' | 'completed' | 'inactive';

export interface Invite {
  id: string;
  email: string;
  brideName: string;
  partnerName?: string;
  weddingDate?: Date;
  sentAt: Date;
  expiresAt: Date;
  status: InviteStatus;
}

export interface Client {
  id: string;
  brideName: string;
  partnerName?: string;
  email: string;
  phone?: string;
  weddingDate?: Date;
  registeredAt: Date;
  status: ClientStatus;
  totalGiftsValue: number;
  commissionEarned: number;
  giftCount: number;
}

export interface FranchiseeStats {
  totalClients: number;
  activeClients: number;
  pendingInvites: number;
  totalRevenue: number;
  totalCommission: number;
  thisMonthRevenue: number;
  thisMonthClients: number;
}

// Authentication types
export type UserRole = 'client' | 'franchisee';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  // Additional fields based on role
  clientId?: string; // For clients (brides)
  franchiseeId?: string; // For franchisees
}

