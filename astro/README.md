# Inkblot Crew - Astro Landing Page

A modern, component-based landing page built with Astro for the Inkblot Crew indie romance subscription box.

## Features

- **Component-based architecture** - Clean, reusable components
- **Modular CSS** - Design tokens and organized stylesheets
- **Shopify Integration** - Ready for Storefront API
- **TypeScript** - Full type safety
- **Responsive Design** - Mobile-first approach
- **Performance** - Zero JS by default, hydrate only where needed

## Project Structure

```
astro/
├── public/
│   ├── fonts/          # Custom fonts
│   ├── images/         # Images and videos
│   └── icons.svg       # SVG sprite
│
├── src/
│   ├── components/
│   │   ├── common/     # Button, Icon, Badge, etc.
│   │   ├── layout/     # Header, Footer, MobileMenu
│   │   ├── sections/   # Page sections
│   │   ├── cards/      # Card components
│   │   └── shopify/    # React components for Shopify
│   │
│   ├── layouts/        # Page layouts
│   ├── pages/          # Routes
│   ├── lib/            # Utilities (Shopify, Analytics)
│   └── styles/         # CSS modules
│       ├── tokens/     # Design tokens
│       ├── base/       # Reset and global styles
│       ├── components/ # Component styles
│       └── layout/     # Layout styles
│
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
cd astro
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Shopify Integration

### Setup

1. Create a Shopify store (or use existing)
2. Create a Storefront API access token in Shopify Admin
3. Create a `.env` file:

```env
PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token
```

### Usage

```typescript
import { getProducts, createCart } from '@lib/shopify';

// Get products
const products = await getProducts();

// Create cart and redirect to checkout
const cart = await createCart(variantId);
window.location.href = cart.checkoutUrl;
```

## Design Tokens

All design tokens are defined in `src/styles/tokens/`:

- **Colors** - Brand colors and semantic aliases
- **Typography** - Font families and fluid sizes
- **Spacing** - Consistent spacing scale
- **Shadows** - Box shadows and effects

Example:
```css
.my-component {
  color: var(--color-text-primary);
  font-size: var(--text-lg);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}
```

## Components

### Button

```astro
<Button 
  href="#join" 
  variant="primary" 
  size="lg" 
  icon="arrow-right"
>
  Join the Crew
</Button>
```

### Icon (SVG Sprite)

```astro
<Icon name="heart" size={24} />
```

Available icons: `cart`, `user`, `check`, `plus`, `close`, `arrow-right`, `book`, `heart`, `community`, etc.

### Section Header

```astro
<SectionHeader 
  title="what's in the box?"
  subtitle="Every quarterly drop is packed with romance reader essentials"
/>
```

## Adding New Components

1. Create component in appropriate folder
2. Add styles to relevant CSS file (or use scoped `<style>` tags)
3. Import and use in pages

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

Connect your Git repo or drag-and-drop the `dist` folder.

### GitHub Pages

Use the included `.github/workflows/deploy.yml` (update for Astro).

## Migrating from Original HTML

The original `index.html` has been broken down into:

| Original | Astro Components |
|----------|------------------|
| Hero section | `Hero.astro`, `HeroCarousel.astro` |
| About section | `About.astro`, `FeatureCard.astro` |
| Steps section | `HowItWorks.astro`, `StepCard.astro` |
| Box section | `WhatsInside.astro`, `BoxCard.astro` |
| Testimonials | `Testimonials.astro`, `TestimonialCard.astro` |
| Pricing | `Pricing.astro`, `PricingCard.astro` |
| Audience | `Audience.astro`, `AudienceCard.astro` |
| Partnership | `Partnership.astro`, `PartnershipCard.astro` |
| FAQ | `FAQ.astro` |
| Signup form | `SignupCTA.astro` |
| Header | `Header.astro`, `MobileMenu.astro` |
| Footer | `Footer.astro` |
| Login modal | `LoginModal.astro` |

## License

Private - Inkblot Crew
