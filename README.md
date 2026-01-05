# 💍 Wedding Gifts

A modern wedding gift registry platform built with Qwik, featuring a franchise business model that connects couples with curated gift collections through local wedding specialists.

## Overview

Wedding Gifts is a multi-tenant gift registry application that serves three distinct user groups:

- **Couples** — Create and manage personalized wedding wishlists
- **Wedding Guests** — Browse registries and purchase gifts for the happy couple
- **Franchisees** — Wedding planners and businesses who onboard couples and earn commission

## Features

### For Couples
- Browse a curated catalog of wedding gifts across multiple categories
- Create personalized wishlists with preference options (physical product or monetary contribution)
- Share registry links with wedding guests
- Track purchased and available gifts

### For Wedding Guests
- View couple's registry via shareable link
- Purchase gifts directly through the platform
- Leave personal messages for the couple
- See real-time availability (prevents duplicate gifts)

### For Franchisees
- Dedicated dashboard to manage client relationships
- Invite brides via email with unique registration links
- Track revenue and commission earnings (10%)
- Monitor client activity and wedding timelines

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Qwik](https://qwik.dev/) | Frontend framework with resumability |
| [Qwik City](https://qwik.dev/qwikcity/overview/) | File-based routing & SSR |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vitejs.dev/) | Build tooling & dev server |
| [@qwikest/icons](https://github.com/qwikest/icons) | Heroicons integration |

## Project Structure

```
wedding-gifts/
├── public/                    # Static assets
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── header/
│   │   └── router-head/
│   ├── lib/
│   │   ├── data/             # Data repositories & mock data
│   │   │   └── gift-repository.ts
│   │   └── types/            # TypeScript type definitions
│   │       └── index.ts
│   ├── media/                # Media assets
│   ├── routes/               # File-based routing
│   │   ├── (app)/            # Main app layout group
│   │   ├── admin/            # Franchisee dashboard
│   │   ├── client/           # Couple's wishlist management
│   │   ├── invite/[token]/   # Invitation acceptance flow
│   │   ├── list/[id]/        # Public gift registry (guest view)
│   │   ├── login/            # Authentication
│   │   └── register/         # Franchisee registration
│   ├── global.css            # Global styles
│   └── root.tsx              # App root component
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18.17.0+ / 20.3.0+ / 21.0.0+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/wedding-gifts.git
cd wedding-gifts

# Install dependencies
npm install
```

### Development

```bash
# Start development server with SSR
npm start

# Or alternatively
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

### Other Commands

```bash
# Type checking
npm run build.types

# Linting
npm run lint

# Format code
npm run fmt

# Check formatting
npm run fmt.check
```

## Gift Categories

The platform organizes gifts into the following categories:

| Category | Description |
|----------|-------------|
| 🍳 Kitchen & Dining | Cookware, appliances, tableware |
| 🛏️ Bedroom & Bath | Bedding, towels, bathroom accessories |
| 🛋️ Living Room | Furniture, decor, entertainment |
| 🌻 Garden & Outdoor | Patio furniture, gardening tools |
| 📱 Electronics | Smart home devices, gadgets |
| 🎭 Experiences | Cooking classes, spa days, activities |
| ✈️ Travel & Honeymoon | Flight contributions, hotel stays |

## Application Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | User authentication |
| `/register` | Franchisee registration |
| `/admin` | Franchisee dashboard |
| `/client` | Couple's wishlist builder |
| `/invite/[token]` | Invitation acceptance |
| `/list/[id]` | Public registry for guests |

## Business Model

```
┌──────────────┐     invites      ┌──────────────┐
│  Franchisee  │ ───────────────▶ │    Couple    │
│   (Admin)    │                  │   (Client)   │
└──────────────┘                  └──────────────┘
       │                                 │
       │ earns 10%                       │ creates
       │ commission                      │ wishlist
       ▼                                 ▼
┌──────────────┐    purchases     ┌──────────────┐
│   Platform   │ ◀─────────────── │    Guests    │
│   Revenue    │                  │              │
└──────────────┘                  └──────────────┘
```

## Deployment

This project can be deployed to various platforms. Use the Qwik CLI to add deployment adapters:

```bash
npm run qwik add
```

Available adapters include:
- Cloudflare Pages
- Netlify
- Vercel
- Node.js / Express
- Static Site Generation (SSG)

## Future Roadmap

- [ ] Database integration (PostgreSQL/Supabase)
- [ ] Payment processing (Stripe/Mollie)
- [ ] Email notifications
- [ ] Multi-language support (i18n)
- [ ] Admin analytics dashboard
- [ ] Mobile app (PWA)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

---

<p align="center">
  Built with ❤️ using <a href="https://qwik.dev/">Qwik</a>
</p>
