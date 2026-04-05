# FirebaseUI JWT Grabber Repository

## Project Overview

A single-file static web tool (`index.html`) that uses Google's FirebaseUI Auth to let developers sign in and retrieve a Firebase-issued JWT (ID token) for manual API testing. No backend, no build step.

## Architecture

- **Single file:** `index.html` — all HTML, CSS, and JS in one file, deployable anywhere static files are served (or opened directly via `file://`).
- **No framework / no bundler** — plain ES6, CDN dependencies only.
- **Auth:** FirebaseUI Web v6.1.0 over Firebase JS SDK v10 (compat mode).
  - Providers: Google (popup flow) and Email/Password.
  - `credentialHelper: NONE` — One-Tap/account-chooser disabled.
- **Token retrieval:** `onAuthStateChanged` → `user.getIdToken()` — token is decoded client-side to extract the `exp` claim for live expiry countdown.

## Firebase Configuration

`firebaseConfig` lives in `secrets.js` (gitignored — never committed). `secrets.example.js` is the committed template with placeholder values.

To retarget a different Firebase project, edit the six fields in `secrets.js` (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`). Do not edit `secrets.example.js` with real credentials.

`index.html` loads `secrets.js` via `<script src="secrets.js">` before its own inline script. A runtime check detects placeholder values (`apiKey === "YOUR_API_KEY"`) and shows a warning banner — do not remove this check.

## Key Functional Requirements

- Google sign-in via popup (FR-3)
- Email/Password sign-up and sign-in (FR-1, FR-2)
- JWT displayed in a read-only monospace textarea after login (FR-8)
- Live expiry countdown from the `exp` JWT claim; turns red under 5 minutes (FR-10)
- Copy Token button with `navigator.clipboard` + `execCommand` fallback for `file://` (FR-12–14)
- Refresh Token button calls `getIdToken(true)` (FR-15)
- Sign Out returns to FirebaseUI widget (FR-5)
- `tosUrl` and `privacyPolicyUrl` set to `#` — replace before production use (FR-7)

## Making Changes

- All application logic lives in `index.html`. The only separate JS file is `secrets.js` (config only).
- **Never put credentials in `index.html`** — all Firebase config must stay in `secrets.js`.
- CDN load order is critical: `firebase-app-compat` → `firebase-auth-compat` → `firebase-ui-auth` → `secrets.js` → inline script. Do not reorder.
- Do not switch from compat-mode Firebase SDK to the modular API — FirebaseUI v6 requires compat.
- The `signInSuccessWithAuthResult` callback must return `false` to suppress FirebaseUI's automatic redirect.

## Testing

Open `index.html` in a browser (locally or via any static host). Verify:
1. FirebaseUI widget renders with Google and Email/Password options.
2. Google sign-in opens a popup.
3. After sign-in, the JWT textarea populates and the expiry countdown starts.
4. Copy Token copies the full token; button shows "Copied!" for 2 seconds.
5. Refresh Token fetches a new token and resets the countdown.
6. Sign Out returns to the FirebaseUI widget.
