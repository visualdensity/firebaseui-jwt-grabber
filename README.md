# FirebaseUI JWT Grabber

A minimal single-page tool for Firebase developers. Sign in with Google or Email/Password via FirebaseUI and instantly retrieve your Firebase ID token (JWT) to use in API testing tools like Postman or curl.

No backend. No build step. One file.

---

## Prerequisites

- A Firebase project with **Authentication** enabled
- Sign-in methods enabled in Firebase Console: **Google** and/or **Email/Password**
- [Podman](https://podman.io/) installed (for local serving)

---

## Setup

### 1. Clone or download

```bash
git clone <your-repo-url>
cd firebaseui-jwt-grabber
```

### 2. Add your Firebase config

Copy the example secrets file and fill in your credentials:

```bash
cp secrets.example.js secrets.js
```

Then open `secrets.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};
```

Credentials are in:  
**Firebase Console → Project Settings → Your apps → SDK setup and configuration**

> `secrets.js` is listed in `.gitignore` and will never be committed.

### 3. Add your domain to Firebase authorized domains

Google sign-in requires your serving domain to be allowlisted.

1. Go to **Firebase Console → Authentication → Settings → Authorized domains**
2. Add `localhost`

---

## Running locally with Podman + nginx

Serve the files over HTTP so Firebase Auth (especially Google popup sign-in) works correctly.

```bash
podman run --rm \
  -p 8080:80 \
  -v "$(pwd)/index.html:/usr/share/nginx/html/index.html:ro" \
  -v "$(pwd)/secrets.js:/usr/share/nginx/html/secrets.js:ro" \
  nginx:alpine
```

**Copy & Pasta**

```bash
podman run --name some-nginx -p 8080:80 -v /path/firebaseui-jwt-grabber:/usr/share/nginx/html:ro -d nginx
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

**Flags explained:**

| Flag | Purpose |
|------|---------|
| `--rm` | Remove container automatically when stopped |
| `-p 8080:80` | Map host port 8080 → container port 80 |
| `-v .../index.html:...:ro` | Mount `index.html` read-only into nginx's web root |
| `-v .../secrets.js:...:ro` | Mount `secrets.js` read-only into nginx's web root |
| `nginx:alpine` | Lightweight official nginx image |

To stop the container, press `Ctrl+C` in the terminal where it's running.

> **Port already in use?** Change `8080` to any free port, e.g. `-p 3000:80`, then open `http://localhost:3000`.

---

## Usage

1. Open the page in your browser
2. Sign in with **Google** (popup) or **Email/Password**
3. Your JWT is displayed immediately after sign-in
4. Click **Copy Token** to copy it to your clipboard
5. Paste into your API client (Postman, curl, Insomnia, etc.)

```bash
# Example curl usage with the copied token
curl -H "Authorization: Bearer <paste-token-here>" https://your-api.example.com/endpoint
```

**Refresh Token** fetches a fresh JWT on demand (tokens expire after 1 hour).  
**Sign Out** returns you to the sign-in screen.

---

## Troubleshooting

**"This domain is not authorized" error from Google**  
→ Add `localhost` to Firebase Console → Authentication → Settings → Authorized domains.

**Popup blocked by browser**  
→ FirebaseUI automatically falls back to redirect flow if the popup is blocked. Allow popups for `localhost` in your browser settings for a smoother experience.

**Copy button doesn't work**  
→ The `navigator.clipboard` API requires a secure context (HTTPS or `localhost`). If opening `index.html` directly as a `file://` URL, the fallback `execCommand` copy is used instead — select the token manually if that also fails.

**Config warning banner is showing**  
→ `secrets.js` is missing or still contains placeholder values. Run `cp secrets.example.js secrets.js` and fill in your credentials. See [Setup](#setup) above.

**`secrets.js` not found / blank page**  
→ nginx must be able to serve both `index.html` and `secrets.js`. Ensure both `-v` mounts are present in your `podman run` command.

---

## Project structure

```
firebaseui-jwt-grabber/
├── index.html          # The entire application
├── secrets.example.js  # Config template — committed, safe to share
├── secrets.js          # Your real credentials — gitignored, never committed
├── AGENTS.md           # Context for AI coding agents
└── README.md           # This file
```

---

## Legal

`tosUrl` and `privacyPolicyUrl` in the FirebaseUI config are set to `#` (placeholder). Replace these with real URLs if you deploy this tool for others to use.
