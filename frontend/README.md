# Hybrid Image Steganography System - Frontend Architecture

> **Project Name**: Hybrid Image Steganography System Using Morse Code Encoding and Multi-Domain Data Embedding Techniques (LSB, DCT, DWT)  
> **Tech Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.

---

## Executive Summary

The **Hybrid Image Steganography System** is a state-of-the-art cybersecurity platform designed to securely embed confidential messages inside uncompressed 24-bit RGB digital image carriers (PNG & BMP).

By combining:
1. **Morse Code Pre-Modulation**: Obfuscating plaintext character structures.
2. **AES-256 GCM Cryptography**: Authenticated 256-bit symmetric encryption.
3. **Multi-Domain Embedding**: LSB (Spatial), DCT (Frequency), and DWT (Wavelet) domains.

---

## Project Structure

```text
frontend/
├── src/
│   ├── app/                    # Next.js 15 App Router Routes
│   │   ├── about/              # About Project Page (14 Sections)
│   │   ├── compare/            # Algorithm Benchmark Comparison
│   │   ├── contact/            # Support & Contact Gateway
│   │   ├── dashboard/          # Real-time Telemetry Dashboard
│   │   ├── decode/             # Hidden Message Extraction Workspace
│   │   ├── design-system/      # Token Catalog & Component Showcase
│   │   ├── documentation/      # Technical Guide (14 Topics)
│   │   ├── encode/             # Secret Message Encoding Workspace
│   │   ├── error.tsx           # Segment Error Boundary
│   │   ├── global-error.tsx    # Root Error Boundary
│   │   ├── loading.tsx         # Route Loading Fallback
│   │   ├── manifest.ts         # Dynamic Web App Manifest
│   │   ├── not-found.tsx       # Custom 404 Route
│   │   ├── robots.ts           # Dynamic robots.txt Handler
│   │   ├── sitemap.ts          # Dynamic sitemap.xml Indexer
│   │   ├── globals.css         # Custom Design Tokens & Utilities
│   │   ├── layout.tsx          # Root Layout & SEO Metadata
│   │   └── page.tsx            # Enterprise Landing Page
│   ├── components/
│   │   ├── animations/         # PageTransition & ScrollReveal
│   │   ├── cards/              # MetricCard & Feature Cards
│   │   ├── feedback/           # Skeletons, EmptyState, ErrorState, FeedbackModal
│   │   ├── layout/             # PageContainer, ContentWrapper, AppLayout
│   │   ├── navigation/         # Navbar, Sidebar, Footer, Breadcrumb, SkipToContent
│   │   └── ui/                 # Button, Badge, Input, Select, DragDropZone
│   ├── lib/
│   │   ├── animations.ts       # Centralized Framer Motion Motion Library
│   │   ├── performance.ts      # Core Web Vitals Monitoring
│   │   ├── theme-context.tsx   # Theme Provider
│   │   └── utils.ts            # Classnames & Helper Utilities
│   └── styles/
│       ├── animations.ts       # Transitions & Presets
│       └── design-tokens.ts    # Color & Spacing Constants
├── .env.example                # Environment Variable Template
├── next.config.ts              # Next.js 15 Config & Security Headers
├── package.json
└── tsconfig.json
```

---

## Local Development & Setup

### Prerequisites
- **Node.js**: `v18.17+` or `v20+`
- **Package Manager**: `npm` v9+

### Installation Steps

1. Clone repository & navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables template:
   ```bash
   cp .env.example .env.local
   ```

4. Launch dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Production Build & Verification

To test strict TypeScript types and generate production output:

```bash
# 1. Type Check
npm run type-check

# 2. Next.js Production Build
npm run build

# 3. Start Production Server
npm run start
```

---

## Production Security & Deployment

### HTTP Security Headers
Configured in `next.config.ts`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=63072000`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Deployment Targets
- **Vercel**: Zero-config deployment with automatic Next.js App Router optimization.
- **Docker / Kubernetes**: Set `output: "standalone"` in `next.config.ts` for containerized environments.
