# RailGaadi

> **Real-time Railway Journey Intelligence Platform**
> Live train tracking · Interactive maps · Journey analytics · Weather · Geographic context

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

If you encounter npm cache permission errors, fix with:

```bash
sudo chown -R $(whoami) ~/.npm
```

### 2. Configure environment

Copy the example env file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your API keys:

| Variable | Description |
|---|---|
| `RAILRADAR_API_KEY` | RailRadar live train API key |
| `OPENWEATHER_API_KEY` | OpenWeather API key |
| `OPENTOPOGRAPHY_API_KEY` | OpenTopography elevation API key |
| `NEXT_PUBLIC_MAPTILER_API_KEY` | MapTiler public map tile key |

> **Note:** `NEXT_PUBLIC_MOCK_MODE=true` is set by default — the app works fully with realistic mock data without any API keys.

### 3. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── api/              # Backend API routes (proxies external providers)
│   ├── journey/          # Train journey pages
│   ├── favourites/       # Favourites page
│   └── settings/         # Settings page
├── components/           # Shared UI components
│   ├── ui/               # Primitives (SearchBar, Skeleton, StatusBadge, Navigation)
│   ├── map/              # MapLibre map components
│   ├── train/            # Train-specific components
│   ├── analytics/        # Charts and analytics components
│   ├── weather/          # Weather components
│   └── geography/        # Nearby features components
├── features/             # Feature-level components (composed from components/)
├── hooks/                # TanStack Query hooks
├── services/             # Service layer (abstracts API calls)
├── providers/            # External API provider implementations
├── store/                # Zustand stores
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── constants/            # App config and environment vars
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Map | MapLibre GL JS + MapTiler |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| Charts | Recharts |
| Icons | Lucide React |
| Geo Utils | Turf.js |
| Validation | Zod |

---

## API Keys

### Getting API Keys (all have free tiers)

- **RailRadar**: Contact RailRadar for API access
- **MapTiler**: [maptiler.com/cloud](https://www.maptiler.com/cloud/) — Free 100k tiles/month
- **OpenWeather**: [openweathermap.org/api](https://openweathermap.org/api) — Free 1000 calls/day
- **OpenTopography**: [opentopography.org](https://opentopography.org) — Free registration

---

## Mock Mode

With `NEXT_PUBLIC_MOCK_MODE=true` (default), the app runs entirely on realistic mock data:

- **Train 12951 (Mumbai Rajdhani)** — fully mocked with live status, route GeoJSON, station timeline, analytics, elevation, weather, and nearby features
- Search returns 5 sample trains
- All API routes return mock responses

This allows full development and demonstration without API keys.

---

## Development Roadmap

| Phase | Status |
|---|---|
| Phase 1 — Foundation, Search, Live Tracking, Map | ✅ Complete |
| Phase 2 — Analytics, Elevation, Weather, Geography, UX Polish | ✅ Complete |
| Phase 3 — Notifications, PNR, Accounts | 🔜 Planned |

---

## License

Private. All rights reserved.
