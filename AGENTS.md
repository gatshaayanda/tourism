# Facilities Management — Project Operating Contract

## Product and source of truth
Facilities is a customer-first facilities management and maintenance PWA for Botswana commercial properties, offices, schools, retail sites and hospitality facilities. The product owner is the final reviewer; the implementer must inspect actual repository state before making changes. GitHub, this file, and the project documentation are the source of truth. Do not carry instructions, identity, Firebase configuration, contacts, or business data over from another project.

## Core customer journey
1. Browse the maintenance service catalogue or describe a site issue.
2. Build and review a service request.
3. Submit name, phone, optional email, property/site location, site type, affected area, access requirements, quantity, selected services and notes.
4. Receive a truthful confirmation only after Firestore confirms the write.
5. Optionally create an account after submission to keep future enquiries together.
6. The facilities team reviews the request before any visit or maintenance work is confirmed.

Do not force account creation before an enquiry. Do not describe an enquiry as a confirmed quote, order, or accepted job. If a write fails, preserve the entered details and say the enquiry was not confirmed as saved.

## Firebase and data security
- Use the dedicated tourism Firebase project (tourism-5b2a0) and NEXT_PUBLIC_FIREBASE_* environment variables.
- admins/{uid} is provisioned outside the public client with role owner or staff.
- Public users may read the service catalogue, but only authorized staff may write services.
- Enquiry creation must be authenticated (anonymous auth is allowed), validated, and bound to request.auth.uid via customerId.
- Customers may read only enquiries whose customerId equals their Auth UID. Owner/staff can read the inbox and update only operational fields.
- Never open all Firestore access to work around a permission error. Match rules to the exact collections and fields used by the code.
- Guest-to-account linking must preserve the same anonymous Auth UID where supported. Do not claim automatic merging across unrelated accounts.
- Never commit .env.local, production credentials, service-account JSON or secrets.

## Media and integrations
UploadThing is used for customer reference attachments and admin-managed landing-page media. Verify the UploadThing token and route configuration before claiming uploads work. Do not move media to Firebase Storage or change Firebase Storage rules as an assumed requirement. Keep Firestore rules aligned with the existing authenticated customer/admin data model.

## PWA installation — protected infrastructure
The approved installation experience from Africhiko remains the permanent reference; preserve its runtime behavior in this project. Do not redesign, rewrite, refactor, replace, remove or alter the install mechanism, beforeinstallprompt lifecycle, event listeners, state, dismissible branded card, responsive positioning, manifest, icons or service-worker behaviour unless the product owner explicitly authorizes that specific installation change. For unrelated work, leave installation files untouched. For iOS Safari, describe Share → Add to Home Screen accurately; do not invent support for Chromium's beforeinstallprompt on iOS.

## Implementation and verification
- Customer experience first; admin/staff workflows second.
- Preserve working features and keep changes focused.
- Include useful validation, loading, empty, error and success feedback; no dead controls or fake success.
- Before a meaningful checkpoint, run npx tsc --noEmit, npm run lint and npm run build when the environment permits. Report checks that were not run honestly.
- Do not infer production deployment success from a GitHub push or a successful build.
- Never force-push or rewrite history.
- For each checkpoint report repository, branch, commit, changed files, verification, configuration still needed, exact QA steps and deployment status.

## Project identity
Use Facilities branding and the dedicated tourism project configuration in app-facing text and documentation. Search for and correct inherited identity leaks rather than copying another project's details.


## Admin access and work feed
- The admin page uses one access-word field. The word is verified only on the server using `ADMIN_PASSWORD`; never hardcode it into client code or expose it in a `NEXT_PUBLIC_*` variable.
- The server route also requires `FIREBASE_ADMIN_KEY` service-account JSON to provision the verified admin role. Configure both as server-only environment variables before expecting admin access to work.
- Completed-work examples live in `workFeed`; only published items are public. Interest signals are deduplicated per Firebase UID in `workInterests`, and customer identities must never be displayed publicly.
- Preserve the approved PWA installation mechanism and UX during unrelated work.
