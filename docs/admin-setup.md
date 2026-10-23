# Facilities Management admin setup

Facilities Management uses Firebase Authentication and Cloud Firestore for the customer account and service-request flows. Customers can submit a request without creating an account first, then link a Google or email/password credential when they want to keep requests associated with an account.

## One-time configuration

1. Open the **tourism-5b2a0** Firebase project.
2. In Authentication → Sign-in method, enable Anonymous and Email/Password. Enable Google if customers should use Google sign-in.
3. Configure the public Firebase web settings using the `NEXT_PUBLIC_FIREBASE_*` variables in `.env.local`.
4. Set `ADMIN_PASSWORD` as a **server-only** environment variable. It is checked by the `/api/admin/access` route and must never be exposed through a `NEXT_PUBLIC_*` variable.
5. Set `FIREBASE_ADMIN_KEY` to the Firebase service-account JSON, stored securely in the local environment or deployment settings. The admin access route needs it to verify the session and provision `admins/{uid}` with role `owner`. Never commit the key.
6. Open `/admin` and enter the configured admin password. If the service-account key is missing or invalid, access cannot be provisioned even when the password is correct.

## Firestore access model

- `services`: publicly readable catalogue; only an authorized owner/staff member may create, edit or hide services.
- `enquiries`: a signed-in guest or customer may create a request for their own Auth UID. Customers can read only their own requests. Owner/staff can read the inbox and update operational status, staff notes and follow-up date.
- `admins`: the user can read their own role document; clients cannot directly write role documents. The trusted server route provisions the initial owner role.
- `workFeed` and `announcements`: only active records appear publicly; authorized staff manage publication and edits.
- Other collections are denied unless an explicit rule is added for an implemented feature.

The customer form and admin media manager use UploadThing for file uploads. Uploads require the UploadThing environment token and internet access. Do not deploy Firebase Storage rules as part of this branding/content pass.

## Customer account flow

Customers may submit their first service request without creating an account. After a successful submission, the app offers account creation/sign-in. Linking an anonymous user to a supported credential preserves the same Auth UID, allowing the request to remain associated with that customer. If the browser session is lost before linking, the anonymous request is not automatically merged into a different account.
