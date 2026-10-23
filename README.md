# Facilities Management Botswana

Facilities Management Botswana is a customer-first facilities maintenance PWA for commercial properties, offices, schools, retail sites and hospitality facilities in Botswana.

## Customer journey

1. Browse available maintenance services and review service information.
2. Add services to one service request, or describe a property maintenance issue.
3. Submit contact details, property/site location, affected area, access requirements and notes for review.
4. After submission, create a customer account to keep enquiries associated with the same Firebase identity, or continue as a guest.

A service request is not a confirmed booking. The facilities team reviews the details before arranging work.

## Customer account

The account page supports email/password sign-in and account creation. When a guest creates an account during the enquiry journey, the existing anonymous Firebase user is linked to the new credential so the customer identity and associated enquiries are preserved.

## Progressive web app

- The install card is dismissible and calls the browser's native install prompt when the browser provides one.
- On iPhone and iPad, installation is handled through Safari's Share menu and **Add to Home Screen**; Chromium's `beforeinstallprompt` event is not a universal iOS installation mechanism.
- The service worker uses an Africhiko-specific cache namespace (preserved unchanged under the installation lock) to keep this app's cached shell separate from other projects.

## Operations

The `/admin` route is the staff surface for reviewing service requests, managing maintenance services, publishing landing-page updates and maintaining completed-work examples. It depends on the tourism Firebase project configuration and the project's configured staff authorization.

## Stack

- Next.js 15 / React 19 / TypeScript
- Firebase Authentication and Cloud Firestore
- UploadThing for service-request attachments and admin media uploads
- Progressive Web App support
- Vercel Analytics and Speed Insights
- Vercel deployment from GitHub `main`

## Development

Install dependencies and run the local development server:

```bash
npm install
npm run dev
```

Before QA, configure the `NEXT_PUBLIC_FIREBASE_*` variables for tourism-5b2a0, the server-only `ADMIN_PASSWORD` and `FIREBASE_ADMIN_KEY`, and the UploadThing token. Review Firestore rules for the current customer/admin workflows. Do not deploy Storage rules as part of this UI adaptation. Run lint, type checks and a production build before considering the branch release-ready.

Never commit `.env.local`, service-account credentials or other private secrets.
