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

The `firebaseConfig` block is at the top of the `<script>` section in `index.html`. The project is currently wired to `sphygmo-bed91`. To retarget a different project, replace the six fields (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).

A runtime check detects placeholder values and shows a warning banner — do not remove this check.

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

- All logic lives in `index.html`. There is no separate JS or CSS file.
- CDN load order is critical: `firebase-app-compat` → `firebase-auth-compat` → `firebase-ui-auth`. Do not reorder.
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
