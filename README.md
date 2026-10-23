# Botswana Safari Experiences

Botswana Safari Experiences is a premium safari discovery and enquiry PWA for independent safari operators, boutique lodges, luxury camps and mobile safari companies across Botswana.

## Customer journey

1. Browse safari stays, guided game drives, mobile safaris and nature or cultural experiences.
2. Add experiences to one trip request, or describe the kind of journey you are looking for.
3. Submit contact details, preferred destination, travel dates, group size, accommodation preferences and notes for review.
4. After submission, create a customer account to keep enquiries associated with the same Firebase identity, or continue as a guest.

A trip request is not a confirmed booking. The tourism operator reviews availability, pricing and itinerary details before confirming anything.

## Customer account

The account page supports email/password sign-in and account creation. When a guest creates an account during the enquiry journey, the existing anonymous Firebase user is linked to the new credential so the customer identity and associated enquiries are preserved.

## Progressive web app

- The install card is dismissible and calls the browser's native install prompt when the browser provides one.
- On iPhone and iPad, installation is handled through Safari's Share menu and **Add to Home Screen**; Chromium's `beforeinstallprompt` event is not a universal iOS installation mechanism.
- The service worker uses an Africhiko-specific cache namespace (preserved unchanged under the installation lock) to keep this app's cached shell separate from other projects.

## Operations

The `/admin` route is the staff surface for reviewing trip enquiries, managing safari experiences, publishing landing-page updates and maintaining featured listings. It depends on the tourism Firebase project configuration and the project's configured staff authorization.

## Stack

- Next.js 15 / React 19 / TypeScript
- Firebase Authentication and Cloud Firestore
- UploadThing for trip-request attachments and admin media uploads
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

## QA checkpoint

Before release, verify the latest `main` commit has a successful GitHub Actions run and a successful Vercel deployment; neither should be inferred from a push alone. In the deployed app, submit a guest trip request and confirm it appears in the admin inbox, update its status and notes, and reload to confirm persistence. Test experience, announcement and featured-listing CRUD, UploadThing media persistence, customer data isolation, admin-only writes, analytics events, mobile layout and the protected PWA installation flow. Publish and test the Firestore rules for `tourism-5b2a0`, and confirm the server-only Firebase Admin and UploadThing secrets are configured before expecting those integrations to work.

Never commit `.env.local`, service-account credentials or other private secrets.
