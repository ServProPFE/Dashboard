# ServPro Dashboard (Provider/Admin)

Back-office web app for providers and admins to manage services, bookings, offers, invoices, portfolio, and availability.

## Tech Stack
- React 19 + Vite
- React Router
- Fetch-based API client

## Requirements
- Node.js 18+
- Backend running on `http://localhost:4000`

## Setup
```bash
npm install
```

Create `.env` (or copy `.env.example`) and set:
```
VITE_API_BASE_URL=http://localhost:4000
```

## Run
```bash
npm run dev
```

Default dev URL: `http://localhost:5174`

## Role Access
- PROVIDER: services, bookings, offers, portfolio, availability, invoices (read-only)
- ADMIN: services, bookings, offers, invoices (create/update/delete)

## Key Routes
- `/` Dashboard
- `/services` Manage services
- `/bookings` Manage booking statuses
- `/offers` Manage offers (table view)
- `/invoices` Invoices (admin can create)
- `/portfolio` Portfolio (provider only)
- `/availability` Availability (provider only)

## API Notes
- List endpoints return `{ items: [...] }`.
- Booking status updates use `PATCH /bookings/:id/status`.

## Common Issues
- Forbidden on invoices: only ADMIN can create/update/delete.
- 404 or HTML response: confirm `VITE_API_BASE_URL` is set to the backend port.
